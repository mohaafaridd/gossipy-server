import * as bcrypt from 'bcryptjs'
import {
  Prisma,
  UserCreateInput,
  UserUpdateInput,
  StationCreateInput,
  StationUpdateInput,
  User,
  Station,
  Membership,
} from '../generated/prisma-client'
import hashPasswords from '../utils/hashPasswords'
import generateToken from '../utils/generateToken'
import getUserId from '../utils/getUserId'
import sanitizer from '../utils/sanitizer'

export default {
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

    if (typeof data.identifier === 'string') {
      delete data.identifier
    }

    if (typeof data.name === 'string') {
      data.name = sanitizer.alphanumeric(data.name)
      data.identifier = data.name.toLowerCase()
    }

    return prisma.updateUser({
      where: { id: userId },
      data,
    })
  },

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
          role: 'ADMIN',
        },
      },
    })

    return station
  },

  updateStation: async (
    parent,
    { id, data }: { id: string; data: StationUpdateInput },
    { prisma, request }: { prisma: Prisma; request: any }
  ) => {
    const userId = getUserId(request)

    const isAuthorized = await prisma.$exists.membership({
      AND: {
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
}
