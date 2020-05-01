import React, { useState, useEffect } from 'react'
import { StatusBar, Button, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { enableScreens } from 'react-native-screens'
enableScreens()

import LoginScreen from '../screens/Auth/LoginScreen'
import SignupScreen from '../screens/Auth/SignupScreen'
import ListsScreen from '../screens/ListsScreen/ListsScreen'
import NewListScreen from '../screens/NewListScreen/NewListScreen'
import ListViewScreen from '../screens/ListViewScreen/ListViewScreen'

import AuthContext from '../context/AuthContext'
import colors from '../styles/colors'
import fonts from '../styles/fonts'

import { RootStackParamList } from './types'

import { setAccessToken, clearTokens, getAccessToken } from '../services/token'

const MainStack = createStackNavigator<RootStackParamList>()
const RootStack = createStackNavigator<RootStackParamList>()

const Router = () => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [token, setToken] = useState<string>('')

  const checkAuthentication = async () => {
    try {
      const token = await getAccessToken()
      if (token) {
        setToken(token)
      }
    } catch (e) {
      //TODO better error handling
      console.error(e)
    }

    setLoaded(true)
  }

  const login = async (data: any) => {
    try {
      const accessToken = await setAccessToken(data)
      setToken(accessToken)
    } catch (e) {
      //TODO better error handling
      console.error(e)
    }
  }

  const logout = async () => {
    try {
      await clearTokens()
      setToken('')
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    checkAuthentication()
  }, [])

  const MainStackScreen = () => (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.RED },
        headerTintColor: colors.WHITE,
        headerTitleStyle: {
          fontFamily: fonts.REGULAR,
        },
      }}>
      {token ? (
        <>
          <RootStack.Screen name="Lists" component={ListsScreen} />
          <RootStack.Screen
            name="ListView"
            component={ListViewScreen}
            options={({ route }) => ({ title: route.params.list.name })}
          />
        </>
      ) : (
        <>
          <RootStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </MainStack.Navigator>
  )

  if (!loaded) {
    return <ActivityIndicator size="large" />
  }

  // We use two different stack navigators here because some of them need to be
  // opened in modal mode, like SettingsScreen and NewListScreen
  //
  //TODO would love to find a cleaner way to do this.. this seems bizzare
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      <NavigationContainer>
        <RootStack.Navigator
          mode="modal"
          screenOptions={{
            headerStyle: { backgroundColor: colors.RED },
            headerTintColor: colors.WHITE,
            headerTitleStyle: {
              fontFamily: fonts.REGULAR,
            },
          }}>
          <RootStack.Screen
            name="Main"
            component={MainStackScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="NewList"
            component={NewListScreen}
            options={{ title: 'New List' }}
          />
        </RootStack.Navigator>

        <StatusBar barStyle="light-content" />
      </NavigationContainer>
    </AuthContext.Provider>
  )
}
export default Router
