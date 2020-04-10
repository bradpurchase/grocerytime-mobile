/**
 * @format
 */

import React, { useState, useEffect } from 'react'
import { AppRegistry, ActivityIndicator } from 'react-native'

import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'

import AsyncStorage from '@react-native-community/async-storage'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'

import { name as appName } from './app.json'
import App from './App'

const AppComponent = () => {
  const [appState, setAppState] = useState({
    ready: false,
    client: null,
  })

  const loadConfigs = async () => {
    try {
      const authLink = setContext(async (_, { headers }) => {
        const token = await AsyncStorage.getItem('@accessToken')
        return {
          headers: {
            ...headers,
            Authorization: token
              ? `Bearer ${token}`
              : 'lNFGdSC2wd8f2QnF:hk5A84JJjKWZdKH9',
          },
        }
      })
      const httpLink = createHttpLink({
        uri: 'https://grocerytime.herokuapp.com/graphql',
        credentials: 'include',
      })
      const defaultOptions = {
        mutate: {
          errorPolicy: 'all',
        },
      }
      const cache = new InMemoryCache()
      await persistCache({
        cache,
        storage: AsyncStorage,
      })
      const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache,
        defaultOptions,
      })

      setAppState({ ready: true, client })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    loadConfigs()
  }, [])

  return appState.ready ? (
    <ApolloProvider client={appState.client}>
      <App />
    </ApolloProvider>
  ) : (
    <ActivityIndicator size="large" />
  )
}

AppRegistry.registerComponent(appName, () => AppComponent)
