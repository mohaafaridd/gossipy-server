import { SortType } from '@constants'
import { getHotScore, getTopScore } from '@utils'
import { Topic, Vote } from '@prisma/client'

type TopicWithVotes = Topic & { votes: Vote[] }

const sortTopics = (topics: TopicWithVotes[], sortType: SortType) =>
  topics.sort((a, b) => {
    const scores =
      sortType === 'HOT'
        ? [getHotScore(a), getHotScore(b)]
        : sortType === 'TOP'
        ? [getTopScore(a), getTopScore(b)]
        : [a.createdAt.getTime(), b.createdAt.getTime()]

    return scores[0] > scores[1] ? -1 : scores[1] > scores[0] ? 1 : 0
  })

export default sortTopics
