import { Prisma, Membership } from '../generated/prisma-client'

export default {
  memberships: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    const memberships: Membership[] = await prisma.user({ id }).memberships()
    return memberships
  },
}
