import Comment from './Query/Comment'
import Membership from './Query/Membership'
import Station from './Query/Station'
import Topic from './Query/Topic'
import User from './Query/User'
import Search from './Query/Search'
import Tag from './Query/Tag'

export default {
  ...Comment,
  ...Membership,
  ...Station,
  ...Topic,
  ...User,
  ...Search,
  ...Tag,
}
