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

import { getSortingDate, getUserId, getTopics, sortMethods } from '../utils'
const { sortTopics } = sortMethods

export default {
  users: async (parent, args, { prisma }: { prisma: Prisma }) => {
    return prisma.users()
  },

  profile: async (
    parent,
    { identifier }: { identifier: string },
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.user({ identifier })
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
    {
      sortType,
      dateRange,
      user,
      station,
    }: {
      sortType: SortType
      dateRange: DateRange
      user: string
      station: string
    },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const finalDate = getSortingDate(dateRange)

    const filter = {
      user,
      station,
    }

    return getTopics(sortType, finalDate, filter)
  },

  comments: (parent, args, { prisma }: { prisma: Prisma }, info) => {
    return prisma.comments()
  },

  votes: (parent, args, { prisma }: { prisma: Prisma }, info) => {
    return prisma.votes()
  },
}
