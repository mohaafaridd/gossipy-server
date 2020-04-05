import {
  Prisma,
  Station,
  Membership,
  prisma,
  Role,
  MembershipState,
  MembershipWhereInput,
} from '../generated/prisma-client'
import { DateRange, SortType } from '../constants'
import { getSortingDate, getTopics, getUserId } from '../utils'
import { Filter, checkAuthorization, getConditions } from '../utils/getTopics'

export default {
  users: async (_parent: any, _args: any, { prisma }: { prisma: Prisma }) => {
    return prisma.users()
  },

  profile: async (
    _parent: any,
    { identifier }: { identifier: string },
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.user({ identifier })
  },

  stations: async (
    _parent: any,
    _args: any,
    { prisma }: { prisma: Prisma }
  ) => {
    const stations: Station[] = await prisma.stations()
    return stations
  },

  station: async (
    _parent: any,
    { identifier }: { identifier: string },
    { prisma }: { prisma: Prisma }
  ) => {
    return prisma.station({ identifier })
  },

  userMembership: async (
    _parent: any,
    { stationIdentifier }: { stationIdentifier: string },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request, false)

    const [membership] = await prisma.memberships({
      where: {
        station: {
          identifier: stationIdentifier,
        },

        user: {
          id: userId,
        },
      },
    })

    return membership
  },

  userMemberships: async (
    _parent: any,
    _args: any,
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

  memberships: async (
    _parent: any,
    {
      page,
      station,
      role,
      roles,
      state,
    }: {
      page: number
      station: string
      role: Role
      roles: Role[]
      state: MembershipState
    },
    { prisma }: { prisma: Prisma }
  ) => {
    const skip = (page > 0 ? page : 1) * 10 - 10
    const condition: MembershipWhereInput = { state }

    if (roles.length > 0) condition.role_in = roles
    else if (role) condition.role = role

    return prisma.memberships({
      skip,
      where: {
        station: {
          id: station,
        },
        ...condition,
      },
    })
  },

  topics: async (
    _parent: any,
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

  topic: async (
    _parent: any,
    {
      topicIdentifier,
      stationIdentifier,
    }: { topicIdentifier: string; stationIdentifier: string },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request, false)

    const isAuthorized = await prisma.$exists.topic({
      OR: [
        {
          identifier: topicIdentifier,
          station: {
            identifier: stationIdentifier,
            public: true,
          },
        },

        {
          identifier: topicIdentifier,
          station: {
            identifier: stationIdentifier,
            public: false,
            members_some: {
              user: {
                id: userId,
              },
              state: 'ACTIVE',
            },
          },
        },
      ],
    })

    if (!isAuthorized) throw new Error('Topic was not found')

    const [topic] = await prisma.topics({
      where: {
        identifier: topicIdentifier,
        station: {
          identifier: stationIdentifier,
        },
      },
    })

    return topic
  },

  comments: (_parent: any, _args: any, { prisma }: { prisma: Prisma }) => {
    return prisma.comments()
  },

  votes: (_parent: any, _args: any, { prisma }: { prisma: Prisma }) => {
    return prisma.votes()
  },
}
