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
import { getHotScore, getTopScore } from '../utils/sortMethods'
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

        const reduced = votes.reduce((acc, current) => {
          if (current.topic.id in acc) {
            acc[current.topic.id].push({ id: current.id, type: current.type })
          } else {
            acc[current.topic.id] = [{ id: current.id, type: current.type }]
          }
          return acc
        }, {})

        const sorted = votes
          .sort((a, b) => {
            const aVotes: Vote[] = reduced[a.topic.id]
            const bVotes: Vote[] = reduced[b.topic.id]
            const aScore = getHotScore(aVotes, a.topic)
            const bScore = getHotScore(bVotes, b.topic)
            return aScore > bScore ? -1 : aScore < bScore ? 1 : 0
          })
          .map(vote => vote.topic)

        // Convert Objects to strings (To ease the removal)
        const unique = new Set(sorted.map(e => JSON.stringify(e)))

        // Converting back to Objects
        const result = Array.from(unique).map(e => JSON.parse(e))

        return result
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

        const reduced = votes.reduce((acc, current) => {
          if (current.topic.id in acc) {
            acc[current.topic.id].push({ id: current.id, type: current.type })
          } else {
            acc[current.topic.id] = [{ id: current.id, type: current.type }]
          }
          return acc
        }, {})

        const sorted = votes
          .sort((a, b) => {
            const aVotes: Vote[] = reduced[a.topic.id]
            const bVotes: Vote[] = reduced[b.topic.id]
            const aScore = getTopScore(aVotes, a.topic)
            const bScore = getTopScore(bVotes, b.topic)
            return aScore > bScore ? -1 : aScore < bScore ? 1 : 0
          })
          .map(vote => vote.topic)

        // Convert Objects to strings (To ease the removal)
        const unique = new Set(sorted.map(e => JSON.stringify(e)))

        // Converting back to Objects
        const result = Array.from(unique).map(e => JSON.parse(e))

        return result
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
