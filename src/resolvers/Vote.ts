import { Prisma } from '../generated/prisma-client'

export default {
  user: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.vote({ id }).user()
  },

  station: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.vote({ id }).station()
  },

  topic: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.vote({ id }).topic()
  },

  membership: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.vote({ id }).membership()
  },

  comment: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.vote({ id }).comment()
  },
}
