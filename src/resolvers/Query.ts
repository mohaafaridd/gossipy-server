import { Prisma, User, Station } from '../generated/prisma-client'
export default {
  users: async (parent, args, { prisma }: { prisma: Prisma }, info) => {
    const users: User[] = await prisma.users()
    return users
  },

  stations: async (parent, args, { prisma }: { prisma: Prisma }, info) => {
    const stations: Station[] = await prisma.stations()
    return stations
  },

  topics: (parent, args, { prisma }: { prisma: Prisma }, info) => {
    return prisma.topics()
  },

  comments: (parent, args, { prisma }: { prisma: Prisma }, info) => {
    return prisma.comments()
  },
}
