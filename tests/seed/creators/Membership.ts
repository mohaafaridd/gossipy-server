import {
  prisma,
  Role,
  MembershipState,
} from '../../../src/generated/prisma-client'
import { IUser, IStation } from '../interfaces'

export const createMembership = async (
  user: IUser,
  station: IStation,
  role: Role = 'MEMBER',
  state: MembershipState = 'PENDING'
): Promise<IUser> => {
  user.membership = await prisma.createMembership({
    user: {
      connect: {
        id: user.user.id,
      },
    },

    station: {
      connect: {
        id: station.station.id,
      },
    },

    role,
    state,
  })

  return user
}
