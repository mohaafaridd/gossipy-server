import { Comment } from '@prisma/client'

interface ICommentInput {
  content: string
}

export interface IComment {
  input: ICommentInput
  comment?: Comment
}
