import * as moment from 'moment'
import { Vote, Topic } from '../generated/prisma-client'

const extractVotes = (votes: Vote[]) => {
  const ups = votes.filter(vote => vote.type === 'UPVOTE').length
  const downs = votes.filter(vote => vote.type === 'DOWNVOTE').length
  return [ups, downs]
}

export const sortHot = (votes: Vote[], topic: Topic) => {
  const { log10, max, abs, round } = Math
  const [ups, downs] = extractVotes(votes)
  const score = ups - downs
  const order = log10(max(abs(score), 1))
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0
  const unix = moment(topic.createdAt).unix()

  return round(order + sign * unix)
}

export const sortTop = (votes: Vote[], topic: Topic) => {
  const [ups, downs] = extractVotes(votes)
  const score = ups - downs
  return score
}

export const sortNew = (topic: Topic) => {
  return moment(topic.createdAt).unix()
}
