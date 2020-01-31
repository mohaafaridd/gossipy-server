import { gql } from 'apollo-boost'

const signUp = gql`
  mutation($data: CreateUserInput!) {
    signUp(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`
const signIn = gql`
  mutation($data: LoginUserInput!) {
    signIn(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

export { signUp, signIn }
