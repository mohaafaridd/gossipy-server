import { PrismaClient } from '@prisma/client'
import { getUserId } from '@utils'

export default {
  async tags(
    _parent: any,
    { statiodId }: { statiodId: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) {
    const userId = getUserId(request, false)

    const tags = await prisma.tag.findMany({
      where: {
        station: {
          id: statiodId,
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

    return tags
  },

  async tag(
    _parent: any,
    { id }: { id: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) {
    const userId = getUserId(request, false)

    const [tag] = await prisma.tag.findMany({
      where: {
        id,
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

    return tag
  },
}
