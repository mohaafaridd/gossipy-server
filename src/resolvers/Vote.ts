import { Prisma } from '../generated/prisma-client'

export default {
  topic: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    const topic = await prisma.vote({ id }).topic()
    return topic
  },

  membership: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    const membership = await prisma.vote({ id }).membership()
    return membership
  },

  comment: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    const comment = await prisma.vote({ id }).comment()
    return comment
  },
}
