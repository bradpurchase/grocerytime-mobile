import { gql } from 'apollo-boost'

export const LOGIN_MUTATION = gql`
  mutation TokenMutation(
    $grantType: String!
    $email: String
    $password: String
  ) {
    token(grantType: $grantType, email: $email, password: $password) {
      userId
      accessToken
      refreshToken
      expiresIn
    }
  }
`
