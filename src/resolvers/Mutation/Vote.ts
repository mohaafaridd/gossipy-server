import {
  Prisma,
  VoteCreateInput,
  VoteUpdateInput,
  VoteType,
} from '../../generated/prisma-client'
import getUserId from '../../utils/getUserId'
export default {
  createVote: async (
    parent,
    {
      data,
    }: {
      data: {
        topic: string
        type: VoteType
      }
    },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const [membership] = await prisma.memberships({
      where: {
        state: 'ACTIVE',
        user: {
          id: userId,
        },
        station: {
          members_some: {
            topics_some: {
              id: data.topic,
            },
          },
        },
      },
    })

    if (!membership) throw new Error('Authorization Required')

    const userVoted = await prisma.$exists.vote({
      membership: {
        user: {
          id: userId,
        },
      },
      topic: {
        id: data.topic,
      },
    })

    if (userVoted) throw new Error('User already voted')

    return prisma.createVote({
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

      type: data.type,
    })
  },

  updateVote: async (
    parent,
    {
      id,
      data,
    }: {
      id: string
      data: VoteUpdateInput
    },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const isAuthorized = await prisma.$exists.vote({
      id,
      membership: {
        user: {
          id: userId,
        },
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    return prisma.updateVote({
      where: { id },
      data: {
        type: data.type,
      },
    })
  },

  deleteVote: async (
    parent,
    { id }: { id: string },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const isAuthorized = await prisma.$exists.vote({
      id,
      membership: {
        user: {
          id: userId,
        },
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    return prisma.deleteVote({ id })
  },
}
