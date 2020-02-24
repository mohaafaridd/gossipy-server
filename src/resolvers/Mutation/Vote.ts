import {
  Prisma,
  VoteCreateInput,
  VoteUpdateInput,
} from '../../generated/prisma-client'
import getUserId from '../../utils/getUserId'
export default {
  createVote: async (
    parent,
    {
      data,
    }: {
      data: VoteCreateInput
    },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    // Must be station member to vote
    const isAuthorized = await prisma.$exists.topic({
      id: data.topic.connect.id,
      membership: {
        station: {
          members_some: {
            id: data.membership.connect.id,
            user: {
              id: userId,
            },
          },
        },
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    return prisma.createVote(data)
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
}
