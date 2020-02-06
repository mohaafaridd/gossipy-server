import '@babel/polyfill'
import seed, { userTwo, userThree, stationOne } from './utils/seed'
import getClient from './utils/getClient'
import { prisma } from '../src/generated/prisma-client'
import { createStation, createMembership } from './utils/operations'
const client = getClient(null)
beforeEach(seed, 30000)

test('should create a station for an authentic user', async () => {
  const client = getClient(userThree.jwt)
  const variables = {
    data: {
      name: 'middle ground',
      description: 'we eliminate hatred between team supporters',
      public: true,
    },
  }
  const response = await client.mutate({
    mutation: createStation,
    variables,
  })
  const stationId = response.data.createStation.id

  const stationExists = await prisma.$exists.station({
    id: stationId,
  })

  expect(stationExists).toBe(true)

  const membershipExists = await prisma.$exists.membership({
    user: {
      id: userThree.user.id,
    },
    station: {
      id: stationId,
    },
    role: 'FOUNDER',
  })

  expect(membershipExists).toBe(true)
})

test('should not create a station for not authentic user', async () => {
  const variables = {
    data: {
      name: 'middle ground',
      description: 'we eliminate hatred between team supporters',
      public: true,
    },
  }

  await expect(
    client.mutate({
      mutation: createStation,
      variables,
    })
  ).rejects.toThrow()
})

test('should create a membership for a user', async () => {
  const client = getClient(userTwo.jwt)
  const variables = {
    stationId: stationOne.station.id,
  }

  const response = await client.mutate({
    mutation: createMembership,
    variables,
  })

  const membershipId = response.data.createMembership.id

  const membershipExists = await prisma.$exists.membership({
    id: membershipId,
    user: {
      id: userTwo.user.id,
    },
    station: {
      id: stationOne.station.id,
    },
    state: 'PENDING',
    role: 'MEMBER',
  })

  expect(membershipExists).toBe(true)
})
