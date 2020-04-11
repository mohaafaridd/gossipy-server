// import {
//   Prisma,
//   Station,
//   Membership,
//   MembershipUpdateInput,
// } from '../../generated/prisma-client'
import { PrismaClient, MembershipUpdateInput } from '@prisma/client'

import { getUserId } from '../../utils'

export default {
  /**
   * This mutation is dedicated to enable users to join to a station
   */
  createMembership: async (
    _parent: any,
    { stationId }: { stationId: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)
    const station = await prisma.station.findOne({ where: { id: stationId } })
    const [membership] = await prisma.membership.findMany({
      where: { userId, stationId },
    })

    if (membership?.state === 'BANNED') throw new Error('Membership is banned')
    if (membership?.state === 'PENDING')
      throw new Error('Membership is Pending')
    if (membership?.state === 'ACTIVE') throw new Error('Already a member')

    const upsert = await prisma.membership.upsert({
      where: {
        id: membership.id,
      },

      create: {
        user: {
          connect: {
            id: userId,
          },
        },
        station: {
          connect: {
            id: stationId,
          },
        },

        state: station?.public ? 'ACTIVE' : 'PENDING',
      },

      update: {
        state: 'PENDING',
      },
    })

    return upsert
  },

  /**
   * This mutation is dedicated to enable admins and founder to change members state/role
   */
  updateMembership: async (
    _parent: any,
    { id, data }: { id: number; data: MembershipUpdateInput },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)

    if (data.role === 'FOUNDER')
      throw new Error('You cannot pick another founder')

    // Immune founder membership
    const target = await prisma.membership.findOne({ where: { id } })
    if (!target) throw new Error('Could not find membership')
    if (target.role === 'FOUNDER') throw new Error('Founder cannot be updated')

    // Ensure authorization level (only admins and founder) able to update membership role/state
    const station = await prisma.membership.findOne({ where: { id } }).station()
    if (!station) throw new Error('Could not find station')

    const [isAuthorized] = await prisma.membership.findMany({
      where: {
        userId,
        stationId: station.id,
        role: {
          in: ['FOUNDER', 'ADMIN'],
        },
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    // Changes banned user role to a member
    if (data.state === 'BANNED') data.role = 'MEMBER'

    const membership = await prisma.membership.update({
      where: { id },
      data,
    })

    return membership
  },

  /**
   * This mutation is dedicated to enable users to get out of a station without removing their posts and comments
   */
  unsubscribeMembership: async (
    _parent: any,
    { id }: { id: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)

    const [isAuthorized] = await prisma.membership.findMany({
      where: {
        id,
        userId,
        state: 'ACTIVE',
        role: {
          in: ['ADMIN', 'MEMBER', 'MODERATOR'],
        },
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    const membership = prisma.membership.update({
      where: { id },
      data: {
        role: 'MEMBER',
        state: 'DETACHED',
      },
    })

    return membership
  },
  /**
   * This mutation is dedicated to enable admins and founder to remove a membership (Cascading their Topics and Comments)
   */
  deleteMembership: async (
    _parent: any,
    { id }: { id: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)

    const station = await prisma.membership.findOne({ where: { id } }).station()

    const [membership] = await prisma.membership.findMany({
      where: {
        userId,
        stationId: station?.id,
        role: {
          in: ['FOUNDER', 'ADMIN'],
        },
      },
    })

    if (!membership) throw new Error('Authorization Required')

    if (membership?.role === 'FOUNDER')
      throw new Error('This membership is the founder')

    if (membership?.state === 'BANNED')
      throw new Error('This membership is banned')

    const deleted = await prisma.membership.delete({ where: { id } })

    return deleted
  },
}
