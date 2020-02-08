import User from './Mutation/User'
import Station from './Mutation/Station'
import Membership from './Mutation/Membership'
import Topic from './Mutation/Topic'
import Comment from './Mutation/Comment'

export default {
  ...User,
  ...Station,
  ...Membership,
  ...Topic,
  ...Comment,
}
