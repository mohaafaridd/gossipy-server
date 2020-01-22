import {
  Prisma,
  UserCreateInput,
  UserUpdateInput,
} from '../generated/prisma-client'
import * as bcrypt from 'bcryptjs'
import hashPasswords from '../utils/hashPasswords'
import generateToken from '../utils/generateToken'
import getUserId from '../utils/getUserId'

export default {
  signUp: async (
    parent,
    { data }: { data: UserCreateInput },
    { prisma }: { prisma: Prisma },
    info
  ) => {
    const password = await hashPasswords(data.password)
    const user = await prisma.createUser({ ...data, password })
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
    const user = await prisma.user({ email: data.email })
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
    return prisma.updateUser({
      where: { id: userId },
      data,
    })
  },
}
