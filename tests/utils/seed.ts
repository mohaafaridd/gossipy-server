import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../src/generated/prisma-client'
import sanitizer from '../../src/utils/sanitizer'

const userOne = {
  input: {
    name: sanitizer.alphanumeric('Mohammed Farid'),
    identifier: sanitizer.alphanumeric('Mohammed Farid').toLowerCase(),
    email: 'moha@gmail.com',
    password: bcrypt.hashSync('qwertyzxc123'),
  },

  user: undefined,
  jwt: undefined,
}

const userTwo = {
  input: {
    name: sanitizer.alphanumeric('Farid Khamis'),
    identifier: sanitizer.alphanumeric('Farid Khamis').toLowerCase(),
    email: 'farid@gmail.com',
    password: bcrypt.hashSync('qwertyzxc123'),
  },

  user: undefined,
  jwt: undefined,
}

const userThree = {
  input: {
    name: sanitizer.alphanumeric('Sherif Ashraf'),
    identifier: sanitizer.alphanumeric('Sherif Ashraf').toLowerCase(),
    email: 'sherif@gmail.com',
    password: bcrypt.hashSync('qwertyzxc123'),
  },

  user: undefined,
  jwt: undefined,
}

const userFour = {
  input: {
    name: sanitizer.alphanumeric('Mohammed Adel'),
    identifier: sanitizer.alphanumeric('Mohammed Adel').toLowerCase(),
    email: 'adel@gmail.com',
    password: bcrypt.hashSync('qwertyzxc123'),
  },

  user: undefined,
  jwt: undefined,
}

const seed = async () => {
  await prisma.deleteManyUsers()

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
}

export default seed
