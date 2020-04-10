import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-community/async-storage'

import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'

import AuthContext from './context/AuthContext'

const Stack = createStackNavigator()

const Router = () => {
  const [token, setToken] = useState<string>('')

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('@accessToken')
      if (token) setToken(token)
    } catch (e) {
      //TODO better error handling
      console.error(e)
    }
  }

  const login = async (data: any) => {
    try {
      await AsyncStorage.multiSet([
        ['@accessToken', data.accessToken],
        ['@refreshToken', data.refreshToken],
        ['@expiresIn', data.expiresIn],
      ])
      setToken(data.accessToken)
    } catch (e) {
      //TODO better error handling
      console.error(e)
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.clear()
      setToken('')
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    checkAuthentication()
  }, [])

  useEffect(() => {
    checkAuthentication()
  }, [token])

  return (
    <AuthContext.Provider value={{ token, login, logout }}> 
      <NavigationContainer>
        <Stack.Navigator>
          {token ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  )
}
export default Router
