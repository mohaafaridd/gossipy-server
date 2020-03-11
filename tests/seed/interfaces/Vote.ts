import { VoteType, Vote } from '../../../src/generated/prisma-client'

interface IVoteInput {
  type: VoteType
}

export interface IVote {
  input: IVoteInput
  vote?: Vote
}
