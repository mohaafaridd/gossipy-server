import '@babel/polyfill'
import seed from './utils/seed'
import getClient from './utils/getClient'
import { prisma } from '../src/generated/prisma-client'
import { userThree } from './utils/seed'
import { createStation } from './utils/operations'
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
