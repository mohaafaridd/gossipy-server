import { PrismaClient } from '@prisma/client'

export default {
  user: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const user = await prisma.vote.findOne({ where: { id } }).user()
    return user
  },

  station: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const station = await prisma.vote.findOne({ where: { id } }).station()
    return station
  },

  topic: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const topic = await prisma.vote.findOne({ where: { id } }).topic()
    return topic
  },

  membership: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const membership = await prisma.vote.findOne({ where: { id } }).membership()
    return membership
  },
}
