import { PrismaClient } from '@prisma/client'
import { alphanumeric } from '../../../src/utils/sanitizer'
import { ITopic, IStation, IUser } from '../interfaces'
const prisma = new PrismaClient()

export const createTopic = async (
  topic: ITopic,
  station: IStation,
  user: IUser,
  prisma: PrismaClient
): Promise<ITopic> => {
  topic.topic = await prisma.topic.create({
    data: {
      ...topic.input,
      identifier: alphanumeric(topic.input.title, '_').toLowerCase(),
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
    },
  })

  return topic
}
