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

import { getRefreshToken, setAccessToken } from './src/services/token'
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
            Authorization: authCreds,
          },
        }
      })
      const authErrorLink = onError(({ graphQLErrors, operation, forward }) => {
        if (graphQLErrors) {
          const sessionExpiredErrorMsg =
            'Token is invalid or session has expired'
          if (graphQLErrors[0].message === sessionExpiredErrorMsg) {
            return new Observable(async () => {
              console.log(
                'access token has expired... grabbing a new one using the refresh token',
              )
              const retrieveNewAccessToken = async () => {
                const refreshToken = await getRefreshToken()
                await client
                  .mutate({
                    mutation: REFRESH_TOKEN_MUTATION,
                    variables: {
                      grantType: 'refreshToken',
                      refreshToken: refreshToken,
                    },
                  })
                  .then((data) => {
                    //TODO this call is not successful because Apollo sends
                    // the mutation with `Bearer ${token}` style authentication
                    // headers.. need to figure out how to make client.mutate
                    // use `key:secret:` style auth headers
                    console.log(data)
                    const tokens = data.token
                    setAccessToken(tokens)
                    return tokens.accessToken
                  })
                  .catch((err) => {
                    console.log(err)
                    return
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
