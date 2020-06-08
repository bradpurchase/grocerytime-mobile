import { gql } from 'apollo-boost'

export const NEW_ITEM_SUBSCRIPTION = gql`
  subscription NewItem($tripId: ID!) {
    newItem(tripId: $tripId) {
      __typename
      id
      groceryTripId
      name
      quantity
      completed
      position
    }
  }
`
