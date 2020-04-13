import { PrismaClient } from '@prisma/client'
import creators from './creators'

import seeds from './seeds'

const prisma = new PrismaClient()

export default async () => {
  await prisma.comment.deleteMany({})
  await prisma.vote.deleteMany({})
  await prisma.topic.deleteMany({})
  await prisma.membership.deleteMany({})
  await prisma.station.deleteMany({})
  await prisma.user.deleteMany({})

  // Register Users
  const users = await Promise.all([
    creators.createUser(seeds.users[0], prisma),
    creators.createUser(seeds.users[1], prisma),
    creators.createUser(seeds.users[2], prisma),
    creators.createUser(seeds.users[3], prisma),
    creators.createUser(seeds.users[4], prisma),
    creators.createUser(seeds.users[5], prisma),
    creators.createUser(seeds.users[6], prisma),
    creators.createUser(seeds.users[7], prisma),
    creators.createUser(seeds.users[8], prisma),
    creators.createUser(seeds.users[9], prisma),
    creators.createUser(seeds.users[10], prisma),
    creators.createUser(seeds.users[11], prisma),
  ])

  const stations = await Promise.all([
    creators.createStation(seeds.stations[0], prisma),
    creators.createStation(seeds.stations[1], prisma),
  ])

  const memberships = await Promise.all([
    // Group 1
    creators.createMembership(
      users[0],
      stations[0],
      'FOUNDER',
      'ACTIVE',
      prisma
    ),
    creators.createMembership(users[1], stations[0], 'ADMIN', 'ACTIVE', prisma),
    creators.createMembership(
      users[2],
      stations[0],
      'MEMBER',
      'ACTIVE',
      prisma
    ),
    creators.createMembership(
      users[3],
      stations[0],
      'MEMBER',
      'PENDING',
      prisma
    ),
    creators.createMembership(
      users[4],
      stations[0],
      'MEMBER',
      'DETACHED',
      prisma
    ),
    creators.createMembership(
      users[5],
      stations[0],
      'MEMBER',
      'BANNED',
      prisma
    ),
    // Group 2
    creators.createMembership(
      users[6],
      stations[1],
      'FOUNDER',
      'ACTIVE',
      prisma
    ),
    creators.createMembership(users[7], stations[1], 'ADMIN', 'ACTIVE', prisma),
    creators.createMembership(
      users[8],
      stations[1],
      'MEMBER',
      'ACTIVE',
      prisma
    ),
    creators.createMembership(
      users[9],
      stations[1],
      'MEMBER',
      'PENDING',
      prisma
    ),
    creators.createMembership(
      users[10],
      stations[1],
      'MEMBER',
      'DETACHED',
      prisma
    ),
    creators.createMembership(
      users[11],
      stations[1],
      'MEMBER',
      'BANNED',
      prisma
    ),
  ])

  const topics = await Promise.all([
    // Group 1
    creators.createTopic(seeds.topics[0], stations[0], users[0], prisma),
    creators.createTopic(seeds.topics[1], stations[0], users[1], prisma),
    creators.createTopic(seeds.topics[2], stations[0], users[2], prisma),
    // User 3 is pending
    creators.createTopic(seeds.topics[3], stations[0], users[4], prisma),
    creators.createTopic(seeds.topics[4], stations[0], users[5], prisma),
    // Group 2
    creators.createTopic(seeds.topics[5], stations[1], users[6], prisma),
    creators.createTopic(seeds.topics[6], stations[1], users[7], prisma),
    creators.createTopic(seeds.topics[7], stations[1], users[8], prisma),
    // User 3 is pending
    creators.createTopic(seeds.topics[8], stations[1], users[10], prisma),
    creators.createTopic(seeds.topics[9], stations[1], users[11], prisma),
  ])

  const comments = await Promise.all([
    // Group 1
    creators.createComment(
      seeds.comments[0],
      topics[0],
      stations[0],
      users[1],
      prisma
    ),
    creators.createComment(
      seeds.comments[1],
      topics[1],
      stations[0],
      users[2],
      prisma
    ),
    creators.createComment(
      seeds.comments[0],
      topics[2],
      stations[0],
      users[4],
      prisma
    ),
    creators.createComment(
      seeds.comments[1],
      topics[3],
      stations[0],
      users[5],
      prisma
    ),
    creators.createComment(
      seeds.comments[0],
      topics[4],
      stations[0],
      users[0],
      prisma
    ),
    // Group 2
    creators.createComment(
      seeds.comments[0],
      topics[5],
      stations[1],
      users[7],
      prisma
    ),
    creators.createComment(
      seeds.comments[1],
      topics[6],
      stations[1],
      users[8],
      prisma
    ),
    creators.createComment(
      seeds.comments[0],
      topics[7],
      stations[1],
      users[10],
      prisma
    ),
    creators.createComment(
      seeds.comments[1],
      topics[8],
      stations[1],
      users[11],
      prisma
    ),
    creators.createComment(
      seeds.comments[0],
      topics[9],
      stations[1],
      users[6],
      prisma
    ),
  ])

  const votes = await Promise.all([
    // Group 1
    creators.createVote(
      seeds.votes[0],
      topics[0],
      stations[0],
      users[0],
      prisma
    ),
    creators.createVote(
      seeds.votes[0],
      topics[1],
      stations[0],
      users[1],
      prisma
    ),
    creators.createVote(
      seeds.votes[0],
      topics[2],
      stations[0],
      users[2],
      prisma
    ),
    creators.createVote(
      seeds.votes[0],
      topics[3],
      stations[0],
      users[4],
      prisma
    ),
    creators.createVote(
      seeds.votes[0],
      topics[4],
      stations[0],
      users[5],
      prisma
    ),

    // Group 1 - Hot Topic [1]
    creators.createVote(
      seeds.votes[0],
      topics[1],
      stations[0],
      users[0],
      prisma
    ),
    creators.createVote(
      seeds.votes[0],
      topics[1],
      stations[0],
      users[2],
      prisma
    ),
    // Group 1 - Shallow Topic [3]
    creators.createVote(
      seeds.votes[1],
      topics[3],
      stations[0],
      users[1],
      prisma
    ),
    creators.createVote(
      seeds.votes[1],
      topics[3],
      stations[0],
      users[5],
      prisma
    ),

    // Group 2
    creators.createVote(
      seeds.votes[0],
      topics[5],
      stations[1],
      users[6],
      prisma
    ),
    creators.createVote(
      seeds.votes[0],
      topics[6],
      stations[1],
      users[7],
      prisma
    ),
    creators.createVote(
      seeds.votes[0],
      topics[7],
      stations[1],
      users[8],
      prisma
    ),
    creators.createVote(
      seeds.votes[0],
      topics[8],
      stations[1],
      users[10],
      prisma
    ),
    creators.createVote(
      seeds.votes[0],
      topics[9],
      stations[1],
      users[11],
      prisma
    ),

    // Group 2 - Hot Topic [6] - Top Topic
    creators.createVote(
      seeds.votes[0],
      topics[6],
      stations[1],
      users[6],
      prisma
    ),
    creators.createVote(
      seeds.votes[0],
      topics[6],
      stations[1],
      users[8],
      prisma
    ),
    creators.createVote(
      seeds.votes[0],
      topics[6],
      stations[1],
      users[10],
      prisma
    ),
    // Group 2 - Shallow Topic [8]
    creators.createVote(
      seeds.votes[1],
      topics[8],
      stations[1],
      users[7],
      prisma
    ),
    creators.createVote(
      seeds.votes[1],
      topics[8],
      stations[1],
      users[11],
      prisma
    ),
  ])
}
