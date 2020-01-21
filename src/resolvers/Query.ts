export default {
  users: (parent, args, { prisma }, info) => {
    return prisma.users(null, info)
  },

  stations: (parent, args, { prisma }, info) => {
    return prisma.stations(null, info)
  },

  topics: (parent, args, { prisma }, info) => {
    return prisma.topics(null, info)
  },

  comments: (parent, args, { prisma }, info) => {
    return prisma.comments(null, info)
  },
}
