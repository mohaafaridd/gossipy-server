import { Prisma, Station } from '../generated/prisma-client'

export default {
  founded: async ({ id }, args, { prisma }: { prisma: Prisma }) => {
    const stations: Station[] = await prisma.user({ id }).founded()
    return stations
  },
}
