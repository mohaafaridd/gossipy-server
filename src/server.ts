import { GraphQLServer } from 'graphql-yoga'
import { PrismaClient } from '@prisma/client'
import { resolvers } from './resolvers'

const prisma = new PrismaClient()
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return {
      prisma,
      request,
    }
  },
})

export default server
