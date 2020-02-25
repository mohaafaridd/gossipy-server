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
        membership: string
        type: VoteType
      }
    },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    // Must be station member to vote
    const isAuthorized = await prisma.$exists.topic({
      id: data.topic,
      membership: {
        station: {
          members_some: {
            id: data.membership,
            user: {
              id: userId,
            },
          },
        },
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    const userVoted = await prisma.$exists.vote({
      membership: {
        id: data.membership,
      },
      topic: {
        id: data.topic,
      },
    })

    if (userVoted) throw new Error('User already voted')

    return prisma.createVote({
      membership: {
        connect: {
          id: data.membership,
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
