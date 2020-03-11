import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { prisma } from '../../../src/generated/prisma-client'
import { IUser } from '../interfaces'

export const createUser = async (data: IUser): Promise<IUser> => {
  data.user = await prisma.createUser({
    ...data.input,
    password: bcrypt.hashSync(data.input.password),
  })

  data.jwt = jwt.sign({ userId: data.user.id }, process.env.JWT_SECRET)

  return data
}
