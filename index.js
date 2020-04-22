/**
 * @format
 */

import React, { useState, useEffect } from 'react'
import { AppRegistry, ActivityIndicator } from 'react-native'
import Config from 'react-native-config'

import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks'
import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import { Observable } from 'apollo-link'

import AsyncStorage from '@react-native-community/async-storage'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'

import { name as appName } from './app.json'
import App from './App'

import {
  getRefreshToken,
  getAccessToken,
  retrieveNewAccessToken,
} from './src/services/token'

const AppComponent = () => {
  const [appState, setAppState] = useState({
    ready: false,
    client: null,
  })

  const loadConfigs = async () => {
    try {
      const httpLink = createHttpLink({
        uri: Config.API_BASE_URL,
        credentials: 'include',
      })
      const authLink = setContext(async (_, { headers }) => {
        const token = await AsyncStorage.getItem('@accessToken')
        // const expiresIn = await AsyncStorage.getItem('@expiresIn')
        // const expiryDate = new Date(expiresIn)
        // const currDate = new Date()
        // const tokenExpired = currDate >= expiryDate
        const authCreds = token
          ? `Bearer ${token}`
          : `${Config.API_KEY}:${Config.API_SECRET}`
        return {
          headers: {
            ...headers,
            authorization: authCreds,
          },
        }
      })
      const authErrorLink = onError(({ graphQLErrors, operation, forward }) => {
        if (graphQLErrors) {
          const sessionExpiredErrorMsg =
            'Token is invalid or session has expired'
          if (graphQLErrors[0].message === sessionExpiredErrorMsg) {
            return new Observable(async () => {
              await retrieveNewAccessToken()
                .then((newToken) => {
                  const headers = operation.getContext().headers
                  operation.setContext({
                    headers: {
                      ...headers,
                      Authorization: `Bearer ${newToken}`,
                    },
                  })
                  return forward(operation)
                })
                .catch((err) => {
                  console.log(err)
                })
            })
          }
        }
      })

      const cache = new InMemoryCache()
      const defaultOptions = {
        mutate: {
          errorPolicy: 'all',
        },
      }
      await persistCache({
        cache,
        storage: AsyncStorage,
      })
      const authFlowLink = authLink.concat(authErrorLink)
      const client = new ApolloClient({
        link: authFlowLink.concat(httpLink),
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
