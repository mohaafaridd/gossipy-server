import { VoteType, Vote } from '@prisma/client'

interface IVoteInput {
  type: VoteType
}

export interface IVote {
  input: IVoteInput
  vote?: Vote
}
