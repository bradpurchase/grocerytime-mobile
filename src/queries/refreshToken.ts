export const REFRESH_TOKEN_MUTATION = `
  mutation RefreshTokenMutation($grantType: String!, $refreshToken: String) {
    token(grantType: $grantType, refreshToken: $refreshToken) {
      accessToken
      refreshToken
      expiresIn
    }
  }
`
