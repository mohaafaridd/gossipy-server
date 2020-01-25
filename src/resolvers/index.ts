import { extractFragmentReplacements } from 'prisma-binding'

import Query from './Query'
import Mutation from './Mutation'

import User from './User'
import Station from './Station'
import Membership from './Membership'

const resolvers = {
  Query,
  Mutation,
  User,
  Station,
  Membership,
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }
