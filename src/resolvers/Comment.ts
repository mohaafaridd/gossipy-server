import { Prisma } from '../generated/prisma-client'

export default {
  membership: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.comment({ id }).membership()
  },

  topic: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.comment({ id }).topic()
  },
}
