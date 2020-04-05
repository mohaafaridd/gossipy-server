import { Prisma } from '../generated/prisma-client'

export default {
  identifier: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.topic({ id }).identifier()
  },

  content: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.topic({ id }).content()
  },

  user: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.topic({ id }).user()
  },

  station: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.topic({ id }).station()
  },

  membership: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.topic({ id }).membership()
  },

  comments: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.topic({ id }).comments()
  },

  votes: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.topic({ id }).votes()
  },
}
