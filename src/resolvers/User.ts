import { Prisma, Membership } from '../generated/prisma-client'
import { getUserId } from '../utils'

export default {
  password: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return null
  },

  email: async (
    { id },
    args,
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request, false)
    if (userId !== id) return null
    return prisma.user({ id }).email()
  },

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
