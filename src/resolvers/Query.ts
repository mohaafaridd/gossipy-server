import { Prisma, Station, Membership, prisma } from '../generated/prisma-client'
import { DateRange, SortType } from '../constants'
import { getSortingDate, getTopics, getUserId } from '../utils'
import { Filter, checkAuthorization, getConditions } from '../utils/getTopics'

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

  stations: async (parent, args, { prisma }: { prisma: Prisma }) => {
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

  userMembership: async (
    parent,
    { station }: { station: string },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const [membership] = await prisma.memberships({
      where: {
        station: {
          id: station,
        },

        user: {
          id: userId,
        },
      },
    })

    return membership
  },

  userMemberships: async (
    parent,
    args,
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const memberships = await prisma.memberships({
      where: {
        user: {
          id: userId,
        },

        state: 'ACTIVE',
      },
    })

    return memberships
  },

  memberships: async (parent, args, { prisma }: { prisma: Prisma }) => {
    const memberships: Membership[] = await prisma.memberships()
    return memberships
  },

  topics: async (
    parent,
    {
      sortType,
      dateRange,
      subscribed,
      user,
      station,
    }: {
      sortType: SortType
      dateRange: DateRange
      subscribed: boolean
      user: string
      station: string
    },
    { request }: { request: any }
  ) => {
    const userId = getUserId(request, false)
    const pStation = station
      ? await prisma.station({ identifier: station })
      : undefined

    // Authorization
    const isAuthorized =
      pStation?.public === false
        ? await checkAuthorization(userId, station)
        : true

    if (!isAuthorized) throw new Error('You must be a member to view topics.')

    const finalDate = getSortingDate(dateRange)

    const filter: Filter = subscribed
      ? 'HOME'
      : user
      ? 'USER'
      : station
      ? 'STATION'
      : 'EXPLORE'

    const targetIdentifier = user ? user : station

    const conditions = getConditions(filter, userId, targetIdentifier)

    return getTopics(sortType, finalDate, conditions)
  },

  comments: (parent, args, { prisma }: { prisma: Prisma }) => {
    return prisma.comments()
  },

  votes: (parent, args, { prisma }: { prisma: Prisma }) => {
    return prisma.votes()
  },
}
