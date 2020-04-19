import { PrismaClient, UserUpdateInput } from '@prisma/client'
import seed from './seed'
import seeds, { users } from './seed/seeds'
import { resolvers } from '@src/resolvers'
import { IUser } from './seed/interfaces'
import getRequest from './util/getRequest'

describe('Users Happy paths', () => {
  beforeAll(() => seed({ User: true }), 60000)

  test('should sign-up a user', async () => {
    const prisma = new PrismaClient()

    const data: IUser = {
      input: {
        name: 'Messi',
        identifier: 'messi',
        email: 'goat@barca.org',
        password: 'dadadada',
      },
    }

    await resolvers.Mutation.signUp(null, { data: data.input }, { prisma })

    const userExists = await resolvers.Query.profile(
      null,
      {
        identifier: data.input.identifier,
      },
      { prisma }
    )

    prisma.disconnect()
    expect(userExists).not.toBe(null)
  })

  test('should sign-in a user', async () => {
    const prisma = new PrismaClient()

    const data = users[0]

    const user = await resolvers.Mutation.signIn(
      null,
      { data: { email: data.input.email, password: data.input.password } },
      { prisma }
    )

    prisma.disconnect()
    expect(user).not.toBe(null)
  })

  test('should update user information', async () => {
    const prisma = new PrismaClient()
    const data = users[0]
    const request = getRequest(data.jwt)

    const updates: UserUpdateInput = {
      email: 'updated@gossipy.com',
    }

    await resolvers.Mutation.updateUser(
      null,
      {
        data: updates,
      },
      {
        prisma,
        request,
      }
    )

    const email = await resolvers.User.email({ id: data.user?.id || 0 }, null, {
      prisma,
      request,
    })

    prisma.disconnect()

    expect(email).toBe(updates.email)
  })
})

describe('Users not so happy path', () => {
  beforeAll(() => seed({ User: true }), 60000)

  describe('Sign-up', () => {
    test('should not sign-up a user for wrong email', async () => {
      const prisma = new PrismaClient()

      const data: IUser = {
        input: {
          name: 'Messi',
          identifier: 'messi',
          email: 'xyz',
          password: 'dadadada',
        },
      }

      await expect(
        resolvers.Mutation.signUp(null, { data: data.input }, { prisma })
      ).rejects.toThrow()

      const userExists = await resolvers.Query.profile(
        null,
        {
          identifier: data.input.identifier,
        },
        { prisma }
      )

      expect(userExists).toBe(null)

      prisma.disconnect()
    })

    test('should not sign-up a user for duplicated email', async () => {
      const prisma = new PrismaClient()

      const data: IUser = {
        input: {
          name: 'Messi',
          identifier: 'messi',
          email: seeds.users[0].input.email,
          password: 'dadadada',
        },
      }

      await expect(
        resolvers.Mutation.signUp(null, { data: data.input }, { prisma })
      ).rejects.toThrow()

      const userExists = await resolvers.Query.profile(
        null,
        {
          identifier: data.input.identifier,
        },
        { prisma }
      )

      expect(userExists).toBe(null)

      prisma.disconnect()
    })

    test('should not sign-up a user for bad password', async () => {
      const prisma = new PrismaClient()

      const data: IUser = {
        input: {
          name: 'Messi',
          identifier: 'messi',
          email: 'goat@barca.org',
          password: 'yo',
        },
      }

      await expect(
        resolvers.Mutation.signUp(null, { data: data.input }, { prisma })
      ).rejects.toThrow()

      const userExists = await resolvers.Query.profile(
        null,
        {
          identifier: data.input.identifier,
        },
        { prisma }
      )

      expect(userExists).toBe(null)

      prisma.disconnect()
    })
  })

  describe('Sign-in', () => {
    test('should not sign-in a user for bad credentials', async () => {
      const prisma = new PrismaClient()

      const data = {
        email: seeds.users[0].input.email,
        password: 'This is not my real password',
      }

      await expect(
        resolvers.Mutation.signIn(null, { data }, { prisma })
      ).rejects.toThrow()

      prisma.disconnect()
    })
  })

  describe('Update', () => {
    test('should not update a user for using a registered email', async () => {
      const prisma = new PrismaClient()

      const data: UserUpdateInput = {
        email: seeds.users[0].input.email,
      }
      const request = getRequest(seeds.users[1].jwt)

      await expect(
        resolvers.Mutation.updateUser(null, { data }, { prisma, request })
      ).rejects.toThrow()

      prisma.disconnect()
    })
  })
})
