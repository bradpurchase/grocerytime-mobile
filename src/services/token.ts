import AsyncStorage from '@react-native-community/async-storage'

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
