import { SortType } from '../constants'
import {
  prisma,
  Topic,
  Vote,
  VoteWhereInput,
  TopicWhereInput,
} from '../generated/prisma-client'
import { sortTopics } from './sortMethods'

interface VoteCollection extends Vote {
  topic: Topic
}

export type Filter = 'STATION' | 'USER' | 'HOME' | 'EXPLORE'

export const checkAuthorization = async (
  userId: string,
  stationIdentifier: string
) => {
  const isAuthorized = await prisma.$exists.membership({
    station: { identifier: stationIdentifier },
    user: { id: userId },
    state: 'ACTIVE',
  })

  return isAuthorized
}

export const getConditions = (
  filter: Filter,
  userId: string,
  identifier?: string
) => {
  const conditions: VoteWhereInput & TopicWhereInput = {
    station: {
      identifier: filter === 'STATION' ? identifier : undefined,

      public: filter === 'EXPLORE' ? true : undefined,

      members_some: {
        user: {
          id: filter === 'HOME' ? userId : undefined,
        },

        state: filter === 'HOME' ? 'ACTIVE' : undefined,
      },
    },

    user: {
      identifier: filter === 'USER' ? identifier : undefined,
    },
  }

  return conditions
}

const getTopics = async (
  sortType: SortType,
  finalDate: string,
  conditions: VoteWhereInput & TopicWhereInput
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
            ...conditions,
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
          ...conditions,
        },
      })

      return topics
    }
  }
}

export default getTopics
