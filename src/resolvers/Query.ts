import { Prisma, User, Station, Membership } from '../generated/prisma-client'
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
    console.log('finalDate', finalDate)

    const topics = await prisma.topics({
      where: {
        createdAt_gte: finalDate,
      },
    })

    const votes = await prisma.votes({
      where: {
        topic: {
          createdAt_gte: finalDate,
        },
      },
    })

    // const [topic] = topics
    // const hotRatio = sortHot(votes, topic)
    // console.log('hotRatio', hotRatio)

    switch (sort) {
      case 'HOT':
        console.log('HOT')
        return 1

      case 'TOP':
        console.log('TOP')
        return 1

      default:
        console.log('NEW')
        return 1
    }
    return topics
  },

  comments: (parent, args, { prisma }: { prisma: Prisma }, info) => {
    return prisma.comments()
  },

  votes: (parent, args, { prisma }: { prisma: Prisma }, info) => {
    return prisma.votes()
  },
}
