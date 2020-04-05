import { Prisma } from '../generated/prisma-client'

export default {
  user: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.comment({ id }).user()
  },

  station: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.comment({ id }).station()
  },

  membership: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.comment({ id }).membership()
  },

  topic: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.comment({ id }).topic()
  },

  votes: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.comment({ id }).votes()
  },
}
