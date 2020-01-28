import { extractFragmentReplacements } from 'prisma-binding'

import Query from './Query'
import Mutation from './Mutation'

import User from './User'
import Station from './Station'
import Membership from './Membership'
import Topic from './Topic'

const resolvers = {
  Query,
  Mutation,
  User,
  Station,
  Membership,
  Topic,
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }
