/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddItemToTrip
// ====================================================

export interface AddItemToTrip_addItemToTrip {
  __typename: "Item";
  id: string;
  groceryTripId: string;
  name: string;
  quantity: number;
  position: number;
  createdAt: any | null;
  updatedAt: any | null;
}

export interface AddItemToTrip {
  /**
   * Add an item to a grocery trip
   */
  addItemToTrip: AddItemToTrip_addItemToTrip | null;
}

export interface AddItemToTripVariables {
  tripId: string;
  name: string;
  quantity?: number | null;
}
