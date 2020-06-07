import { gql } from 'apollo-boost'

export const UPDATE_TRIP_MUTATION = gql`
  mutation UpdateTrip(
    $tripId: ID!
    $name: String
    $completed: Boolean
    $copyRemainingItems: Boolean
  ) {
    updateTrip(
      tripId: $tripId
      name: $name
      completed: $completed
      copyRemainingItems: $copyRemainingItems
    ) {
      id
      name
      completed
    }
  }
`
