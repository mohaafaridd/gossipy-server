import { Prisma, User } from '../generated/prisma-client'

export default {
  founder: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    const user: User = await prisma.station({ id }).founder()
    return user
  },
}
