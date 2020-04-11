import { PrismaClient } from '@prisma/client'
import { getUserId } from '@utils'

export default {
  async comments(
    _parent: any,
    { topicId, user }: { topicId: number; user: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) {
    const userId = getUserId(request, false)
    const comments = await prisma.comment.findMany({
      where: {
        topicId,
        userId: user,
        station: {
          OR: [
            {
              public: true,
            },
            {
              public: false,
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

    return comments
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
