import {
  Prisma,
  User,
  Station,
  Membership,
  Vote,
} from '../generated/prisma-client'
import { DateRange, SortType } from '../constants'
import getSortingDate from '../utils/getSortingDate'
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

    const getTopic = async (vote: Vote) => {
      return prisma.vote({ id: vote.id }).topic()
    }

    switch (sort) {
      case 'HOT': {
        // Get all votes in last (DATE_RANGE)
        const votes = await prisma.votes({
          where: { createdAt_gte: finalDate },
        })

        const topics = await Promise.all(votes.map(vote => getTopic(vote)))

        // {'21657asd8zxc': 2, '545as74da98sd': 3}
        const reduced = topics.reduce((acc, current) => {
          if (current.id in acc) {
            acc[current.id]++
          } else {
            acc[current.id] = 1
          }

          return acc
        }, {})

        const sorted = topics.sort((a, b) =>
          reduced[a.id] > reduced[b.id]
            ? -1
            : reduced[a.id] < reduced[b.id]
            ? 1
            : 0
        )

        // Convert Objects to strings (To ease the removal)
        const unique = new Set(sorted.map(e => JSON.stringify(e)))

        // Converting back to Objects
        const result = Array.from(unique).map(e => JSON.parse(e))

        return result
      }

      case 'TOP':
        console.log('TOP')
        return 1

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
