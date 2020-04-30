import { gql } from 'apollo-boost'

export const LIST_QUERY = gql`
  query List($id: ID!) {
    list(id: $id) {
      id
      name
      items {
        id
        name
        quantity
        completed
      }
    }
  }
`
