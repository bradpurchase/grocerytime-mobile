import React from 'react'
import { CurrentUser } from '../types'

export type AuthContextProps = {
  user: CurrentUser | null
  login: (data: any) => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextProps>({
  user: null,
  login: () => {},
  logout: () => {},
})
export default AuthContext
