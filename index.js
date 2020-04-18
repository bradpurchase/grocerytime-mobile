/**
 * @format
 */

import React, { useState, useEffect } from 'react'
import { AppRegistry, ActivityIndicator } from 'react-native'

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
  setAccessToken,
  getAccessToken,
} from './src/services/token'
import { REFRESH_TOKEN_MUTATION } from './src/queries/refreshToken'

const AppComponent = () => {
  const [appState, setAppState] = useState({
    ready: false,
    client: null,
  })

  const loadConfigs = async () => {
    try {
      const httpLink = createHttpLink({
        uri: 'https://grocerytime.herokuapp.com/graphql',
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
          : 'lNFGdSC2wd8f2QnF:hk5A84JJjKWZdKH9'
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
              const accessToken = await getAccessToken()
              const refreshToken = await getRefreshToken()
              console.log(
                `access token ${accessToken} has expired... grabbing a new one using the refresh token ${refreshToken}`,
              )
              // TODO move retrieveNewAccessToken out of this file
              const retrieveNewAccessToken = async () => {
                const refreshToken = await getRefreshToken()
                const mutationJSON = JSON.stringify({
                  query: REFRESH_TOKEN_MUTATION,
                  variables: {
                    grantType: 'refreshToken',
                    refreshToken,
                  },
                  operationName: 'RefreshTokenMutation',
                })
                await fetch('https://grocerytime.herokuapp.com/graphql', {
                  headers: {
                    'content-type': 'application/json',
                    authorization: 'lNFGdSC2wd8f2QnF:hk5A84JJjKWZdKH9',
                  },
                  method: 'POST',
                  body: mutationJSON,
                })
                  .then((res) => res.json())
                  .then((data) => {
                    console.log(data.data)
                    const tokens = data.data.token
                    setAccessToken(tokens)
                    return tokens.accessToken
                  })
                  .catch((e) => {
                    //TODO couldn't get a new token with the refresh token,
                    // perform logout action
                  })
              }
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
