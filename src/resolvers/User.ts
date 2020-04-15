import { PrismaClient } from '@prisma/client'
import { getUserId } from '../utils'

export default {
  password: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    return null
  },

  email: async (
    { id }: { id: number },
    _args: any,
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request, false)
    if (userId !== id) return null
    const user = await prisma.user.findOne({ where: { id } })
    return user?.email
  },

  memberships: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const memberships = await prisma.user
      .findOne({ where: { id } })
      .memberships()
    return memberships
  },

  topics: async (
    { id }: { id: number },
    _args: any,
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request, false)

    const topics = await prisma.topic.findMany({
      where: {
        userId: id,
        station: {
          OR: [
            {
              public: false,
              memberships: {
                some: {
                  user: {
                    id: userId,
                  },
                  state: 'ACTIVE',
                },
              },
            },
            {
              public: true,
            },
          ],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return topics
  },

  comments: async (
    { id }: { id: number },
    _args: any,
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request, false)

    const comments = await prisma.comment.findMany({
      where: {
        userId: id,
        station: {
          OR: [
            {
              public: false,
              memberships: {
                some: {
                  user: {
                    id: userId,
                  },
                  state: 'ACTIVE',
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

    return comments
  },

  votes: async (
    { id }: { id: number },
    _args: any,
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request, false)

    const votes = await prisma.vote.findMany({
      where: {
        userId: id,
        station: {
          OR: [
            {
              public: false,
              memberships: {
                some: {
                  user: {
                    id: userId,
                  },
                  state: 'ACTIVE',
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

    return votes
  },

  karma: async (
    { id }: { id: number },
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const karma = prisma.vote.findMany({
      where: {
        topic: {
          userId: id,
        },
      },
    })

    return karma
  },
}
