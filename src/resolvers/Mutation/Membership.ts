import {
  Prisma,
  Station,
  Membership,
  MembershipUpdateInput,
} from '../../generated/prisma-client'
import getUserId from '../../utils/getUserId'

export default {
  /**
   * This mutation is dedicated to enable users to join to a station
   */
  createMembership: async (
    parent,
    { stationId }: { stationId: string },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)
    const hasMembership = await prisma.$exists.membership({
      AND: {
        user: {
          id: userId,
        },

        station: {
          id: stationId,
        },
      },
    })

    if (hasMembership) throw new Error('Already a member')

    const membership = await prisma.createMembership({
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
    })

    return membership
  },

  /**
   * This mutation is dedicated to enable admins and founder to change members state/role
   */
  updateMembership: async (
    parent,
    { id, data }: { id: string; data: MembershipUpdateInput },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    if (data.role === 'FOUNDER')
      throw new Error('You cannot pick another founder')

    // Immune founder membership
    const target = await prisma.membership({ id })
    if (target.role === 'FOUNDER') throw new Error('Founder cannot be updated')

    // Ensure authorization level (only admins and founder) able to update membership role/state
    const station: Station = await prisma.membership({ id }).station()
    const isAuthorized: Boolean = await prisma.$exists.membership({
      AND: {
        station: {
          id: station.id,
        },
        user: {
          id: userId,
        },
        role_in: ['FOUNDER', 'ADMIN'],
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    // Changes banned user role to a member
    if (data.state === 'BANNED') data.role = 'MEMBER'

    const membership: Membership = await prisma.updateMembership({
      where: { id },
      data,
    })

    return membership
  },

  /**
   * This mutation is dedicated to enable users to get out of a station without removing their posts and comments
   */
  unsubscribeMembership: async (
    parent,
    { id }: { id: string },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const isAuthorized = await prisma.$exists.membership({
      id,
      user: {
        id: userId,
      },
      state: 'ACTIVE',
      role_in: ['ADMIN', 'MEMBER', 'MODERATOR'],
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    return prisma.updateMembership({
      where: { id },
      data: {
        role: 'MEMBER',
        state: 'DETACHED',
      },
    })
  },
  /**
   * This mutation is dedicated to enable admins and founder to remove a membership (Cascading their Topics and Comments)
   */
  deleteMembership: async (
    parent,
    { id }: { id: string },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const membership = await prisma.membership({ id })
    const station = await prisma.membership({ id }).station()
    const user = await prisma.membership({ id }).user()

    const isUser = user.id === userId
    const isAuthorized: Boolean = await prisma.$exists.membership({
      AND: {
        station: {
          id: station.id,
        },
        user: {
          id: userId,
        },
        role_in: ['FOUNDER', 'ADMIN', 'MODERATOR'],
      },
    })

    if (!isUser && !isAuthorized) throw new Error('Authorization Required')

    if (membership.role === 'FOUNDER')
      throw new Error('This membership is the founder')

    if (membership.state === 'BANNED')
      throw new Error('This membership is banned')

    const deleted = await prisma.deleteMembership({ id })

    return {
      membership: deleted,
      user,
      station,
    }
  },
}
