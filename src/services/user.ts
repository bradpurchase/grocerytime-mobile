import AsyncStorage from '@react-native-community/async-storage'
import { CurrentUser } from '../types'

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  const userId = await AsyncStorage.getItem('@userId')
  const token = await AsyncStorage.getItem('@accessToken')
  const currentUser = { id: userId, token }
  return currentUser
}

export const setCurrentUser = async (data: any): Promise<CurrentUser> => {
  await AsyncStorage.multiSet([
    ['@userId', data.userId],
    ['@accessToken', data.accessToken],
    ['@refreshToken', data.refreshToken],
  ])
  const currentUser: CurrentUser = {
    id: data.userId,
    token: data.accessToken,
  }
  return currentUser
}
