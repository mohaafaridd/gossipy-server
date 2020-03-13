import { Prisma, Membership } from '../generated/prisma-client'

export default {
  members: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.station({ id }).members()
  },

  topics: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.station({ id }).topics()
  },

  comments: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.station({ id }).comments()
  },

  votes: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.station({ id }).votes()
  },
}
