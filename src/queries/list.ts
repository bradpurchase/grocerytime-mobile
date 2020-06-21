import { gql } from 'apollo-boost'

export const LIST_QUERY = gql`
  query List($id: ID!) {
    list(id: $id) {
      __typename
      id
      name
      trip {
        __typename
        id
        name
        completed
        itemsCount
        items {
          __typename
          id
          name
          quantity
          position
          completed
        }
      }
      listUsers {
        __typename
        id
        userId
        creator
        email
        user {
          __typename
          id
          email
        }
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
