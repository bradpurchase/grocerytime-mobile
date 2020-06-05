/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: NewItemInTrip
// ====================================================

export interface NewItemInTrip_newItemInTrip {
  __typename: "Item";
  id: string;
  groceryTripId: string;
  name: string;
  quantity: number;
  completed: boolean;
  position: number;
}

export interface NewItemInTrip {
  /**
   * Retrieve a new item in a trip
   */
  newItemInTrip: NewItemInTrip_newItemInTrip | null;
}

export interface NewItemInTripVariables {
  listId: string;
}
