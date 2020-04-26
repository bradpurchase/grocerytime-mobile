import AsyncStorage from '@react-native-community/async-storage'
import Config from 'react-native-config'

import { REFRESH_TOKEN_MUTATION } from '../queries/refreshToken'

export const getAccessToken = async (): Promise<string | null> => {
  const token = await AsyncStorage.getItem('@accessToken')
  return token
}

export const setAccessToken = async (data: any): Promise<string> => {
  await AsyncStorage.multiSet([
    ['@accessToken', data.accessToken],
    ['@refreshToken', data.refreshToken],
    ['@expiresIn', data.expiresIn],
  ])
  return data.accessToken
}

export const getTokenExpiry = async (): Promise<string | null> => {
  const expiresIn = await AsyncStorage.getItem('@expiresIn')
  return expiresIn
}

export const getRefreshToken = async (): Promise<string | null> => {
  const token = await AsyncStorage.getItem('@refreshToken')
  return token
}

export const retrieveNewAccessToken = async (): Promise<string | null> => {
  const refreshToken = await getRefreshToken()
  const mutationJSON = JSON.stringify({
    query: REFRESH_TOKEN_MUTATION,
    variables: {
      grantType: 'refreshToken',
      refreshToken,
    },
    operationName: 'RefreshTokenMutation',
  })
  await fetch(Config.API_BASE_URL, {
    headers: {
      'content-type': 'application/json',
      authorization: `${Config.API_KEY}:${Config.API_SECRET}`,
    },
    method: 'POST',
    body: mutationJSON,
  })
    .then((res) => res.json())
    .then((data) => {
      const tokens = data.data.token
      setAccessToken(tokens)
      return tokens.accessToken
    })
    .catch((err) => {
      clearTokens()
      console.error(err)
    })
  return null
}

export const clearTokens = async (): Promise<any> => {
  try {
    await AsyncStorage.clear()
  } catch (e) {
    console.error(e)
  }
}
