import { gql } from 'apollo-boost'

export const LOGIN = gql`
  mutation TokenMutation(
    $grantType: String!
    $email: String
    $password: String
  ) {
    token(grantType: $grantType, email: $email, password: $password) {
      accessToken
      refreshToken
      expiresIn
    }
  }
`
