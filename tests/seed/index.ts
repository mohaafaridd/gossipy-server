import { prisma } from '../../src/generated/prisma-client'

import creators from './creators'
import seeds from './seeds'
import seed from '../utils/seed'

const reset = [
  prisma.deleteManyUsers(),
  prisma.deleteManyMemberships(),
  prisma.deleteManyStations(),
  prisma.deleteManyTopics(),
  prisma.deleteManyComments(),
  prisma.deleteManyVotes(),
]

export default async () => {
  await Promise.all(reset)

  // Register Users
  const users = await Promise.all([
    creators.createUser(seeds.users[0]),
    creators.createUser(seeds.users[1]),
    creators.createUser(seeds.users[2]),
    creators.createUser(seeds.users[3]),
    creators.createUser(seeds.users[4]),
    creators.createUser(seeds.users[5]),
    creators.createUser(seeds.users[6]),
    creators.createUser(seeds.users[7]),
    creators.createUser(seeds.users[8]),
    creators.createUser(seeds.users[9]),
    creators.createUser(seeds.users[10]),
    creators.createUser(seeds.users[11]),
  ])

  const stations = await Promise.all([
    creators.createStation(seeds.stations[0]),
    creators.createStation(seeds.stations[1]),
  ])

  const memberships = await Promise.all([
    // Group 1
    creators.createMembership(users[0], stations[0], 'FOUNDER', 'ACTIVE'),
    creators.createMembership(users[1], stations[0], 'ADMIN', 'ACTIVE'),
    creators.createMembership(users[2], stations[0], 'MEMBER', 'ACTIVE'),
    creators.createMembership(users[3], stations[0], 'MEMBER', 'PENDING'),
    creators.createMembership(users[4], stations[0], 'MEMBER', 'DETACHED'),
    creators.createMembership(users[5], stations[0], 'MEMBER', 'BANNED'),
    // Group 2
    creators.createMembership(users[6], stations[1], 'FOUNDER', 'ACTIVE'),
    creators.createMembership(users[7], stations[1], 'ADMIN', 'ACTIVE'),
    creators.createMembership(users[8], stations[1], 'MEMBER', 'ACTIVE'),
    creators.createMembership(users[9], stations[1], 'MEMBER', 'PENDING'),
    creators.createMembership(users[10], stations[1], 'MEMBER', 'DETACHED'),
    creators.createMembership(users[11], stations[1], 'MEMBER', 'BANNED'),
  ])

  const topics = await Promise.all([
    // Group 1
    creators.createTopic(seeds.topics[0], stations[0], users[0]),
    creators.createTopic(seeds.topics[1], stations[0], users[1]),
    creators.createTopic(seeds.topics[2], stations[0], users[2]),
    // User 3 is pending
    creators.createTopic(seeds.topics[3], stations[0], users[4]),
    creators.createTopic(seeds.topics[4], stations[0], users[5]),
    // Group 2
    creators.createTopic(seeds.topics[5], stations[1], users[6]),
    creators.createTopic(seeds.topics[6], stations[1], users[7]),
    creators.createTopic(seeds.topics[7], stations[1], users[8]),
    // User 3 is pending
    creators.createTopic(seeds.topics[8], stations[1], users[10]),
    creators.createTopic(seeds.topics[9], stations[1], users[11]),
  ])

  const comments = await Promise.all([
    // Group 1
    creators.createComment(seeds.comments[0], topics[0], stations[0], users[1]),
    creators.createComment(seeds.comments[1], topics[1], stations[0], users[2]),
    creators.createComment(seeds.comments[0], topics[2], stations[0], users[4]),
    creators.createComment(seeds.comments[1], topics[3], stations[0], users[5]),
    creators.createComment(seeds.comments[0], topics[4], stations[0], users[0]),
    // Group 2
    creators.createComment(seeds.comments[0], topics[5], stations[1], users[7]),
    creators.createComment(seeds.comments[1], topics[6], stations[1], users[8]),
    creators.createComment(
      seeds.comments[0],
      topics[7],
      stations[1],
      users[10]
    ),
    creators.createComment(
      seeds.comments[1],
      topics[8],
      stations[1],
      users[11]
    ),
    creators.createComment(seeds.comments[0], topics[9], stations[1], users[6]),
  ])

  const votes = await Promise.all([
    // Group 1
    creators.createVote(seeds.votes[0], topics[0], stations[0], users[0]),
    creators.createVote(seeds.votes[0], topics[1], stations[0], users[1]),
    creators.createVote(seeds.votes[0], topics[2], stations[0], users[2]),
    creators.createVote(seeds.votes[0], topics[3], stations[0], users[4]),
    creators.createVote(seeds.votes[0], topics[4], stations[0], users[5]),

    // Group 1 - Hot Topic [1]
    creators.createVote(seeds.votes[0], topics[1], stations[0], users[0]),
    creators.createVote(seeds.votes[0], topics[1], stations[0], users[2]),
    // Group 1 - Shallow Topic [3]
    creators.createVote(seeds.votes[1], topics[3], stations[0], users[1]),
    creators.createVote(seeds.votes[1], topics[3], stations[0], users[5]),

    // Group 2
    creators.createVote(seeds.votes[0], topics[5], stations[1], users[6]),
    creators.createVote(seeds.votes[0], topics[6], stations[1], users[7]),
    creators.createVote(seeds.votes[0], topics[7], stations[1], users[8]),
    creators.createVote(seeds.votes[0], topics[8], stations[1], users[10]),
    creators.createVote(seeds.votes[0], topics[9], stations[1], users[11]),

    // Group 2 - Hot Topic [6] - Top Topic
    creators.createVote(seeds.votes[0], topics[6], stations[1], users[6]),
    creators.createVote(seeds.votes[0], topics[6], stations[1], users[8]),
    creators.createVote(seeds.votes[0], topics[6], stations[1], users[10]),
    // Group 2 - Shallow Topic [8]
    creators.createVote(seeds.votes[1], topics[8], stations[1], users[7]),
    creators.createVote(seeds.votes[1], topics[8], stations[1], users[11]),
  ])
}
