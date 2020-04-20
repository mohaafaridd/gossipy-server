import { PrismaClient } from '@prisma/client'
import { getUserId } from '@utils'

export default {
  /*
   * This mutation creates a tag and clip it with a station
   */
  createTag: async (
    _parent: any,
    { stationId, data }: { stationId: number; data: { name: string } },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)
    const [membership] = await prisma.membership.findMany({
      where: {
        userId,
        stationId,
        state: 'ACTIVE',
        role: {
          in: ['ADMIN', 'FOUNDER'],
        },
      },
    })

    if (!membership) throw new Error('Authorization Required')

    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        station: {
          connect: {
            id: stationId,
          },
        },
      },
    })

    return tag
  },

  /*
   * This mutation updates a tag
   */
  updateTag: async (
    _parent: any,
    { id, data }: { id: number; data: { name: string } },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)

    const [tagExists] = await prisma.tag.findMany({
      where: {
        id,
        station: {
          memberships: {
            some: {
              userId,
              state: 'ACTIVE',
              role: {
                in: ['ADMIN', 'FOUNDER'],
              },
            },
          },
        },
      },
    })

    if (!tagExists) throw new Error('Could not find tag')

    const tag = await prisma.tag.update({
      where: { id },
      data: { name: data.name },
    })

    return tag
  },

  /*
   * This mutation deletes a tag
   */
  deleteTag: async (
    _parent: any,
    { id }: { id: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)

    const [tagExists] = await prisma.tag.findMany({
      where: {
        id,
        station: {
          memberships: {
            some: {
              userId,
              state: 'ACTIVE',
              role: {
                in: ['ADMIN', 'FOUNDER'],
              },
            },
          },
        },
      },
    })

    if (!tagExists) throw new Error('Could not find tag')

    const tag = await prisma.tag.delete({
      where: { id },
    })

    return tag
  },
}
