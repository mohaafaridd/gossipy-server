import { PrismaClient } from '@prisma/client'

export default {
  async stations(
    _parent: any,
    { query, page = 1 }: { query: string; page?: number },
    { prisma }: { prisma: PrismaClient }
  ) {
    const skip = (page > 0 ? page : 1) * 10 - 10

    const stations = await prisma.station.findMany({
      skip,
      where: {
        identifier: {
          contains: query.toLowerCase(),
        },
      },
    })

    return stations
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
