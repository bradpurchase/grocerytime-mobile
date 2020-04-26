/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteItem
// ====================================================

export interface DeleteItem_deleteItem {
  __typename: "Item";
  id: string;
}

export interface DeleteItem {
  /**
   * Remove an item from a list
   */
  deleteItem: DeleteItem_deleteItem | null;
}

export interface DeleteItemVariables {
  itemId: string;
}
