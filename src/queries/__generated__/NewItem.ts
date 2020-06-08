/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: NewItem
// ====================================================

export interface NewItem_newItem {
  __typename: "Item";
  id: string;
  groceryTripId: string;
  name: string;
  quantity: number;
  completed: boolean;
  position: number;
}

export interface NewItem {
  /**
   * Retrieve a new item in a trip
   */
  newItem: NewItem_newItem | null;
}

export interface NewItemVariables {
  tripId: string;
}
