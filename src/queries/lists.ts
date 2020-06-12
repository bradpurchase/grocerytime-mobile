import { gql } from 'apollo-boost'

export const LISTS_QUERY = gql`
  query Lists {
    lists {
      __typename
      id
      name
      trip {
        __typename
        id
        name
        completed
        itemsCount
        updatedAt
        items {
          __typename
          id
          name
          quantity
          position
          completed
          updatedAt
        }
      }
      listUsers {
        __typename
        id
        userId
        creator
        user {
          __typename
          id
          email
        }
      }
    }
  }
`
