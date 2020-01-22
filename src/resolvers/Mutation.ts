import { Prisma, UserCreateInput } from '../generated/prisma-client'
import hashPasswords from '../utils/hashPasswords'
import generateToken from '../utils/generateToken'

export default {
  createUser: async (
    parent,
    { data }: { data: UserCreateInput },
    { prisma }: { prisma: Prisma },
    info
  ) => {
    const password = await hashPasswords(data.password)
    const user = await prisma.createUser({ ...data, password })

    return { user, token: generateToken(user.id) }
  },
}
