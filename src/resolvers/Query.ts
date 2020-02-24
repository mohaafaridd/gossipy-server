import { Prisma, User, Station, Membership } from '../generated/prisma-client'
import { DateRange } from '../constants/time'
import getSortingDate from '../utils/getSortingDate'

type SortType = 'HOT' | 'TOP' | 'NEW'

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

  topics: (
    parent,
    { sort, dateRange }: { sort: SortType; dateRange: DateRange },
    { prisma }: { prisma: Prisma },
    info
  ) => {
    const finalDate = getSortingDate(dateRange)
    console.log('finalDate', finalDate)
    switch (sort) {
      case 'HOT':
        console.log('HOT')
        break

      case 'TOP':
        console.log('TOP')
        break

      default:
        console.log('NEW')
        break
    }
    return prisma.topics()
  },

  comments: (parent, args, { prisma }: { prisma: Prisma }, info) => {
    return prisma.comments()
  },
}
