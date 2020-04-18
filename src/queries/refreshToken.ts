import {gql} from 'apollo-boost'

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshTokenMutation($grantType: String!, $refreshToken: String) {
    token(grantType: $grantType, refreshToken: $refreshToken) {
      accessToken
      refreshToken
      expiresIn
    }
  }
`
