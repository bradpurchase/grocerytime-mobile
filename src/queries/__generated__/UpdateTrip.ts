/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateTrip
// ====================================================

export interface UpdateTrip_updateTrip {
  __typename: "GroceryTrip";
  id: string;
  name: string;
  completed: boolean;
}

export interface UpdateTrip {
  /**
   * Update the details about a grocery trip
   */
  updateTrip: UpdateTrip_updateTrip | null;
}

export interface UpdateTripVariables {
  tripId: string;
  name?: string | null;
  completed?: boolean | null;
  copyRemainingItems?: boolean | null;
}
