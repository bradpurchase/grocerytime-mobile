import { gql } from 'apollo-boost'

export const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItem($itemId: ID!, $completed: Boolean) {
    updateItem(itemId: $itemId, completed: $completed) {
      __typename
      id
      completed
    }
  }
`
