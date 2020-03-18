import {
  Prisma,
  Station,
  StationCreateInput,
  StationUpdateInput,
} from '../../generated/prisma-client'
import { getUserId, sanitizer } from '../../utils'

export default {
  /**
   * This mutation is dedicated to enable authenticated users to create their own stations
   */
  createStation: async (
    parent,
    { data }: { data: StationCreateInput },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const name = sanitizer.alphanumeric(data.name)

    if (name.length < 2 || name.length > 16)
      throw new Error('Station name length error')

    const identifier = name.toLowerCase()

    if (identifier === 'create') throw new Error('Station name is not valid')

    const station: Station = await prisma.createStation({
      ...data,
      name,
      identifier,
      members: {
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
          role: 'FOUNDER',
          state: 'ACTIVE',
        },
      },
    })

    return station
  },

  /**
   * This mutation is dedicated to modify station's description and public flag
   */
  updateStation: async (
    parent,
    { id, data }: { id: string; data: StationUpdateInput },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const isAuthorized = await prisma.$exists.membership({
      AND: {
        station: {
          id,
        },
        user: {
          id: userId,
        },
        role_in: ['FOUNDER', 'ADMIN'],
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    const station = await prisma.updateStation({
      where: { id },
      data,
    })

    return station
  },

  /**
   * This mutation is dedicated to enable the station founder to delete it
   */
  deleteStation: async (
    parent,
    { id }: { id: string },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const isAuthorized = await prisma.$exists.membership({
      AND: {
        station: {
          id,
        },
        user: {
          id: userId,
        },
        role_in: ['FOUNDER'],
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    const station = await prisma.deleteStation({ id })
    return station
  },
}
