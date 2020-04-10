import { GraphQLServer } from 'graphql-yoga'
import { PrismaClient } from '@prisma/client'
import { resolvers, fragmentReplacements } from './resolvers'

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
  //@ts-ignore
  fragmentReplacements,
})

export default server
