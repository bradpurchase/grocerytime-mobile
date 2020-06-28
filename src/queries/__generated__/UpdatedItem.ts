/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: UpdatedItem
// ====================================================

export interface UpdatedItem_updatedItem {
  __typename: "Item";
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
  position: number;
}

export interface UpdatedItem {
  /**
   * Retrieve an update to an item
   */
  updatedItem: UpdatedItem_updatedItem | null;
}

export interface UpdatedItemVariables {
  tripId: string;
}
