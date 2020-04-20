import User from './Mutation/User'
import Station from './Mutation/Station'
import Membership from './Mutation/Membership'
import Topic from './Mutation/Topic'
import Comment from './Mutation/Comment'
import Vote from './Mutation/Vote'
import Tag from './Mutation/Tag'

export default {
  ...User,
  ...Station,
  ...Membership,
  ...Topic,
  ...Comment,
  ...Vote,
  ...Tag,
}
