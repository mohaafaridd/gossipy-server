import { prisma } from '../../../src/generated/prisma-client'
import { alphanumeric } from '../../../src/utils/sanitizer'
import { ITopic, IStation, IUser } from '../interfaces'

export const createTopic = async (
  topic: ITopic,
  station: IStation,
  user: IUser
): Promise<ITopic> => {
  topic.topic = await prisma.createTopic({
    ...topic.input,
    identifier: alphanumeric(topic.input.title, '_').toLowerCase(),
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
  })

  return topic
}
