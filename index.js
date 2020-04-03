/**
 * @format
 */

import React from 'react'
import { AppRegistry } from 'react-native'

import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { name as appName } from './app.json'
import App from './App'

// Apollo config
const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: 'lNFGdSC2wd8f2QnF:hk5A84JJjKWZdKH9',
    },
  })
  return forward(operation)
})
const link = createHttpLink({
  uri: 'https://grocerytime.herokuapp.com/graphql',
  credentials: 'include',
})
const defaultOptions = {
  mutate: {
    errorPolicy: 'all',
  },
}
const client = new ApolloClient({
  link: middlewareLink.concat(link),
  cache: new InMemoryCache(),
  defaultOptions,
})

const AppComponent = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

AppRegistry.registerComponent(appName, () => AppComponent)
