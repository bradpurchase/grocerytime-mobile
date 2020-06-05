/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ReorderItem
// ====================================================

export interface ReorderItem_reorderItem_trip_items {
  __typename: "Item";
  id: string;
  groceryTripId: string;
  name: string;
  quantity: number;
  completed: boolean;
  position: number;
}

export interface ReorderItem_reorderItem_trip {
  __typename: "GroceryTrip";
  items: (ReorderItem_reorderItem_trip_items | null)[] | null;
}

export interface ReorderItem_reorderItem {
  __typename: "List";
  id: string;
  name: string;
  trip: ReorderItem_reorderItem_trip | null;
}

export interface ReorderItem {
  /**
   * Updates the order of an item in a list
   */
  reorderItem: ReorderItem_reorderItem | null;
}

export interface ReorderItemVariables {
  itemId: string;
  position: number;
}
