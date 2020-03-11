import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
  prisma,
  User,
  Station,
  Membership,
  Topic,
  Comment,
  VoteType,
  Vote,
} from '../../src/generated/prisma-client'
import sanitizer from '../../src/utils/sanitizer'

interface IUserData {
  input: IUserInput
  user: User
  membership: Membership
  jwt: String
}

interface IUserInput {
  name: string
  identifier: string
  email: string
  password: string
}

interface IStationData {
  input: IStationInput
  station: Station
}

interface IStationInput {
  name: string
  identifier: string
  description: string
  public: boolean
}

interface ITopicData {
  input: ITopicInput
  topic: Topic
  membership: Membership
}

interface ITopicInput {
  title: string
  content: string
}

interface IVoteData {
  input: IVoteInput
  vote: Vote
}

interface IVoteInput {
  type: VoteType
}

interface ICommentData {
  input: ICommentInput
  comment: Comment
  membership: Membership
}

interface ICommentInput {
  content: string
}

const userOne: IUserData = {
  input: {
    name: sanitizer.alphanumeric('Mohammed Farid'),
    identifier: sanitizer.alphanumeric('Mohammed Farid').toLowerCase(),
    email: 'moha@gmail.com',
    password: 'qwertyzxc123',
  },

  user: undefined,
  membership: undefined,
  jwt: undefined,
}

const userTwo: IUserData = {
  input: {
    name: sanitizer.alphanumeric('Farid Khamis'),
    identifier: sanitizer.alphanumeric('Farid Khamis').toLowerCase(),
    email: 'farid@gmail.com',
    password: 'qwertyzxc123',
  },

  user: undefined,
  membership: undefined,
  jwt: undefined,
}

const userThree: IUserData = {
  input: {
    name: sanitizer.alphanumeric('Sherif Ashraf'),
    identifier: sanitizer.alphanumeric('Sherif Ashraf').toLowerCase(),
    email: 'sherif@gmail.com',
    password: 'qwertyzxc123',
  },

  user: undefined,
  membership: undefined,
  jwt: undefined,
}

const userFour: IUserData = {
  input: {
    name: sanitizer.alphanumeric('Ashraf Farouq'),
    identifier: sanitizer.alphanumeric('Ashraf Farouq').toLowerCase(),
    email: 'farouq@gmail.com',
    password: 'qwertyzxc123',
  },

  user: undefined,
  membership: undefined,
  jwt: undefined,
}

const userFive: IUserData = {
  input: {
    name: sanitizer.alphanumeric('Mohamed Adel'),
    identifier: sanitizer.alphanumeric('Mohamed Adel').toLowerCase(),
    email: 'adel@gmail.com',
    password: 'qwertyzxc123',
  },

  user: undefined,
  membership: undefined,
  jwt: undefined,
}

const userSix: IUserData = {
  input: {
    name: sanitizer.alphanumeric('Ahmed Adel'),
    identifier: sanitizer.alphanumeric('Ahmed Adel').toLowerCase(),
    email: 'ahmed@gmail.com',
    password: 'qwertyzxc123',
  },

  user: undefined,
  membership: undefined,
  jwt: undefined,
}

const stationOne: IStationData = {
  input: {
    name: sanitizer.alphanumeric('alahly'),
    identifier: sanitizer.alphanumeric('alahly').toLowerCase(),
    description: 'al ahly supporters in gossipy',
    public: true,
  },

  station: undefined,
}

const stationTwo: IStationData = {
  input: {
    name: sanitizer.alphanumeric('elzamalek'),
    identifier: sanitizer.alphanumeric('elzamalek').toLowerCase(),
    description: 'el zamalek supporters in gossipy',
    public: false,
  },

  station: undefined,
}

const topicOne: ITopicData = {
  input: {
    title: 'Al Ahly, Club of the century',
    content: 'Title is descriptive :)',
  },
  topic: undefined,
  membership: undefined,
}

const topicTwo: ITopicData = {
  input: {
    title: 'El Zamalek Art in football',
    content: 'Title is descriptive :)',
  },
  topic: undefined,
  membership: undefined,
}

const topicThree: ITopicData = {
  input: {
    title: 'Al Ahly and CAF',
    content: 'CAF is giving Al Ahly 10mil for winning the CL',
  },
  topic: undefined,
  membership: undefined,
}

const topicFour: ITopicData = {
  input: {
    title: 'El Zamalek weak personality in CL',
    content: 'No real men on the pitch',
  },
  topic: undefined,
  membership: undefined,
}

const commentOne: ICommentData = {
  input: {
    content: 'True',
  },
  comment: undefined,
  membership: undefined,
}

const commentTwo: ICommentData = {
  input: {
    content: "It's not true",
  },
  comment: undefined,
  membership: undefined,
}

const voteOne: IVoteData = {
  input: {
    type: 'UPVOTE',
  },
  vote: undefined,
}

const voteTwo: IVoteData = {
  input: {
    type: 'UPVOTE',
  },
  vote: undefined,
}

const voteThree: IVoteData = {
  input: {
    type: 'UPVOTE',
  },
  vote: undefined,
}

const voteFour: IVoteData = {
  input: {
    type: 'UPVOTE',
  },
  vote: undefined,
}

const voteFive: IVoteData = {
  input: {
    type: 'UPVOTE',
  },
  vote: undefined,
}

const voteSix: IVoteData = {
  input: {
    type: 'DOWNVOTE',
  },
  vote: undefined,
}

const commentThree: ICommentData = {
  input: {
    content: 'Why not?!',
  },
  comment: undefined,
  membership: undefined,
}

const commentFour: ICommentData = {
  input: {
    content: "That's debatable",
  },
  comment: undefined,
  membership: undefined,
}

const seed = async () => {
  await prisma.deleteManyUsers()
  await prisma.deleteManyMemberships()
  await prisma.deleteManyStations()
  await prisma.deleteManyTopics()
  await prisma.deleteManyComments()
  await prisma.deleteManyVotes()

  // User One
  userOne.user = await prisma.createUser({
    ...userOne.input,
    password: bcrypt.hashSync(userOne.input.password),
  })
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  // User Two
  userTwo.user = await prisma.createUser({
    ...userTwo.input,
    password: bcrypt.hashSync(userTwo.input.password),
  })
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

  // User Three
  userThree.user = await prisma.createUser({
    ...userThree.input,
    password: bcrypt.hashSync(userThree.input.password),
  })
  userThree.jwt = jwt.sign(
    { userId: userThree.user.id },
    process.env.JWT_SECRET
  )

  // User Four
  userFour.user = await prisma.createUser({
    ...userFour.input,
    password: bcrypt.hashSync(userFour.input.password),
  })
  userFour.jwt = jwt.sign({ userId: userFour.user.id }, process.env.JWT_SECRET)

  // User Five
  userFive.user = await prisma.createUser({
    ...userFive.input,
    password: bcrypt.hashSync(userFive.input.password),
  })
  userFive.jwt = jwt.sign({ userId: userFive.user.id }, process.env.JWT_SECRET)

  // User Six
  userSix.user = await prisma.createUser({
    ...userSix.input,
    password: bcrypt.hashSync(userSix.input.password),
  })
  userSix.jwt = jwt.sign({ userId: userSix.user.id }, process.env.JWT_SECRET)

  // Station One
  stationOne.station = await prisma.createStation(stationOne.input)

  // Station Two
  stationTwo.station = await prisma.createStation(stationTwo.input)

  // User One Membership aka Station One Founder
  userOne.membership = await prisma.createMembership({
    user: {
      connect: {
        id: userOne.user.id,
      },
    },

    station: {
      connect: {
        id: stationOne.station.id,
      },
    },

    role: 'FOUNDER',
    state: 'ACTIVE',
  })

  // User Two Membership aka Station Two Founder
  userTwo.membership = await prisma.createMembership({
    user: {
      connect: {
        id: userTwo.user.id,
      },
    },

    station: {
      connect: {
        id: stationTwo.station.id,
      },
    },

    role: 'FOUNDER',
    state: 'ACTIVE',
  })

  // User Three Membership aka Station One Admin
  userThree.membership = await prisma.createMembership({
    user: {
      connect: {
        id: userThree.user.id,
      },
    },

    station: {
      connect: {
        id: stationOne.station.id,
      },
    },

    role: 'ADMIN',
    state: 'ACTIVE',
  })

  // User Four Membership aka Station Two Member
  userFour.membership = await prisma.createMembership({
    user: {
      connect: {
        id: userFour.user.id,
      },
    },

    station: {
      connect: {
        id: stationTwo.station.id,
      },
    },

    role: 'MEMBER',
    state: 'ACTIVE',
  })

  // User Five Membership aka Station One Detached Member
  userFive.membership = await prisma.createMembership({
    user: {
      connect: {
        id: userFive.user.id,
      },
    },

    station: {
      connect: {
        id: stationOne.station.id,
      },
    },

    role: 'MEMBER',
    state: 'DETACHED',
  })

  // User Six Membership aka Station Two Member
  userSix.membership = await prisma.createMembership({
    user: {
      connect: {
        id: userSix.user.id,
      },
    },

    station: {
      connect: {
        id: stationTwo.station.id,
      },
    },

    role: 'MEMBER',
    state: 'BANNED',
  })

  // Topic One With User One (A Founder)
  topicOne.topic = await prisma.createTopic({
    ...topicOne.input,
    station: {
      connect: {
        id: stationOne.station.id,
      },
    },
    user: {
      connect: {
        id: userOne.user.id,
      },
    },
    membership: {
      connect: {
        id: userOne.membership.id,
      },
    },
  })
  topicOne.membership = userOne.membership

  // Topic Two with User Four (A Member)
  topicTwo.topic = await prisma.createTopic({
    ...topicTwo.input,
    station: {
      connect: {
        id: stationTwo.station.id,
      },
    },
    user: {
      connect: {
        id: userFour.user.id,
      },
    },
    membership: {
      connect: {
        id: userFour.membership.id,
      },
    },
  })
  topicTwo.membership = userFour.membership

  // Topic Three with User Five (A Detached Member)
  topicThree.topic = await prisma.createTopic({
    ...topicThree.input,
    station: {
      connect: {
        id: stationOne.station.id,
      },
    },
    user: {
      connect: {
        id: userFive.user.id,
      },
    },
    membership: {
      connect: {
        id: userFive.membership.id,
      },
    },
  })
  topicThree.membership = topicThree.membership

  // Topic Four with User Six (A Banned Member)
  topicFour.topic = await prisma.createTopic({
    ...topicFour.input,
    station: {
      connect: {
        id: stationTwo.station.id,
      },
    },
    user: {
      connect: {
        id: userSix.user.id,
      },
    },
    membership: {
      connect: {
        id: userSix.membership.id,
      },
    },
  })
  topicFour.membership = userSix.membership

  // Votes
  voteOne.vote = await prisma.createVote({
    type: voteOne.input.type,
    membership: {
      connect: {
        id: userOne.membership.id,
      },
    },

    user: {
      connect: {
        id: userOne.user.id,
      },
    },
    station: {
      connect: {
        id: stationOne.station.id,
      },
    },

    topic: {
      connect: {
        id: topicOne.topic.id,
      },
    },
  })

  voteTwo.vote = await prisma.createVote({
    type: voteTwo.input.type,
    membership: {
      connect: {
        id: userFour.membership.id,
      },
    },

    user: {
      connect: {
        id: userFour.user.id,
      },
    },
    station: {
      connect: {
        id: stationTwo.station.id,
      },
    },

    topic: {
      connect: {
        id: topicTwo.topic.id,
      },
    },
  })

  voteThree.vote = await prisma.createVote({
    type: voteThree.input.type,
    membership: {
      connect: {
        id: userFive.membership.id,
      },
    },

    user: {
      connect: {
        id: userFive.user.id,
      },
    },
    station: {
      connect: {
        id: stationOne.station.id,
      },
    },

    topic: {
      connect: {
        id: topicThree.topic.id,
      },
    },
  })

  voteFour.vote = await prisma.createVote({
    type: voteFour.input.type,
    membership: {
      connect: {
        id: userSix.membership.id,
      },
    },

    user: {
      connect: {
        id: userSix.user.id,
      },
    },
    station: {
      connect: {
        id: stationTwo.station.id,
      },
    },

    topic: {
      connect: {
        id: topicFour.topic.id,
      },
    },
  })

  voteFour.vote = await prisma.createVote({
    type: voteFour.input.type,
    membership: {
      connect: {
        id: userSix.membership.id,
      },
    },

    user: {
      connect: {
        id: userSix.user.id,
      },
    },
    station: {
      connect: {
        id: stationTwo.station.id,
      },
    },

    topic: {
      connect: {
        id: topicFour.topic.id,
      },
    },
  })

  voteFive.vote = await prisma.createVote({
    type: voteFive.input.type,
    membership: {
      connect: {
        id: userTwo.membership.id,
      },
    },

    user: {
      connect: {
        id: userTwo.user.id,
      },
    },
    station: {
      connect: {
        id: stationTwo.station.id,
      },
    },

    topic: {
      connect: {
        id: topicFour.topic.id,
      },
    },
  })

  voteSix.vote = await prisma.createVote({
    type: voteSix.input.type,
    membership: {
      connect: {
        id: userThree.membership.id,
      },
    },

    user: {
      connect: {
        id: userThree.user.id,
      },
    },
    station: {
      connect: {
        id: stationTwo.station.id,
      },
    },

    topic: {
      connect: {
        id: topicFour.topic.id,
      },
    },
  })

  // Comment One on Topic Two by User Six
  commentOne.comment = await prisma.createComment({
    ...commentOne.input,
    station: {
      connect: {
        id: stationTwo.station.id,
      },
    },
    user: {
      connect: {
        id: userSix.user.id,
      },
    },
    topic: {
      connect: {
        id: topicTwo.topic.id,
      },
    },
    membership: {
      connect: {
        id: userSix.membership.id,
      },
    },
  })
  commentOne.membership = userSix.membership

  // Comment Two on Topic One by User Five
  commentTwo.comment = await prisma.createComment({
    ...commentTwo.input,
    station: {
      connect: {
        id: stationOne.station.id,
      },
    },
    user: {
      connect: {
        id: userFive.user.id,
      },
    },
    topic: {
      connect: {
        id: topicOne.topic.id,
      },
    },
    membership: {
      connect: {
        id: userFive.membership.id,
      },
    },
  })
  commentTwo.membership = userFive.membership

  // Comment Three on Topic Four by User Four
  commentThree.comment = await prisma.createComment({
    ...commentThree.input,
    station: {
      connect: {
        id: stationTwo.station.id,
      },
    },
    user: {
      connect: {
        id: userFour.user.id,
      },
    },
    topic: {
      connect: {
        id: topicFour.topic.id,
      },
    },
    membership: {
      connect: {
        id: userFour.membership.id,
      },
    },
  })
  commentThree.membership = userFour.membership

  // Comment Four on Topic Three by User One
  commentFour.comment = await prisma.createComment({
    ...commentFour.input,
    station: {
      connect: {
        id: stationOne.station.id,
      },
    },
    user: {
      connect: {
        id: userOne.user.id,
      },
    },
    topic: {
      connect: {
        id: topicThree.topic.id,
      },
    },
    membership: {
      connect: {
        id: userOne.membership.id,
      },
    },
  })
  commentFour.membership = userOne.membership
}

export {
  userOne,
  userTwo,
  userThree,
  userFour,
  userFive,
  userSix,
  stationOne,
  stationTwo,
  topicOne,
  topicTwo,
  topicThree,
  topicFour,
  commentOne,
  commentTwo,
  commentThree,
  commentFour,
}
export default seed
