import { Topic } from '@prisma/client'

interface ITopicInput {
  title: string
  content: string
}

export interface ITopic {
  input: ITopicInput
  topic?: Topic
}
