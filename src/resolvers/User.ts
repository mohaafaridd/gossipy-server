import { Prisma, Membership } from '../generated/prisma-client'
import { getUserId } from '../utils'

export default {
  password: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return null
  },

  email: async (
    { id }: { id: string },
    _args: any,
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request, false)
    if (userId !== id) return null
    return prisma.user({ id }).email()
  },

  memberships: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.user({ id }).memberships()
  },

  topics: async (
    { id }: { id: string },
    _args: any,
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request, false)

    return prisma.user({ id }).topics({
      where: {
        station: {
          OR: [
            {
              public: false,
              members_some: {
                user: {
                  id: userId,
                },
              },
            },
            {
              public: true,
            },
          ],
        },
      },
    })
  },

  comments: async (
    { id }: { id: string },
    _args: any,
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request, false)

    return prisma.user({ id }).comments({
      where: {
        station: {
          OR: [
            {
              public: false,
              members_some: {
                user: {
                  id: userId,
                },
              },
            },
            {
              public: true,
            },
          ],
        },
      },
    })
  },

  votes: async (
    { id }: { id: string },
    _args: any,
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request, false)

    return prisma.user({ id }).votes({
      where: {
        station: {
          OR: [
            {
              public: false,
              members_some: {
                user: {
                  id: userId,
                },
              },
            },
            {
              public: true,
            },
          ],
        },
      },
    })
  },

  karma: async (
    { id }: { id: string },
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.votes({
      where: {
        OR: [{ topic: { user: { id } } }, { comment: { user: { id } } }],
      },
    })
  },
}
