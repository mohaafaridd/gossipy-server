import {
  PrismaClient,
  StationCreateInput,
  Role,
  StationUpdateInput,
} from '@prisma/client'
import seed from './seed'
import seeds from './seed/seeds'
import { resolvers } from '@src/resolvers'
import getRequest from './util/getRequest'

describe('Station Happy Path', () => {
  beforeAll(() => seed({ User: true, Station: true, Membership: true }), 60000)

  test('should create a station', async () => {
    const prisma = new PrismaClient()
    const data: StationCreateInput = {
      name: 'Ismaily SC',
      identifier: '',
      description: 'Ismaily SC Fan Sub',
      public: true,
    }

    const request = getRequest(seeds.users[0].jwt)

    const station = await resolvers.Mutation.createStation(
      null,
      { data },
      { prisma, request }
    )

    expect(station).not.toBe(null)

    const membership = await resolvers.Query.membership(
      null,
      {
        stationId: station.id,
      },
      { prisma, request }
    )

    expect(membership.role).toBe('FOUNDER')

    prisma.disconnect()
  })

  test('should update a station', async () => {
    const prisma = new PrismaClient()
    const data: StationUpdateInput = {
      public: false,
    }

    const request = getRequest(seeds.users[0].jwt)

    const station = await resolvers.Mutation.updateStation(
      null,
      { id: seeds.stations[0].station?.id || 0, data },
      { prisma, request }
    )

    expect(station.public).toBe(false)

    prisma.disconnect()
  })
})
