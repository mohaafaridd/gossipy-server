import {
  PrismaClient,
  Role,
  State,
  FindManyMembershipArgs,
} from '@prisma/client'
import { getUserId } from '@utils'

export default {
  async membership(
    _parent: any,
    {
      stationId,
      stationIdentifier,
    }: { stationId?: number; stationIdentifier?: string },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) {
    if (!stationId && !stationIdentifier)
      throw new Error('No station id or identifier was passed')

    const userId = getUserId(request, false)
    const [membership] = await prisma.membership.findMany({
      where: {
        userId,
        station: {
          id: stationId,
          identifier: stationIdentifier,
        },
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
      const conditions: FindManyMembershipArgs = {
        where: {
          userId: user,
          role: {
            in: roles,
          },
          state: {
            in: states,
          },
        },
      }

      const memberships = await prisma.membership.findMany({
        skip,
        first: 10,
        ...conditions,
      })

      const count = await prisma.membership.count(conditions)

      return {
        data: memberships,
        count,
      }
    }

    const [membership] = await prisma.membership.findMany({
      where: {
        userId,
        stationId: station,
      },
    })

    if (!membership) throw new Error('Authorization Required')

    const conditions: FindManyMembershipArgs = {
      where: {
        stationId: station,
        role: {
          in: roles,
        },
        state: {
          in: states,
        },
      },
    }

    const memberships = await prisma.membership.findMany({
      skip,
      first: 10,
      ...conditions,
    })

    const count = await prisma.membership.count(conditions)

    return {
      data: memberships,
      count,
    }
  },
}
