import { PrismaClient, VoteType } from '@prisma/client'
import { getUserId } from '../../utils'
export default {
  upsertVote: async (
    _parent: any,
    {
      data,
    }: {
      data: {
        topic: number
        type: VoteType
      }
    },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)

    const [membership] = await prisma.membership.findMany({
      where: {
        state: 'ACTIVE',
        userId,
        station: {
          topics: {
            some: {
              id: data.topic,
            },
          },
        },
      },
    })

    if (!membership) throw new Error('Authorization Required')

    const [vote] = await prisma.vote.findMany({
      where: {
        userId,
        topicId: data.topic,
        membershipId: membership.id,
      },
    })

    const station = await prisma.membership
      .findOne({ where: { id: membership.id } })
      .station()

    const upsert = await prisma.vote.upsert({
      where: {
        id: vote?.id || 0,
      },

      create: {
        type: data.type,
        user: {
          connect: {
            id: userId,
          },
        },

        station: {
          connect: {
            id: station?.id,
          },
        },

        membership: {
          connect: {
            id: membership.id,
          },
        },

        topic: {
          connect: {
            id: data.topic,
          },
        },
      },

      update: {
        type: data.type,
      },
    })

    return upsert
  },

  deleteVote: async (
    _parent: any,
    { id }: { id: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)

    const isAuthorized = await prisma.vote.findMany({
      where: {
        id,
        membership: {
          userId,
        },
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    const vote = await prisma.vote.delete({ where: { id } })
    return vote
  },
}
