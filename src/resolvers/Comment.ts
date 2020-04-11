import { PrismaClient } from '@prisma/client'
export default {
  user: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const user = await prisma.comment
      .findOne({
        where: {
          id,
        },
      })
      .user()
    return user
  },

  station: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const station = await prisma.comment
      .findOne({
        where: {
          id,
        },
      })
      .station()

    return station
  },

  membership: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const membership = await prisma.comment
      .findOne({
        where: {
          id,
        },
      })
      .membership()

    return membership
  },

  topic: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const topic = await prisma.comment
      .findOne({
        where: {
          id,
        },
      })
      .topic()

    return topic
  },
}
