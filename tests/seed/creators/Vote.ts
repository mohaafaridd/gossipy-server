import { PrismaClient } from '@prisma/client'
import { IVote, IStation, IUser, ITopic } from '../interfaces'
const prisma = new PrismaClient()

export const createVote = async (
  vote: IVote,
  topic: ITopic,
  station: IStation,
  user: IUser,
  prisma: PrismaClient
): Promise<IVote> => {
  vote.vote = await prisma.vote.create({
    data: {
      ...vote.input,
      station: {
        connect: {
          id: station.station?.id,
        },
      },

      user: {
        connect: {
          id: user.user?.id,
        },
      },

      membership: {
        connect: {
          id: user.membership?.id,
        },
      },

      topic: {
        connect: {
          id: topic.topic?.id,
        },
      },
    },
  })

  return vote
}
