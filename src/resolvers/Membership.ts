import { PrismaClient } from '@prisma/client'

export default {
  user: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const user = await prisma.membership.findOne({ where: { id } }).user()
    return user
  },

  station: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const station = prisma.membership.findOne({ where: { id } }).station()
    return station
  },

  topics: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const topics = await prisma.membership.findOne({ where: { id } }).topics()
    return topics
  },

  comments: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const comments = await prisma.membership
      .findOne({ where: { id } })
      .comments()
    return comments
  },

  votes: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const votes = await prisma.membership.findOne({ where: { id } }).votes()
    return votes
  },
}
