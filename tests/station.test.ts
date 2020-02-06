import '@babel/polyfill'
import seed, {
  userOne,
  userThree,
  stationOne,
  userFour,
  stationTwo,
} from './utils/seed'
import getClient from './utils/getClient'
import { prisma } from '../src/generated/prisma-client'
import { createStation, updateStation } from './utils/operations'
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

test('should update station description if user is founder or admin', async () => {
  const founder = getClient(userOne.jwt)
  const firstUpdate = {
    id: stationOne.station.id,
    data: {
      public: false,
      description: 'test 0',
    },
  }
  await founder.mutate({
    mutation: updateStation,
    variables: firstUpdate,
  })

  const updateOne = await prisma.$exists.station({
    id: stationOne.station.id,
    public: firstUpdate.data.public,
    description: firstUpdate.data.description,
  })

  expect(updateOne).toBe(true)

  const admin = getClient(userThree.jwt)
  const secondUpdate = {
    id: stationOne.station.id,
    data: {
      public: true,
      description: 'test 1',
    },
  }
  await admin.mutate({
    mutation: updateStation,
    variables: secondUpdate,
  })

  const updateTwo = await prisma.$exists.station({
    id: stationOne.station.id,
    public: secondUpdate.data.public,
    description: secondUpdate.data.description,
  })

  expect(updateTwo).toBe(true)
})

test('should not update station if user is a member role', async () => {
  const member = getClient(userFour.jwt)
  const update = {
    id: stationTwo.station.id,
    data: {
      public: false,
      description: 'test 0',
    },
  }

  await expect(
    member.mutate({
      mutation: updateStation,
      variables: update,
    })
  ).rejects.toThrow()
})
