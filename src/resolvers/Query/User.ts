import { PrismaClient } from '@prisma/client'

export default {
  async users(_parent: any, _args: any, { prisma }: { prisma: PrismaClient }) {
    const users = await prisma.user.findMany()
    return users
  },

  async profile(
    _parent: any,
    { identifier }: { identifier: string },
    { prisma }: { prisma: PrismaClient }
  ) {
    const user = await prisma.user.findOne({ where: { identifier } })
    return user
  },
}
