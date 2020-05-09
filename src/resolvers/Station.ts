import { PrismaClient } from '@prisma/client'

export default {
  members: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const members = await prisma.station
      .findOne({ where: { id } })
      .memberships()
    return members
  },

  topics: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const topics = await prisma.station.findOne({ where: { id } }).topics()
    return topics
  },

  comments: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const comments = await prisma.station.findOne({ where: { id } }).comments()
    return comments
  },

  votes: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const votes = await prisma.station.findOne({ where: { id } }).votes()
    return votes
  },

  tags: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const tags = await prisma.station.findOne({ where: { id } }).tags()
    return tags
  },
}
