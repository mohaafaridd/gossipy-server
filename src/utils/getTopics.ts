import { SortType } from '../constants'
import { prisma, Topic, Vote } from '../generated/prisma-client'
import { sortTopics } from './sortMethods'
interface Filter {
  user: string
  station: string
}

interface VoteCollection extends Vote {
  topic: Topic
}

const getTopics = async (
  sortType: SortType,
  finalDate: string,
  filter: Filter
): Promise<Topic[]> => {
  const fragment =
    'fragment TopicToVotes on Vote { id type topic { id title createdAt } }'

  switch (sortType) {
    case 'TOP':
    case 'HOT': {
      const votes: VoteCollection[] = await prisma
        .votes({
          where: {
            createdAt_gte: finalDate,

            user: {
              id: filter.user,
            },

            station: {
              id: filter.station,
            },
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
          },
        },
      })

      return topics
    }
  }
}

export default getTopics
