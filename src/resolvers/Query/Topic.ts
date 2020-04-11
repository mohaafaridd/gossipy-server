import { PrismaClient } from '@prisma/client'
import { SortType, DateRange } from '@constants'
import { getSortingDate, getUserId } from '@utils'

export default {
  async topics(
    _parent: any,
    {
      sortType,
      dateRange,
      user,
      station,
      explore,
    }: {
      sortType: SortType
      dateRange: DateRange
      user: number
      station: number
      explore: boolean
    },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) {
    const userId = getUserId(request, false)
    const date = getSortingDate(dateRange)

    const dependency =
      sortType !== 'NEW'
        ? async () => {
            const topics = await prisma.topic.findMany({
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

              include: {
                votes: true,
              },
            })

            return topics
          }
        : async () => {
            const topics = prisma.topic.findMany({
              orderBy: {
                createdAt: 'desc',
              },
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
              include: {
                votes: true,
              },
            })

            return topics
          }

    const topics = await dependency()
    return topics
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
