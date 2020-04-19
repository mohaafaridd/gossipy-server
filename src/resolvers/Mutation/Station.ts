import {
  PrismaClient,
  StationCreateInput,
  StationUpdateInput,
} from '@prisma/client'
import { getUserId, sanitizer, IFile, uploadImage } from '@utils'

export default {
  /**
   * This mutation is dedicated to enable authenticated users to create their own stations
   */
  createStation: async (
    _parent: any,
    { data }: { data: StationCreateInput },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)

    const name = sanitizer.alphanumeric(data.name)

    if (name.length < 2 || name.length > 16)
      throw new Error('Station name length error')

    const identifier = name.toLowerCase()

    const invalid = ['create']

    if (invalid.includes(identifier))
      throw new Error('Station name is not valid')

    const station = await prisma.station.create({
      data: {
        name,
        identifier,
        description: data.description,
        public: data.public,
        memberships: {
          create: {
            role: 'FOUNDER',
            state: 'ACTIVE',
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    })

    return station
  },

  /**
   * This mutation is dedicated to modify station's description and public flag
   */
  updateStation: async (
    _parent: any,
    {
      id,
      data,
      image,
    }: { id: number; data: StationUpdateInput; image?: IFile },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)

    const [isAuthorized] = await prisma.membership.findMany({
      where: {
        userId,
        stationId: id,
        role: 'FOUNDER',
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    if (image) {
      const imagePath = await uploadImage(image, 'stations')
      data.image = imagePath
    }

    const station = await prisma.station.update({
      where: { id },
      data,
    })

    return station
  },

  /**
   * This mutation is dedicated to enable the station founder to delete it
   */
  deleteStation: async (
    _parent: any,
    { id }: { id: number },
    { prisma, request }: { prisma: PrismaClient; request: any }
  ) => {
    const userId = getUserId(request)

    const [isAuthorized] = await prisma.membership.findMany({
      where: {
        userId,
        stationId: id,
        role: 'FOUNDER',
      },
    })

    if (!isAuthorized) throw new Error('Authorization Required')

    const station = await prisma.station.delete({ where: { id } })
    return station
  },
}
