import { Prisma } from '../generated/prisma-client'

export default {
  title: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.topic({ id }).title()
  },

  content: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.topic({ id }).content()
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

  createdAt: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.topic({ id }).createdAt()
  },

  updatedAt: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.topic({ id }).updatedAt()
  },
}
