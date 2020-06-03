/**
 * @format
 */

import React, { useState, useEffect } from 'react'
import { AppRegistry, ActivityIndicator } from 'react-native'
import Config from 'react-native-config'

import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import { fromPromise } from 'apollo-link'

import AsyncStorage from '@react-native-community/async-storage'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'

import { name as appName } from './app.json'
import App from './App'

import { retrieveNewAccessToken } from './src/services/token'

//GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest

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
      const headersLink = setContext(async (_, { headers }) => {
        const token = await AsyncStorage.getItem('@accessToken')
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
      const wsLink = new WebSocketLink({
        uri: Config.WS_URL,
        options: {
          reconnect: true,
        },
      })
      const splitLink = split(
        ({ query }) => {
          const def = getMainDefinition(query)
          return (
            def.kind === 'OperationDefinition' &&
            def.operation === 'subscription'
          )
        },
        wsLink,
        httpLink,
      )

      const authErrorLink = onError(({ graphQLErrors, operation, forward }) => {
        if (graphQLErrors) {
          if (graphQLErrors[0].message === 'token invalid/expired') {
            return fromPromise(
              retrieveNewAccessToken().then((newToken) => {
                const headers = operation.getContext().headers
                operation.setContext({
                  headers: {
                    ...headers,
                    authorization: `Bearer ${newToken}`,
                  },
                })
              }),
            ).flatMap(() => forward(operation))
          }
        }
      })

      const cache = new InMemoryCache()
      await persistCache({
        cache,
        storage: AsyncStorage,
      })
      const authLink = headersLink.concat(authErrorLink)
      const client = new ApolloClient({
        link: authLink.concat(splitLink),
        cache,
        defaultOptions: {
          mutate: {
            errorPolicy: 'all',
          },
        },
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
