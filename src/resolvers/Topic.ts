import { PrismaClient } from '@prisma/client'

export default {
  user: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const user = await prisma.topic.findOne({ where: { id } }).user()
    return user
  },

  station: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const station = await prisma.topic.findOne({ where: { id } }).station()
    return station
  },

  membership: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const membership = await prisma.topic
      .findOne({ where: { id } })
      .membership()
    return membership
  },

  comments: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const comments = await prisma.topic.findOne({ where: { id } }).comments()
    return comments
  },

  votes: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const votes = await prisma.topic.findOne({ where: { id } }).votes()
    return votes
  },
}
