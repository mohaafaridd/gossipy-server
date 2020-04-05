import { Prisma, User, Station } from '../generated/prisma-client'

export default {
  user: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.membership({ id }).user()
  },

  station: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.membership({ id }).station()
  },

  topics: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.membership({ id }).topics()
  },

  comments: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.membership({ id }).comments()
  },

  votes: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.membership({ id }).votes()
  },
}
