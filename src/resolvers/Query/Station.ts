import { PrismaClient, FindManyStationArgs } from '@prisma/client'

export default {
  async stations(
    _parent: any,
    { query, page = 1 }: { query: string; page?: number },
    { prisma }: { prisma: PrismaClient }
  ) {
    const skip = (page > 0 ? page : 1) * 10 - 10
    const conditions: FindManyStationArgs = {
      where: {
        identifier: {
          contains: query.toLowerCase(),
        },
      },
    }
    const stations = await prisma.station.findMany({
      skip,
      first: 10,
      ...conditions,
    })

    const count = await prisma.station.count(conditions)

    return {
      data: stations,
      count,
    }
  },

  async station(
    _parent: any,
    { identifier }: { identifier: string },
    { prisma }: { prisma: PrismaClient }
  ) {
    const station = await prisma.station.findOne({ where: { identifier } })

    return station
  },
}
