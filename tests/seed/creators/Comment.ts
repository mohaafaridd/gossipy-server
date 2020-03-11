import { prisma } from '../../../src/generated/prisma-client'
import { IComment, IStation, IUser, ITopic } from '../interfaces'

export const createComment = async (
  comment: IComment,
  topic: ITopic,
  station: IStation,
  user: IUser
): Promise<IComment> => {
  comment.comment = await prisma.createComment({
    ...comment.input,
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

  return comment
}
