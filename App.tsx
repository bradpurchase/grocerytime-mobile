/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler'
import React from 'react'

import AuthContext from './src/context/AuthContext'

import Router from './src/Router'

const App = () => (
  <AuthContext.Provider value={{ token: null }}>
    <Router />
  </AuthContext.Provider>
)

export default App
