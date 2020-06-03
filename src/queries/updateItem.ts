import { gql } from 'apollo-boost'

export const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItem(
    $itemId: ID!
    $name: String
    $quantity: Int
    $completed: Boolean
  ) {
    updateItem(
      itemId: $itemId
      name: $name
      quantity: $quantity
      completed: $completed
    ) {
      __typename
      id
      quantity
      completed
    }
  }
`

export const REORDER_ITEM_MUTATION = gql`
  mutation ReorderItem($itemId: ID!, $position: Int!) {
    updateItem(itemId: $itemId, position: $position) {
      __typename
      id
      position
    }
  }
`
