import { Prisma } from '../generated/prisma-client'

export default {
  membership: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.topic({ id }).membership()
  },

  comments: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.topic({ id }).comments()
  },

  votes: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.topic({ id }).votes()
  },
}
