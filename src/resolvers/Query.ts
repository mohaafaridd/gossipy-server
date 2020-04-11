import { PrismaClient, Role, State, MembershipWhereInput } from '@prisma/client'

import { DateRange, SortType } from '../constants'
import { getUserId } from '../utils'

import Comment from './Query/Comment'
import Membership from './Query/Membership'
import Station from './Query/Station'
import Topic from './Query/Topic'
import User from './Query/User'

export default {
  ...Comment,
  ...Membership,
  ...Station,
  ...Topic,
  ...User,
}
