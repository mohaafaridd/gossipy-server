import { Prisma } from '../generated/prisma-client'

export default {
  user: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.topic({ id }).user()
  },

  station: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.topic({ id }).station()
  },

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
