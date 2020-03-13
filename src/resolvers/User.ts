import { Prisma, Membership } from '../generated/prisma-client'

export default {
  memberships: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.user({ id }).memberships()
  },

  topics: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.user({ id }).topics()
  },

  comments: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.user({ id }).comments()
  },

  votes: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.user({ id }).votes()
  },
}
