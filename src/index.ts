import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated/prisma-client'

const resolvers = {
  Query: {
    users: (parent, args, { prisma }, info) => {
      return prisma.users(null, info)
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    prisma
  }
})

server.start(() => console.log('The server is on'))
