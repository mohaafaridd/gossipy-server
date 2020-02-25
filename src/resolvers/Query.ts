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
import { getHotScore, getTopScore, sortTopics } from '../utils/sortMethods'
// import { sortHot } from '../utils/sortMethods'

const topTopics = () => {}

export default {
  users: async (parent, args, { prisma }: { prisma: Prisma }, info) => {
    const users: User[] = await prisma.users()
    return users
  },

  stations: async (parent, args, { prisma }: { prisma: Prisma }, info) => {
    const stations: Station[] = await prisma.stations()
    return stations
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
