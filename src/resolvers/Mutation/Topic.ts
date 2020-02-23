import { Prisma, Membership } from '../../generated/prisma-client'
import getUserId from '../../utils/getUserId'

export default {
  /**
   * This mutation is dedicated to enable active station members to post topics
   */
  createTopic: async (
    parent,
    {
      data,
    }: {
      data: {
        title: string
        content: string
        membership: string
      }
    },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const [membership]: Membership[] = await prisma.memberships({
      where: {
        id: data.membership,
        user: {
          id: userId,
        },
        state: 'ACTIVE',
      },
    })

    if (!membership) throw new Error('Authorization Required')

    const topic = await prisma.createTopic({
      ...data,
      membership: {
        connect: {
          id: membership.id,
        },
      },
      votes: {
        create: {
          membership: {
            connect: {
              id: membership.id,
            },
          },
          type: 'UPVOTE',
        },
      },
    })

    return topic
  },

  /**
   * This mutation is dedicated to enable users to update their own topics
   */
  updateTopic: async (
    parent,
    {
      id,
      data,
    }: {
      id: string
      data: {
        title: string
        content: string
      }
    },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const isAuthorized = await prisma.$exists.topic({
      AND: {
        id,
        membership: {
          user: {
            id: userId,
          },
          state: 'ACTIVE',
        },
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    return prisma.updateTopic({
      where: { id },
      data,
    })
  },

  /**
   * This mutation is dedicated to enable users to delete their topics
   */
  deleteTopic: async (
    parent,
    { id }: { id: string },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const isAuthorized = await prisma.$exists.topic({
      OR: [
        {
          id,
          membership: {
            user: {
              id: userId,
            },
            state: 'ACTIVE',
          },
        },
        {
          id,
          membership: {
            station: {
              members_some: {
                user: {
                  id: userId,
                },
                role_in: ['ADMIN', 'FOUNDER'],
              },
            },
          },
        },
      ],
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    return prisma.deleteTopic({ id })
  },
}
