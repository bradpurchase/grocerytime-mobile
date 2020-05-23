import { gql } from 'apollo-boost'

export const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      userId
      accessToken
      refreshToken
      expiresIn
    }
  }
`
