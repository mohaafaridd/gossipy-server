import { PrismaClient, FindManyCommentArgs } from '@prisma/client'
import { getUserId } from '@utils'

export default {
  async comments(
    _parent: any,
    {
      topicIdentifier,
      stationIdentifier,
      user,
      page = 1,
    }: {
      topicIdentifier: string
      stationIdentifier: string
      user: number
      page?: number
    },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) {
    const userId = getUserId(request, false)
    const skip = (page > 0 ? page : 1) * 10 - 10
    const conditions: FindManyCommentArgs = {
      where: {
        topic: {
          identifier: topicIdentifier,
        },
        userId: user,
        station: {
          identifier: stationIdentifier,
          OR: [
            {
              public: true,
            },
            {
              public: false,
              memberships: {
                some: {
                  userId,
                  state: 'ACTIVE',
                },
              },
            },
          ],
        },
      },
    }

    const comments = await prisma.comment.findMany({
      skip,
      ...conditions,
    })

    const count = await prisma.comment.count(conditions)

    return {
      data: comments,
      count,
    }
  },

  async comment(
    _parent: any,
    { commentId }: { commentId: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) {
    const userId = getUserId(request, false)
    const [comment] = await prisma.comment.findMany({
      where: {
        id: commentId,
        station: {
          OR: [
            {
              public: true,
            },
            {
              memberships: {
                some: {
                  userId,
                },
              },
            },
          ],
        },
      },
    })

    return comment
  },
}
