import { PrismaClient, Role, State } from '@prisma/client'

import { IUser, IStation } from '../interfaces'

export const createMembership = async (
  user: IUser,
  station: IStation,
  role: Role = 'MEMBER',
  state: State = 'PENDING',
  prisma: PrismaClient
): Promise<IUser> => {
  user.membership = await prisma.membership.create({
    data: {
      user: {
        connect: {
          id: user.user?.id,
        },
      },

      station: {
        connect: {
          id: station.station?.id,
        },
      },

      role,
      state,
    },
  })

  return user
}
