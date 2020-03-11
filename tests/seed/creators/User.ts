import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { alphanumeric } from '../../../src/utils/sanitizer'

import { prisma } from '../../../src/generated/prisma-client'
import { IUser } from '../interfaces'

export const createUser = async (data: IUser): Promise<IUser> => {
  data.user = await prisma.createUser({
    ...data.input,
    name: alphanumeric(data.input.name),
    identifier: alphanumeric(data.input.name).toLowerCase(),
    password: bcrypt.hashSync(data.input.password),
  })

  data.jwt = jwt.sign({ userId: data.user.id }, process.env.JWT_SECRET)

  return data
}
