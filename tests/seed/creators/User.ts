import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { alphanumeric } from '../../../src/utils/sanitizer'
import { IUser } from '../interfaces'

export const createUser = async (
  data: IUser,
  prisma: PrismaClient
): Promise<IUser> => {
  data.user = await prisma.user.create({
    data: {
      ...data.input,
      name: data.input.name,
      identifier: alphanumeric(data.input.name).toLowerCase(),
      password: bcrypt.hashSync(data.input.password),
    },
  })

  data.jwt = jwt.sign(
    { userId: data.user.id },
    process.env.JWT_SECRET || 'DummyKey'
  )

  return data
}
