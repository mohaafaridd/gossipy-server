import { Prisma, Membership } from '../generated/prisma-client'

export default {
  members: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    const members: Membership[] = await prisma.station({ id }).members()
    return members
  },
}
