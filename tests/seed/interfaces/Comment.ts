import { Comment } from '../../../src/generated/prisma-client'

interface ICommentInput {
  content: string
}

export interface IComment {
  input: ICommentInput
  comment?: Comment
}
