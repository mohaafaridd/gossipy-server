import { PrismaClient, FindManyTopicArgs } from '@prisma/client'
import { SortType, DateRange } from '@constants'
import { getSortingDate, getUserId } from '@utils'

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
      user: number
      station: number
      explore: boolean
    },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) {
    const userId = getUserId(request, false)
    const date = getSortingDate(dateRange)
    const skip = (page > 0 ? page : 1) * 10 - 10

    let conditions: FindManyTopicArgs = {}

    const dependency =
      sortType !== 'NEW'
        ? async () => {
            conditions = {
              where: {
                userId: user,
                station: {
                  public: !!explore,
                },
                votes: {
                  some: {
                    createdAt: {
                      gte: date,
                    },

                    station: {
                      id: station,
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
                },
              },
            }
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
            conditions = {
              where: {
                userId: user,

                createdAt: {
                  gte: date,
                },

                station: {
                  id: station,
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
      data: topics,
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
