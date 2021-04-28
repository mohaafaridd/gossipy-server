import { ApolloServer } from 'apollo-server'
import { importSchema } from 'graphql-import'
import { PrismaClient } from '@prisma/client'
import { resolvers } from './resolvers'

const prisma = new PrismaClient()
const typeDefs = importSchema('src/schema.graphql')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  cors: true,
  context(request: any) {
    return {
      prisma,
      request,
    }
  },
})

export default server
