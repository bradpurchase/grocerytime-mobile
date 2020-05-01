import { gql } from 'apollo-boost'

export const ME_QUERY = gql`
  query me {
    me {
      lists {
        id
        name
        itemsCount
      }
    }
  }
`
