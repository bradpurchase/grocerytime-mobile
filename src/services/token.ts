import AsyncStorage from '@react-native-community/async-storage'
import Config from 'react-native-config'

import { CurrentUser } from '../types'
import { setCurrentUser } from './user'
import { REFRESH_TOKEN_MUTATION } from '../queries/refreshToken'

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
  let token = null
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
      console.log(data)
      const tokens = data.data.token
      if (!tokens) {
        clearTokens()
        return null
      }
      const currentUser: CurrentUser = {
        id: tokens.userId,
        token: tokens.accessToken,
      }
      setCurrentUser(currentUser)
      token = currentUser.token
    })
    .catch((err) => {
      clearTokens()
      console.error(err)
    })
  return token
}

export const clearTokens = async (): Promise<any> => {
  const asyncStorageKeys = await AsyncStorage.getAllKeys()
  if (asyncStorageKeys.length > 0) {
    AsyncStorage.clear()
  }
}
