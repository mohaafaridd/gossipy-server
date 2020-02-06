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

const updateStation = gql`
  mutation($id: ID!, $data: UpdateStationInput!) {
    updateStation(id: $id, data: $data) {
      id
      description
      public
    }
  }
`

const createMembership = gql`
  mutation($stationId: ID!) {
    createMembership(stationId: $stationId) {
      id
    }
  }
`

export { signUp, signIn }
export { createStation, updateStation, createMembership }
