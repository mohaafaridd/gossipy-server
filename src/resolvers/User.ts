import { Prisma, Membership } from '../generated/prisma-client'
import { getUserId } from '../utils'

export default {
  password: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return null
  },

  email: async (
    { id },
    args,
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request, false)
    if (userId !== id) return null
    return prisma.user({ id }).email()
  },

  memberships: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.user({ id }).memberships()
  },

  topics: async (
    { id },
    args,
    { prisma, request }: { prisma: Prisma; request }
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
    { id },
    args,
    { prisma, request }: { prisma: Prisma; request }
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
    { id },
    args,
    { prisma, request }: { prisma: Prisma; request }
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

  karma: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    return prisma.votes({
      where: {
        OR: [{ topic: { user: { id } } }, { comment: { user: { id } } }],
      },
    })
  },
}
