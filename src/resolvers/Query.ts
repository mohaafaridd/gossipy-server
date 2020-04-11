import { PrismaClient, Role, State, MembershipWhereInput } from '@prisma/client'

import { DateRange, SortType } from '../constants'
import { getUserId } from '../utils'

export default {
  users: async (
    _parent: any,
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const user = await prisma.user.findMany()
    return user
  },

  profile: async (
    _parent: any,
    { identifier }: { identifier: string },
    { prisma }: { prisma: PrismaClient }
  ) => {
    const user = await prisma.user.findOne({ where: { identifier } })
    return user
  },

  stations: async (
    _parent: any,
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const stations = await prisma.station.findMany()
    return stations
  },

  station: async (
    _parent: any,
    { identifier }: { identifier: string },
    { prisma }: { prisma: PrismaClient }
  ) => {
    return prisma.station.findOne({ where: { identifier } })
  },

  userMembership: async (
    _parent: any,
    { stationIdentifier }: { stationIdentifier: string },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request, false)

    const [membership] = await prisma.membership.findMany({
      where: {
        userId,
        station: {
          identifier: stationIdentifier,
        },
      },
    })

    return membership
  },

  userMemberships: async (
    _parent: any,
    _args: any,
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)

    const memberships = await prisma.membership.findMany({
      where: {
        userId,
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
      station: number
      role: Role
      roles: Role[]
      state: State
    },
    { prisma }: { prisma: PrismaClient }
  ) => {
    const skip = (page > 0 ? page : 1) * 10 - 10
    const condition: MembershipWhereInput = {
      state,
      role: {
        equals: role,
        in: roles,
      },
    }

    return prisma.membership.findMany({
      skip,
      where: {
        stationId: station,
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
      user: number
      station: number
    },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const topics = await prisma.topic.findMany()
    return topics
  },

  topic: async (
    _parent: any,
    {
      topicIdentifier,
      stationIdentifier,
    }: { topicIdentifier: string; stationIdentifier: string },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const [topic] = await prisma.topic.findMany({
      where: {
        identifier: topicIdentifier,
        station: {
          identifier: stationIdentifier,
        },
      },
    })
    return topic
  },

  comments: async (
    _parent: any,
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const comments = await prisma.comment.findMany()
    return comments
  },

  votes: async (
    _parent: any,
    _args: any,
    { prisma }: { prisma: PrismaClient }
  ) => {
    const votes = await prisma.vote.findMany()
    return votes
  },
}
