import { Prisma, Membership } from '../generated/prisma-client'

export default {
  members: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.station({ id }).members()
  },

  topics: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.station({ id }).topics()
  },

  comments: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.station({ id }).comments()
  },

  votes: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.station({ id }).votes()
  },
}
