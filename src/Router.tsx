import React, { useState, useEffect } from 'react'
import { StatusBar, Button, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-community/async-storage'

import ListsScreen from './screens/ListsScreen'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'

import AuthContext from './context/AuthContext'
import colors from './styles/colors'
import fonts from './styles/fonts'

const Stack = createStackNavigator()

const Router = () => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [token, setToken] = useState<string>('')

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('@accessToken')
      if (token) setToken(token)
    } catch (e) {
      //TODO better error handling
      console.error(e)
    }
    setLoaded(true)
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

  if (!loaded) return <ActivityIndicator size="large" />
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.BLACK },
            headerTintColor: colors.WHITE,
            headerTitleStyle: {
              fontFamily: fonts.REGULAR,
            },
          }}>
          {token ? (
            <>
              <Stack.Screen
                name="Lists"
                component={ListsScreen}
                options={{
                  headerRight: () => (
                    <Button
                      title="Log out"
                      color={colors.WHITE}
                      onPress={() => logout()}
                    />
                  ),
                }}
              />
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

        <StatusBar barStyle="light-content" />
      </NavigationContainer>
    </AuthContext.Provider>
  )
}
export default Router
