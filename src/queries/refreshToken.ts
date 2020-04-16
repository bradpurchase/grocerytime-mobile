import { gql } from 'apollo-boost'

export const REFRESH_TOKEN_MUTATION = gql`
  mutation TokenMutation($grantType: String!, $refreshToken: String) {
    token(grantType: $grantType, refreshToken: $refreshToken) {
      accessToken
      refreshToken
      expiresIn
    }
  }
`
