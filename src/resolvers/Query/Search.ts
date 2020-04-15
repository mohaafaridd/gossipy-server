import { PrismaClient } from '@prisma/client'
import { getUserId } from '@utils'

export default {
  async search(
    _parent: any,
    { query, page = 1 }: { query: string; page?: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) {
    const userId = getUserId(request, false)
    const normalized = query.toLowerCase()
    const skip = (page > 0 ? page : 1) * 10 - 10

    const users = prisma.user.findMany({
      skip,
      where: {
        identifier: {
          contains: normalized,
        },
      },
    })

    const stations = prisma.station.findMany({
      skip,
      where: {
        identifier: {
          contains: normalized,
        },
      },
    })

    const topics = prisma.topic.findMany({
      skip,
      where: {
        identifier: {
          contains: normalized,
        },

        station: {
          OR: [
            { public: true },
            {
              memberships: {
                some: {
                  userId,
                  state: 'ACTIVE',
                },
              },
            },
          ],
        },
      },
    })

    const results = await Promise.all([users, stations, topics])

    const map = {
      users: results[0],
      stations: results[1],
      topics: results[2],
    }

    return map
  },
}
