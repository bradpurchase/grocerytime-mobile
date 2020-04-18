import AsyncStorage from '@react-native-community/async-storage'

import {
  getAccessToken,
  getTokenExpiry,
  getRefreshToken,
} from '../services/token'

const isTokenExpired = async (): Promise<boolean> => {
  const token = await getAccessToken()
  if (!token) return true
  const expiresIn: string | null = await getTokenExpiry()
  if (expiresIn) {
    const expiryDate = new Date(expiresIn)
    const currDate = new Date()
    if (currDate >= expiryDate) {
      return true
    }
  }
  return false
}

export default async (uri: any, options: any) => {
  const initRequest = await fetch(uri, options)
  if (isTokenExpired()) {
    const refreshToken = await getRefreshToken()
    const token = await getAccessToken()
  }
}
