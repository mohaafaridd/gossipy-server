import { Prisma } from '../../generated/prisma-client'
import getUserId from '../../utils/getUserId'

export default {
  /**
   * This mutation is dedicated to enable members to create comments
   */
  createComment: async (
    parent,
    {
      data,
    }: {
      data: {
        content: string
        topic: string
      }
    },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const [membership] = await prisma.memberships({
      where: {
        user: {
          id: userId,
        },
        state: 'ACTIVE',
      },
    })

    if (!membership) throw new Error('Authorization Required')

    return prisma.createComment({
      content: data.content,
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
    })
  },

  /**
   * This mutation is dedicated to enable members to update their own comments
   */
  updateComment: async (
    parent,
    {
      id,
      data,
    }: {
      id: string
      data: {
        content: string
      }
    },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const isAuthorized = await prisma.$exists.comment({
      id,
      membership: {
        user: {
          id: userId,
        },
        state: 'ACTIVE',
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    return prisma.updateComment({
      where: { id },
      data,
    })
  },

  /**
   * This mutation is dedicated to enable members to delete their own comments
   */
  deleteComment: async (
    parent,
    { id }: { id: string },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)
    const isAuthorized = await prisma.$exists.comment({
      id,
      membership: {
        user: {
          id: userId,
        },
        state: 'ACTIVE',
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    return prisma.deleteComment({ id })
  },
}
