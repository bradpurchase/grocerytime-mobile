import { gql } from 'apollo-boost'

export const DELETE_ITEM_MUTATION = gql`
  mutation DeleteItem($itemId: ID!) {
    deleteItem(itemId: $itemId) {
      __typename
      id
    }
  }
`
