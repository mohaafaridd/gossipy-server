import { PrismaClient } from '@prisma/client'
import { getUserId } from '../../utils'

export default {
  /**
   * This mutation is dedicated to enable members to create comments
   */
  createComment: async (
    _parent: any,
    {
      data,
    }: {
      data: {
        content: string
        topic: number
      }
    },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)

    const [membership] = await prisma.membership.findMany({
      where: {
        station: {
          topics: {
            some: {
              id: data.topic,
            },
          },
        },
        user: {
          id: userId,
        },
        state: 'ACTIVE',
      },
    })

    if (!membership) throw new Error('Authorization Required')

    const station = await prisma.membership
      .findOne({ where: { id: membership.id } })
      .station()

    const comment = await prisma.comment.create({
      data: {
        content: data.content,

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
    })

    return comment
  },

  /**
   * This mutation is dedicated to enable members to update their own comments
   */
  updateComment: async (
    _parent: any,
    {
      id,
      data,
    }: {
      id: number
      data: {
        content: string
      }
    },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)

    const [isAuthorized] = await prisma.comment.findMany({
      where: {
        id,
        membership: {
          userId,
          state: 'ACTIVE',
        },
      },
    })
    if (!isAuthorized) throw new Error('Authorization Required')

    const comment = prisma.comment.update({
      where: { id },
      data,
    })

    return comment
  },

  /**
   * This mutation is dedicated to enable members to delete their own comments
   */
  deleteComment: async (
    _parent: any,
    { id }: { id: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)
    const [isAuthorized] = await prisma.comment.findMany({
      where: {
        id,
        OR: [
          {
            membership: {
              userId,
              state: 'ACTIVE',
            },
          },

          {
            topic: {
              membership: {
                userId,
                state: 'ACTIVE',
              },
            },
          },

          {
            station: {
              memberships: {
                some: {
                  userId,
                  role: {
                    notIn: ['MEMBER'],
                  },
                },
              },
            },
          },
        ],
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    const comment = await prisma.comment.delete({ where: { id } })
    return comment
  },
}
