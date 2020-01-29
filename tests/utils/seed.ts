import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
  prisma,
  User,
  Station,
  Membership,
  Topic,
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

const userOne: IUserData = {
  input: {
    name: sanitizer.alphanumeric('Mohammed Farid'),
    identifier: sanitizer.alphanumeric('Mohammed Farid').toLowerCase(),
    email: 'moha@gmail.com',
    password: bcrypt.hashSync('qwertyzxc123'),
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
    password: bcrypt.hashSync('qwertyzxc123'),
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
    password: bcrypt.hashSync('qwertyzxc123'),
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
    password: bcrypt.hashSync('qwertyzxc123'),
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
    password: bcrypt.hashSync('qwertyzxc123'),
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
    password: bcrypt.hashSync('qwertyzxc123'),
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
    public: true,
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

const seed = async () => {
  await prisma.deleteManyUsers()
  await prisma.deleteManyMemberships()
  await prisma.deleteManyStations()
  await prisma.deleteManyTopics()

  // User One
  userOne.user = await prisma.createUser(userOne.input)
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  // User Two
  userTwo.user = await prisma.createUser(userTwo.input)
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

  // User Three
  userThree.user = await prisma.createUser(userThree.input)
  userThree.jwt = jwt.sign(
    { userId: userThree.user.id },
    process.env.JWT_SECRET
  )

  // User Four
  userFour.user = await prisma.createUser(userFour.input)
  userFour.jwt = jwt.sign({ userId: userFour.user.id }, process.env.JWT_SECRET)

  // User Five
  userFive.user = await prisma.createUser(userFive.input)
  userFive.jwt = jwt.sign({ userId: userFive.user.id }, process.env.JWT_SECRET)

  // User Six
  userSix.user = await prisma.createUser(userSix.input)
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
    membership: {
      connect: {
        id: userOne.membership.id,
      },
    },
  })

  // Topic Two with User Four (A Member)
  topicTwo.topic = await prisma.createTopic({
    ...topicTwo.input,
    membership: {
      connect: {
        id: userFour.membership.id,
      },
    },
  })

  // Topic Two with User Four (A Detached Member)
  topicThree.topic = await prisma.createTopic({
    ...topicThree.input,
    membership: {
      connect: {
        id: userFive.membership.id,
      },
    },
  })

  // Topic Two with User Four (A Banned Member)
  topicFour.topic = await prisma.createTopic({
    ...topicFour.input,
    membership: {
      connect: {
        id: userSix.membership.id,
      },
    },
  })
}

export default seed
