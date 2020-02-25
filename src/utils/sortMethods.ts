import * as moment from 'moment'
import { Vote, Topic, VoteType } from '../generated/prisma-client'
import { SortType } from '../constants'

export interface VotesQueryTopic {
  id: string
  type: VoteType
  topic: Topic
}

const extractVotes = (votes: Vote[]) => {
  const ups = votes.filter(vote => vote.type === 'UPVOTE').length
  const downs = votes.filter(vote => vote.type === 'DOWNVOTE').length
  return [ups, downs]
}

export const getHotScore = (votes: Vote[], topic: Topic) => {
  const { log10, max, abs, round } = Math
  const [ups, downs] = extractVotes(votes)
  const score = ups - downs
  const order = log10(max(abs(score), 1))
  const sign = score > 0 ? 1 : score < 0 ? -1 : 0
  const unix = moment(topic.createdAt).unix()

  return round(order + sign * unix)
}

export const getTopScore = (votes: Vote[], topic: Topic) => {
  const [ups, downs] = extractVotes(votes)
  const score = ups - downs
  return score
}

export const sortTopics = (sortType: SortType, votes: VotesQueryTopic[]) => {
  const reduced = votes.reduce((acc, current) => {
    if (current.topic.id in acc) {
      acc[current.topic.id].push({ id: current.id, type: current.type })
    } else {
      acc[current.topic.id] = [{ id: current.id, type: current.type }]
    }
    return acc
  }, {})

  const sorted = votes
    .sort((a, b) => {
      const aVotes: Vote[] = reduced[a.topic.id]
      const bVotes: Vote[] = reduced[b.topic.id]
      const aScore =
        sortType === 'HOT'
          ? getHotScore(aVotes, a.topic)
          : getTopScore(aVotes, a.topic)
      const bScore =
        sortType === 'HOT'
          ? getHotScore(bVotes, b.topic)
          : getTopScore(bVotes, b.topic)
      return aScore > bScore ? -1 : aScore < bScore ? 1 : 0
    })
    .map(vote => vote.topic)

  // Convert Objects to strings (To ease the removal)
  const unique = new Set(sorted.map(e => JSON.stringify(e)))

  // Converting back to Objects
  const result = Array.from(unique).map(e => JSON.parse(e))

  return result
}
