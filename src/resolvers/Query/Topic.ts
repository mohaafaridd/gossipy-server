import { PrismaClient, FindManyTopicArgs } from '@prisma/client'
import { SortType, DateRange } from '@constants'
import { getSortingDate, getUserId, sortTopics } from '@utils'

export default {
  async topics(
    _parent: any,
    {
      sortType,
      dateRange,
      page = 1,
      user,
      station,
      explore,
    }: {
      sortType: SortType
      dateRange: DateRange
      page?: number
      user?: number
      station?: number
      explore?: boolean
    },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) {
    const userId = getUserId(request, false)
    const date = getSortingDate(dateRange)
    const skip = (page > 0 ? page : 1) * 10 - 10

    let conditions: FindManyTopicArgs = {
      where: {
        userId: user,
        station: {
          id: station,
          OR: [
            {
              public: true,
            },
            {
              public: explore ? true : undefined,
              memberships: {
                some: {
                  userId: {
                    not: explore ? userId : undefined,
                    equals: explore ? undefined : userId,
                  },

                  state: explore ? undefined : 'ACTIVE',
                },
              },
            },
          ],
        },

        votes: {
          some: {
            createdAt: {
              gte: sortType === 'NEW' ? undefined : date,
            },
          },
        },

        createdAt: {
          gte: sortType === 'NEW' ? date : undefined,
        },
      },
    }

    const dependency =
      sortType !== 'NEW'
        ? async () => {
            delete conditions.where?.createdAt
            const topics = await prisma.topic.findMany({
              skip,
              ...conditions,
              include: {
                votes: true,
              },
            })

            return topics
          }
        : async () => {
            delete conditions.where?.votes
            const topics = prisma.topic.findMany({
              skip,
              orderBy: {
                createdAt: 'desc',
              },
              ...conditions,
              include: {
                votes: true,
              },
            })

            return topics
          }

    const topics = await dependency()
    const count = await prisma.topic.count(conditions)

    return {
      data: sortTopics(topics, sortType),
      count,
    }
  },

  async topic(
    _parent: any,
    { identifier, stationId }: { identifier: string; stationId: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) {
    const userId = getUserId(request, false)
    const [topic] = await prisma.topic.findMany({
      where: {
        identifier,
        stationId,
        station: {
          OR: [
            {
              public: true,
            },
            {
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
    })

    return topic
  },
}
