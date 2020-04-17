import * as bcrypt from 'bcryptjs'
import validator from 'validator'
import { PrismaClient, UserCreateInput, UserUpdateInput } from '@prisma/client'
import {
  hashPasswords,
  generateToken,
  getUserId,
  sanitizer,
  IFile,
  uploadImage,
} from '@utils'
export default {
  /**
   * This mutation is dedicated to sign a user up and return his information and an available token
   */
  signUp: async (
    _parent: any,
    { data }: { data: UserCreateInput },
    { prisma }: { prisma: PrismaClient }
  ) => {
    const { name, email } = data
    if (name.length > 16)
      throw new Error('Name has maximum length of 16 characters')
    else if (!validator.isEmail(email))
      throw new Error('Email format is not acceptable')

    const identifier = sanitizer.alphanumeric(name).toLowerCase()
    const password = await hashPasswords(data.password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        identifier,
        password,
        image: 'avatars/default.png',
      },
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
    { prisma }: { prisma: PrismaClient }
  ) => {
    const user = await prisma.user.findOne({ where: { email: data.email } })
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
    { data, image }: { data: UserUpdateInput; image: IFile },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)
    const updates: UserUpdateInput = {}

    if (typeof data.password === 'string') {
      data.password = await hashPasswords(data.password)
      updates.password = data.password
    }

    if (typeof data.email === 'string') {
      updates.email = data.email
    }

    if (image) {
      const imagePath = await uploadImage(image, 'avatars')
      updates.image = imagePath
    }

    return prisma.user.update({
      where: { id: userId },
      data: updates,
    })
  },
}
