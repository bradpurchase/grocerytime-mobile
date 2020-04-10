import React from 'react'

type AuthContextProps = {
  token: string
  login: (data: any) => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextProps>({
  token: '',
  login: () => {},
  logout: () => {},
})
export default AuthContext
