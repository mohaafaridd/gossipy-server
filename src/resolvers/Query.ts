import {
  Prisma,
  User,
  Station,
  Membership,
  Vote,
  VoteType,
  Topic,
} from '../generated/prisma-client'
import { DateRange, SortType } from '../constants'
import getSortingDate from '../utils/getSortingDate'
import { sortTopics } from '../utils/sortMethods'

export default {
  users: async (parent, args, { prisma }: { prisma: Prisma }) => {
    return prisma.users()
  },

  profile: async (
    parent,
    { identifier }: { identifier: string },
    { prisma }: { prisma: Prisma }
  ) => {
    const user = await prisma.user({ identifier })
    const stations = await prisma.stations({
      where: {
        members_some: {
          user: {
            identifier,
          },
        },
      },
    })
    return { user, stations }
  },

  stations: async (parent, args, { prisma }: { prisma: Prisma }, info) => {
    const stations: Station[] = await prisma.stations()
    return stations
  },

  station: async (
    parent,
    { identifier }: { identifier: string },
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.station({ identifier })
  },

  memberships: async (parent, args, { prisma }: { prisma: Prisma }, info) => {
    const memberships: Membership[] = await prisma.memberships()
    return memberships
  },

  topics: async (
    parent,
    { sort, dateRange }: { sort: SortType; dateRange: DateRange },
    { prisma }: { prisma: Prisma },
    info
  ) => {
    const finalDate = getSortingDate(dateRange)

    switch (sort) {
      case 'HOT': {
        const votes: {
          id: string
          type: VoteType
          topic: Topic
        }[] = await prisma.votes({
          where: { createdAt_gte: finalDate },
        }).$fragment(`
          fragment TopicToVotes on Vote {
            id
            type
            topic {
              id
              title
              createdAt
            }
          }
        `)

        const topics = sortTopics('HOT', votes)
        return topics
      }

      case 'TOP': {
        const votes: {
          id: string
          type: VoteType
          topic: Topic
        }[] = await prisma.votes({
          where: { createdAt_gte: finalDate },
        }).$fragment(`
            fragment TopicToVotes on Vote {
              id
              type
              topic {
                id
                title
                createdAt
              }
            }
          `)

        const topics = sortTopics('TOP', votes)
        return topics
      }

      default:
        const topics = await prisma.topics({
          orderBy: 'createdAt_DESC',
          where: {
            createdAt_gte: finalDate,
          },
        })
        return topics
    }
  },

  comments: (parent, args, { prisma }: { prisma: Prisma }, info) => {
    return prisma.comments()
  },

  votes: (parent, args, { prisma }: { prisma: Prisma }, info) => {
    return prisma.votes()
  },
}
