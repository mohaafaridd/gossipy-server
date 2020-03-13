import { Prisma } from '../generated/prisma-client'

export default {
  user: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.comment({ id }).user()
  },

  station: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.comment({ id }).station()
  },

  membership: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.comment({ id }).membership()
  },

  topic: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.comment({ id }).topic()
  },

  votes: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.comment({ id }).votes()
  },
}
