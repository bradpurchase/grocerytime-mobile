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
import React, { useState, useEffect } from 'react'

import {
  StatusBar,
  ActivityIndicator,
  useColorScheme,
  Linking,
  Platform,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { enableScreens } from 'react-native-screens'
enableScreens()

import { AppearanceProvider } from 'react-native-appearance'
import { LightTheme, DarkTheme } from './src/styles/themes'

import LoginScreen from './src/screens/Auth/LoginScreen'
import SignupScreen from './src/screens/Auth/SignupScreen'
import ListsScreen from './src/screens/ListsScreen/ListsScreen'
import NewListScreen from './src/screens/NewListScreen/NewListScreen'
import ShareNewListScreen from './src/screens/NewListScreen/ShareNewListScreen'
import RenameListScreen from './src/screens/RenameListScreen/RenameListScreen'
import ListViewScreen from './src/screens/ListViewScreen/ListViewScreen'
import SettingsScreen from './src/screens/SettingsScreen/SettingsScreen'

import AuthContext from './src/context/AuthContext'
import colors from './src/styles/colors'
import { RootStackParamList } from './src/types/Navigation'
import { CurrentUser } from './src/types'

import { clearTokens } from './src/services/token'
import { getCurrentUser, setCurrentUser } from './src/services/user'
import { setDefaultSettings } from './src/services/settings'

const RootStack = createStackNavigator<RootStackParamList>()

const PERSISTENCE_KEY = 'NAVIGATION_STATE'

const App = () => {
  // Subscribe to system color scheme changes (light/dark)
  const scheme = useColorScheme()

  const [loaded, setLoaded] = useState<boolean>(false)
  const [navStateReady, setNavStateReady] = useState<boolean>(false)
  const [initialState, setInitialState] = useState()
  const [user, setUser] = useState<CurrentUser>({
    id: '',
    token: '',
  })
  const [firstRunOccurred, setFirstRunOccurred] = useState<boolean>(true)

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL()
        // Only restore state if there's no deep link and we're not on web
        if (Platform.OS !== 'web' && initialUrl == null) {
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY)
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined
          if (state !== undefined) setInitialState(state)
        }
      } finally {
        setNavStateReady(true)
      }
    }
    if (!navStateReady) restoreState()
  }, [navStateReady])

  const checkAuthentication = async () => {
    try {
      const currentUser: CurrentUser | null = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
      }
    } catch (e) {
      //TODO better error handling
      console.error(e)
    }
    setLoaded(true)
  }

  const login = async (data: any) => {
    try {
      const currentUser = await setCurrentUser(data)
      setUser(currentUser)
    } catch (e) {
      //TODO better error handling
      console.error(e)
    }
  }

  const logout = async () => {
    try {
      await clearTokens()
      setUser({ id: '', token: '' })
    } catch (e) {
      console.error(e)
    }
  }

  // After a user logs in, check to see if the first run experience has occurred
  // If it hasn't, we need to set some default settings for the user
  const checkFirstRun = async () => {
    try {
      const firstRun = await AsyncStorage.getItem('firstRun')
      if (firstRun !== null) {
        setFirstRunOccurred(JSON.parse(firstRun))
        return
      }
      setFirstRunOccurred(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    checkAuthentication()
    checkFirstRun()
    setDefaultSettings()
  }, [])

  const screenOptions = {
    headerStyle: {
      backgroundColor: scheme === 'dark' ? colors.BG_DARK : colors.BG_LIGHT,
      shadowRadius: 0,
      shadowOffset: {
        height: 0,
        width: 0,
      },
    },
    headerTintColor: colors.RED,
  }

  if (!loaded || !navStateReady) return <ActivityIndicator />

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <AppearanceProvider>
        <NavigationContainer
          initialState={initialState}
          onStateChange={(state) =>
            AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
          }
          theme={scheme === 'dark' ? DarkTheme : LightTheme}>
          <RootStack.Navigator screenOptions={screenOptions}>
            {user.token ? (
              <>
                <RootStack.Screen
                  name="Lists"
                  component={ListsScreen}
                  options={{ title: '' }}
                />
                <RootStack.Screen
                  name="ListView"
                  component={ListViewScreen}
                  options={{
                    headerBackTitle: ' ',
                    title: '',
                  }}
                />
                <RootStack.Screen
                  name="NewList"
                  component={NewListScreen}
                  options={{ title: 'New List', headerBackTitle: ' ' }}
                />
                <RootStack.Screen
                  name="ShareNewList"
                  component={ShareNewListScreen}
                  options={{ title: 'Your list was created!' }}
                />
                <RootStack.Screen
                  name="RenameList"
                  component={RenameListScreen}
                  options={{ title: 'Rename List', headerBackTitle: ' ' }}
                />
                <RootStack.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{ headerBackTitle: ' ' }}
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
          </RootStack.Navigator>

          <StatusBar
            barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
          />
        </NavigationContainer>
      </AppearanceProvider>
    </AuthContext.Provider>
  )
}
export default App
