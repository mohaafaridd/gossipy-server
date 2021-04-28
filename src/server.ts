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
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  },
  context(request: any) {
    return {
      prisma,
      request,
    }
  },
})

export default server
