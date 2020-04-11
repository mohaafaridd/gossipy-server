import { PrismaClient } from '@prisma/client'

export default {
  async stations(
    _parent: any,
    { query }: { query: string },
    { prisma }: { prisma: PrismaClient }
  ) {
    const stations = await prisma.station.findMany({
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
