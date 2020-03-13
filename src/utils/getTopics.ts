import { SortType } from '../constants'
import { prisma, Topic, Vote, VoteWhereInput } from '../generated/prisma-client'
import { sortTopics } from './sortMethods'
import getUserId from './getUserId'

interface Filter {
  user: string
  station: string
  subscribed: boolean
}

interface VoteCollection extends Vote {
  topic: Topic
}

const getTopics = async (
  sortType: SortType,
  finalDate: string,
  filter: Filter,
  request: any
): Promise<Topic[]> => {
  const userId = getUserId(request, false)
  const fragment =
    'fragment TopicToVotes on Vote { id type topic { id title createdAt } }'

  switch (sortType) {
    case 'TOP':
    case 'HOT': {
      const { subscribed } = filter
      const stationConditions: VoteWhereInput = {
        station: {
          id: filter.station,
          public: true,
        },
      }

      if (subscribed) {
        delete stationConditions.station.public

        stationConditions.station = {
          members_some: {
            state: 'ACTIVE',
            user: {
              id: userId,
            },
          },
        }
      }

      const votes: VoteCollection[] = await prisma
        .votes({
          where: {
            createdAt_gte: finalDate,

            user: {
              id: filter.user,
            },

            ...stationConditions,
          },
        })
        .$fragment(fragment)

      return sortTopics(sortType, votes)
    }

    default: {
      const topics = await prisma.topics({
        orderBy: 'createdAt_DESC',

        where: {
          createdAt_gte: finalDate,

          user: {
            id: filter.user,
          },

          station: {
            id: filter.station,
            OR: [
              {
                public: true,
              },
              {
                members_some: {
                  user: {
                    id: userId,
                  },
                },
              },
            ],
          },
        },
      })

      return topics
    }
  }
}

export default getTopics
