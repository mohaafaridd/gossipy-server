import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma, User, Station } from '../../src/generated/prisma-client'
import sanitizer from '../../src/utils/sanitizer'

interface userInput {
  name: string
  identifier: string
  email: string
  password: string
}

interface stationInput {
  name: string
  identifier: string
  description: string
  public: boolean
}

const userOne: { input: userInput; user: User; jwt: String } = {
  input: {
    name: sanitizer.alphanumeric('Mohammed Farid'),
    identifier: sanitizer.alphanumeric('Mohammed Farid').toLowerCase(),
    email: 'moha@gmail.com',
    password: bcrypt.hashSync('qwertyzxc123'),
  },

  user: undefined,
  jwt: undefined,
}

const userTwo: { input: userInput; user: User; jwt: String } = {
  input: {
    name: sanitizer.alphanumeric('Farid Khamis'),
    identifier: sanitizer.alphanumeric('Farid Khamis').toLowerCase(),
    email: 'farid@gmail.com',
    password: bcrypt.hashSync('qwertyzxc123'),
  },

  user: undefined,
  jwt: undefined,
}

const userThree: { input: userInput; user: User; jwt: String } = {
  input: {
    name: sanitizer.alphanumeric('Sherif Ashraf'),
    identifier: sanitizer.alphanumeric('Sherif Ashraf').toLowerCase(),
    email: 'sherif@gmail.com',
    password: bcrypt.hashSync('qwertyzxc123'),
  },

  user: undefined,
  jwt: undefined,
}

const userFour: { input: userInput; user: User; jwt: String } = {
  input: {
    name: sanitizer.alphanumeric('Ashraf Farouq'),
    identifier: sanitizer.alphanumeric('Ashraf Farouq').toLowerCase(),
    email: 'farouq@gmail.com',
    password: bcrypt.hashSync('qwertyzxc123'),
  },

  user: undefined,
  jwt: undefined,
}

const stationOne: { input: stationInput; station: Station } = {
  input: {
    name: sanitizer.alphanumeric('alahly'),
    identifier: sanitizer.alphanumeric('alahly').toLowerCase(),
    description: 'al ahly supporters in gossipy',
    public: true,
  },

  station: undefined,
}

const stationTwo: { input: stationInput; station: Station } = {
  input: {
    name: sanitizer.alphanumeric('elzamalek'),
    identifier: sanitizer.alphanumeric('elzamalek').toLowerCase(),
    description: 'el zamalek supporters in gossipy',
    public: true,
  },

  station: undefined,
}

const seed = async () => {
  await prisma.deleteManyUsers()
  await prisma.deleteManyMemberships()
  await prisma.deleteManyStations()

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

  // Station One
  stationOne.station = await prisma.createStation({
    ...stationOne.input,
    members: {
      create: {
        user: {
          connect: {
            id: userOne.user.id,
          },
        },
        role: 'FOUNDER',
        state: 'ACTIVE',
      },
    },
  })

  // Station Two
  stationTwo.station = await prisma.createStation({
    ...stationTwo.input,
    members: {
      create: {
        user: {
          connect: {
            id: userTwo.user.id,
          },
        },
        role: 'FOUNDER',
        state: 'ACTIVE',
      },
    },
  })
}

export default seed
