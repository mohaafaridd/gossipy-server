import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated/prisma-client'

const resolvers = {
  Query: {
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
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    prisma,
  },
})

server.start(() => console.log('The server is on'))
