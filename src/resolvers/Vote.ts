import { Prisma } from '../generated/prisma-client'

export default {
  user: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.vote({ id }).user()
  },

  station: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.vote({ id }).station()
  },

  topic: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.vote({ id }).topic()
  },

  membership: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.vote({ id }).membership()
  },

  comment: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.vote({ id }).comment()
  },
}
