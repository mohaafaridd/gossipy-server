import { PrismaClient } from '@prisma/client'

export default {
  station: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const station = await prisma.tag.findOne({ where: { id } }).station()
    return station
  },

  topics: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const station = await prisma.tag.findOne({ where: { id } }).topics()
    return station
  },
}
