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

    if (!isAuthorized) throw new Error('Authorization Required')

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
