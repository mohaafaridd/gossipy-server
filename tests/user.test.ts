import '@babel/polyfill'
import jwt from 'jsonwebtoken'

import seed from './utils/seed'
import getClient from './utils/getClient'
import { signUp, signIn } from './utils/operations'
import { prisma } from '../src/generated/prisma-client'
import { userOne } from './utils/seed'
const client = getClient(null)
beforeEach(seed, 30000)

test('should register a user', async () => {
  const variables = {
    data: {
      name: 'Lionel Messi',
      email: 'messi@gmail.com',
      password: 'iamanalien',
    },
  }

  const response = await client.mutate({
    mutation: signUp,
    variables,
  })

  const userExists = await prisma.$exists.user({
    id: response.data.signUp.user.id,
  })

  expect(userExists).toBe(true)
})

test('should not register a user due to duplicated email', async () => {
  const variables = {
    data: {
      name: 'Cristiano Ronaldo',
      email: userOne.input.email,
      password: 'iamanalientoo',
    },
  }

  await expect(
    client.mutate({
      mutation: signUp,
      variables,
    })
  ).rejects.toThrow()
})

test('should not register a user due to weak password', async () => {
  const variables = {
    data: {
      name: 'Cristiano Ronaldo',
      email: 'chris@gmail.com',
      password: '123',
    },
  }

  await expect(
    client.mutate({
      mutation: signUp,
      variables,
    })
  ).rejects.toThrow()
})

test('should not register a user due to duplicated identifier', async () => {
  const variables = {
    data: {
      name: userOne.input.name,
      email: 'chris@gmail.com',
      password: '123',
    },
  }

  await expect(
    client.mutate({
      mutation: signUp,
      variables,
    })
  ).rejects.toThrow()
})

test('should login a user', async () => {
  const variables = {
    data: {
      email: userOne.input.email,
      password: userOne.input.password,
    },
  }

  const response = await client.mutate({
    mutation: signIn,
    variables,
  })

  const { token } = response.data.signIn
  const { userId } = jwt.verify(token, process.env.JWT_SECRET)
  expect(userId).toBe(userOne.user.id)
})

test('should not login a user due to bad credentials', async () => {
  const variables = {
    data: {
      email: userOne.input.email,
      password: userOne.input.password + '2465749',
    },
  }

  await expect(
    client.mutate({
      mutation: signIn,
      variables,
    })
  ).rejects.toThrow()
})
