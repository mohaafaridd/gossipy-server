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
  Topic,
  TopicCreateInput,
} from '../../generated/prisma-client'
import { hashPasswords, generateToken, getUserId, sanitizer } from '../../utils'

export default {
  /**
   * This mutation is dedicated to sign a user up and return his information and an available token
   */
  signUp: async (
    _parent: any,
    { data }: { data: UserCreateInput },
    { prisma }: { prisma: Prisma }
  ) => {
    const { name } = data
    if (name.length > 16)
      throw new Error('Name has maximum length of 16 characters')
    const identifier = sanitizer.alphanumeric(name).toLowerCase()
    const password = await hashPasswords(data.password)

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
    _parent: any,
    { data }: { data: { email: string; password: string } },
    { prisma }: { prisma: Prisma }
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

  /**
   * This mutation is dedicated to enable user to update his own data (other than identifier)
   */
  updateUser: async (
    _parent: any,
    { data }: { data: UserUpdateInput },
    { prisma, request }: { prisma: Prisma; request: any }
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
