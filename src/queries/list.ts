import { gql } from 'apollo-boost'

export const LIST_QUERY = gql`
  query List($id: ID!) {
    list(id: $id) {
      __typename
      id
      name
      items {
        __typename
        id
        name
        quantity
        completed
      }
      listUsers {
        __typename
        id
        userId
        creator
      }
    }
  }
`

export const SHAREABLE_LIST_QUERY = gql`
  query SharableList($id: ID!) {
    sharableList(id: $id) {
      name
    }
  }
`
