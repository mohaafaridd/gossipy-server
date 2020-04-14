import { User, Membership } from '@prisma/client'

interface IUserInput {
  name: string
  identifier: string
  email: string
  password: string
}

export interface IUser {
  input: IUserInput
  user?: User
  membership?: Membership
  jwt?: string
}
