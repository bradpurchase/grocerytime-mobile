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
      listUsers {
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
