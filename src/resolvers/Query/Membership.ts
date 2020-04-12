import { PrismaClient, Role, State } from '@prisma/client'
import { getUserId } from '@utils'

export default {
  async membership(
    _parent: any,
    { stationId }: { stationId: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) {
    const userId = getUserId(request, false)
    const [membership] = await prisma.membership.findMany({
      where: {
        userId,
        stationId,
      },
    })

    return membership
  },

  async memberships(
    _parent: any,
    {
      user,
      station = 1,
      page = 1,
      roles,
      states,
    }: {
      user?: number
      station?: number
      page?: number
      roles: Role[]
      states: State[]
    },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) {
    const userId = getUserId(request)
    const skip = (page > 0 ? page : 1) * 10 - 10

    if (user) {
      const memberships = await prisma.membership.findMany({
        skip,
        where: {
          userId: user,
          role: {
            in: roles,
          },
          state: {
            in: states,
          },
        },
      })

      return memberships
    }

    const [membership] = await prisma.membership.findMany({
      where: {
        userId,
        stationId: station,
      },
    })

    if (!membership) throw new Error('Authorization Required')

    const memberships = await prisma.membership.findMany({
      skip,
      where: {
        stationId: station,
        role: {
          in: roles,
        },
        state: {
          in: states,
        },
      },
    })

    return memberships
  },
}
