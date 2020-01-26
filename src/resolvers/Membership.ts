import { Prisma, User, Station } from '../generated/prisma-client'

export default {
  user: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.membership({ id }).user()
  },

  station: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.membership({ id }).station()
  },
}
