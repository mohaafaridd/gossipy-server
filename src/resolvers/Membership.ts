import { Prisma, User, Station } from '../generated/prisma-client'

export default {
  user: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    const user: User[] = await prisma.membership({ id }).user()
    return user
  },

  station: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    const station: Station[] = await prisma.membership({ id }).station()
    return station
  },
}
