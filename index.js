/**
 * @format
 */

import React from 'react'
import { AppRegistry } from 'react-native'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { name as appName } from './app.json'
import App from './App'

const link = createHttpLink({
  uri: 'https://grocerytime.herokuapp.com/graphql',
  credentials: 'include',
})
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

const AppComponent = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

AppRegistry.registerComponent(appName, () => AppComponent)
