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
import getUserId from '../utils/getUserId'

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
    const topics = await prisma.topics({})
  },

  comments: (parent, args, { prisma }: { prisma: Prisma }, info) => {
    return prisma.comments()
  },

  votes: (parent, args, { prisma }: { prisma: Prisma }, info) => {
    return prisma.votes()
  },
}
