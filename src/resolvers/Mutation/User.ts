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
import hashPasswords from '../../utils/hashPasswords'
import generateToken from '../../utils/generateToken'
import getUserId from '../../utils/getUserId'
import sanitizer from '../../utils/sanitizer'

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
}
