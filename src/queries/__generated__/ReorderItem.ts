/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ReorderItem
// ====================================================

export interface ReorderItem_updateItem {
  __typename: "Item";
  id: string;
  position: number;
}

export interface ReorderItem {
  /**
   * Updates the properties of an item in a list
   */
  updateItem: ReorderItem_updateItem | null;
}

export interface ReorderItemVariables {
  itemId: string;
  position: number;
}
