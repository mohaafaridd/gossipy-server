import * as bcrypt from 'bcryptjs'
import {
  Prisma,
  User,
  UserCreateInput,
  UserUpdateInput,
  Station,
  StationCreateInput,
  StationUpdateInput,
  Membership,
  MembershipCreateInput,
  MembershipUpdateInput,
} from '../generated/prisma-client'
import hashPasswords from '../utils/hashPasswords'
import generateToken from '../utils/generateToken'
import getUserId from '../utils/getUserId'
import sanitizer from '../utils/sanitizer'

export default {
  /**
   * This mutation is dedicated to sign a user up and return his information and an available token
   */
  signUp: async (
    parent,
    { data }: { data: UserCreateInput },
    { prisma }: { prisma: Prisma },
    info
  ) => {
    const password = await hashPasswords(data.password)
    const name = sanitizer.alphanumeric(data.name)
    const identifier = name.toLowerCase()

    const user: User = await prisma.createUser({
      ...data,
      password,
      name,
      identifier,
    })
    return {
      user,
      token: generateToken(user.id),
    }
  },

  /**
   * This mutation is dedicated to sign user in and return his information and an available token
   */
  signIn: async (
    parent,
    { data }: { data: { email: string; password: string } },
    { prisma }: { prisma: Prisma },
    info
  ) => {
    const user: User = await prisma.user({ email: data.email })
    if (!user) throw new Error('Login failed')

    const isMatch = await bcrypt.compare(data.password, user.password)
    if (!isMatch) throw new Error('Login failed')

    return {
      user,
      token: generateToken(user.id),
    }
  },

  /**
   * This mutation is dedicated to enable user to update his own data (other than identifier)
   */
  updateUser: async (
    parent,
    { data }: { data: UserUpdateInput },
    { prisma, request }: { prisma: Prisma; request: any },
    info
  ) => {
    const userId = getUserId(request)
    if (typeof data.password === 'string') {
      data.password = await hashPasswords(data.password)
    }

    return prisma.updateUser({
      where: { id: userId },
      data,
    })
  },

  /**
   * This mutation is dedicated to enable authenticated users to create their own stations
   */
  createStation: async (
    parent,
    { data }: { data: StationCreateInput },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const name = sanitizer.alphanumeric(data.name)
    const identifier = name.toLowerCase()

    const station: Station = await prisma.createStation({
      ...data,
      name,
      identifier,
      members: {
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
          role: 'FOUNDER',
          state: 'ACTIVE',
        },
      },
    })

    return station
  },

  /**
   * This mutation is dedicated to modify station's description and public flag
   */
  updateStation: async (
    parent,
    { id, data }: { id: string; data: StationUpdateInput },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const isAuthorized = await prisma.$exists.membership({
      AND: {
        station: {
          id,
        },
        user: {
          id: userId,
        },
        role_in: ['FOUNDER', 'ADMIN'],
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    const station = await prisma.updateStation({
      where: { id },
      data,
    })

    return station
  },

  /**
   * This mutation is dedicated to enable the station founder to delete it
   */
  deleteStation: async (
    parent,
    { id }: { id: string },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const isAuthorized = await prisma.$exists.membership({
      AND: {
        station: {
          id,
        },
        user: {
          id: userId,
        },
        role_in: ['FOUNDER'],
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    const station = await prisma.deleteStation({ id })
    return station
  },

  /**
   * This mutation is dedicated to enable users to join to a station
   */
  createMembership: async (
    parent,
    { stationId, data }: { stationId: string; data: MembershipCreateInput },
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
   * This mutation is dedicated to enable admins and founder to remove a membership
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
