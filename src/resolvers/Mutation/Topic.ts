import { Prisma, Membership } from '../../generated/prisma-client'
import { getUserId } from '../../utils'
import { alphanumeric } from '../../utils/sanitizer'

export default {
  /**
   * This mutation is dedicated to enable active station members to post topics
   */
  createTopic: async (
    _parent: any,
    {
      data,
    }: {
      data: {
        title: string
        content: string
        station: string
      }
    },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const [membership] = await prisma.memberships({
      where: {
        station: {
          id: data.station,
        },
        user: {
          id: userId,
        },
        state: 'ACTIVE',
      },
    })

    if (!membership) throw new Error('Authorization Required')

    const identifier = alphanumeric(data.title, '_').toLowerCase()

    const isValid = await prisma.$exists.topic({
      station: {
        id: data.station,
      },

      identifier_not: identifier,
    })

    if (!isValid) throw new Error('Topic title is used before')

    const topic = await prisma.createTopic({
      ...data,
      identifier,
      user: {
        connect: {
          id: userId,
        },
      },
      station: {
        connect: {
          id: data.station,
        },
      },
      membership: {
        connect: {
          id: membership.id,
        },
      },
      votes: {
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
          station: {
            connect: {
              id: data.station,
            },
          },
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
    _parent: any,
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

    if (data.title) {
      const identifier = alphanumeric(data.title, '_').toLowerCase()

      const [station] = await prisma.stations({
        where: { topics_some: { id } },
      })

      const isValid = await prisma.$exists.topic({
        id_not: id,
        station: {
          id: station.id,
        },
        identifier,
      })

      if (!isValid) throw new Error('Topic title is used before')
    }

    return prisma.updateTopic({
      where: { id },
      data,
    })
  },

  /**
   * This mutation is dedicated to enable users to delete their topics
   */
  deleteTopic: async (
    _parent: any,
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
