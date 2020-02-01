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

const createStation = gql`
  mutation($data: CreateStationInput!) {
    createStation(data: $data) {
      id
      name
      identifier
    }
  }
`

export { signUp, signIn }
export { createStation }
