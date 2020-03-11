import { prisma } from '../../../src/generated/prisma-client'
import { IVote, IStation, IUser, ITopic } from '../interfaces'

export const createVote = async (
  vote: IVote,
  topic: ITopic,
  station: IStation,
  user: IUser
): Promise<IVote> => {
  vote.vote = await prisma.createVote({
    ...vote.input,
    station: {
      connect: {
        id: station.station.id,
      },
    },

    user: {
      connect: {
        id: user.user.id,
      },
    },

    membership: {
      connect: {
        id: user.membership.id,
      },
    },

    topic: {
      connect: {
        id: topic.topic.id,
      },
    },
  })

  return vote
}
