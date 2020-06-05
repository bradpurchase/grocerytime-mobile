import { gql } from 'apollo-boost'

export const ADD_ITEM_TO_TRIP_MUTATION = gql`
  mutation AddItemToTrip($tripId: ID!, $name: String!, $quantity: Int) {
    addItemToTrip(tripId: $tripId, name: $name, quantity: $quantity) {
      __typename
      id
      groceryTripId
      name
      quantity
      position
      createdAt
      updatedAt
    }
  }
`
