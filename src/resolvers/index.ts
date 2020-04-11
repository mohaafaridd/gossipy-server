// import { extractFragmentReplacements } from 'prisma-binding'

import Query from './Query'
import Mutation from './Mutation'

import User from './User'
import Station from './Station'
import Membership from './Membership'
import Topic from './Topic'
import Comment from './Comment'
import Vote from './Vote'

const resolvers = {
  Query,
  Mutation,
  User,
  Station,
  Membership,
  Topic,
  Comment,
  Vote,
}

export { resolvers }
