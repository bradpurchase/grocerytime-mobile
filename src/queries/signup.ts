import { gql } from 'apollo-boost'

export const SIGNUP = gql`
  mutation SignupMutation($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      accessToken
      refreshToken
      expiresIn
    }
  }
`
