import '@babel/polyfill'
import seed, { userTwo, userThree, stationOne } from './utils/seed'
import getClient from './utils/getClient'
import { prisma } from '../src/generated/prisma-client'
import { createMembership } from './utils/operations'
const client = getClient(null)
beforeEach(seed, 30000)

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
