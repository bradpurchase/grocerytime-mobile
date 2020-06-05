import { gql } from 'apollo-boost'

export const NEW_ITEM_IN_TRIP_SUBSCRIPTION = gql`
  subscription NewItemInTrip($listId: ID!) {
    newItemInTrip(listId: $listId) {
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
