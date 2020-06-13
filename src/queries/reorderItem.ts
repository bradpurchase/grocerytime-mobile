import { gql } from 'apollo-boost'

export const REORDER_ITEM_MUTATION = gql`
  mutation ReorderItem($itemId: ID!, $position: Int!) {
    reorderItem(itemId: $itemId, position: $position) {
      __typename
      items {
        __typename
        id
        groceryTripId
        name
        quantity
        completed
        position
      }
    }
  }
`
