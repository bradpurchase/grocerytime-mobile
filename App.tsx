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

import { useApolloClient } from '@apollo/react-hooks'

import { AppearanceProvider } from 'react-native-appearance'
import { LightTheme, DarkTheme } from './src/styles/themes'

import LoginScreen from './src/screens/Auth/LoginScreen'
import SignupScreen from './src/screens/Auth/SignupScreen'
import JoinListScreen from './src/screens/JoinListScreen/JoinListScreen'
import ListsScreen from './src/screens/ListsScreen/ListsScreen'
import NewListScreen from './src/screens/NewListScreen/NewListScreen'
import RenameListScreen from './src/screens/RenameListScreen/RenameListScreen'
import ShareListScreen from './src/screens/ShareListScreen/ShareListScreen'
import ListViewScreen from './src/screens/ListViewScreen/ListViewScreen'
import SettingsScreen from './src/screens/SettingsScreen/SettingsScreen'

import AuthContext from './src/context/AuthContext'
import colors from './src/styles/colors'
import { RootStackParamList } from './src/types/Navigation'
import { CurrentUser } from './src/types'

import { clearTokens } from './src/services/token'
import { getCurrentUser, setCurrentUser } from './src/services/user'

const MainStack = createStackNavigator<RootStackParamList>()
const RootStack = createStackNavigator<RootStackParamList>()

const PERSISTENCE_KEY = 'NAVIGATION_STATE'

const App = () => {
  const client = useApolloClient()

  // Subscribe to system color scheme changes (light/dark)
  const scheme = useColorScheme()

  const [loaded, setLoaded] = useState<boolean>(false)
  const [navStateReady, setNavStateReady] = useState<boolean>(false)
  const [initialState, setInitialState] = useState()
  const [user, setUser] = useState<CurrentUser>({
    id: '',
    token: '',
  })

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
      await client.clearStore() // clear ApolloClient store
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    checkAuthentication()
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
  const MainStackScreen = () => (
    <MainStack.Navigator screenOptions={screenOptions}>
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
              headerBackTitle: 'Lists',
              title: '',
            }}
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
      <RootStack.Screen
        name="JoinList"
        component={JoinListScreen}
        options={{ title: 'Join List' }}
      />
    </MainStack.Navigator>
  )

  if (!loaded || !navStateReady) return <ActivityIndicator />

  // https://groceryti.me/share/927e5d2e-7d79-4e9a-b12d-a8b372441bee
  const linking = {
    prefixes: ['grocerytime://'],
    config: {
      JoinList: {
        path: 'joinlist/:id',
      },
    },
  }
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <AppearanceProvider>
        <NavigationContainer
          initialState={initialState}
          onStateChange={(state) =>
            AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
          }
          theme={scheme === 'dark' ? DarkTheme : LightTheme}
          linking={linking}>
          <RootStack.Navigator mode="modal" screenOptions={screenOptions}>
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
            <RootStack.Screen
              name="RenameList"
              component={RenameListScreen}
              options={{ title: 'Rename List' }}
            />
            <RootStack.Screen
              name="ShareList"
              component={ShareListScreen}
              options={{ title: 'Share List' }}
            />
            <RootStack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: '' }}
            />
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
