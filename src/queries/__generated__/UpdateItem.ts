/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateItem
// ====================================================

export interface UpdateItem_updateItem {
  __typename: "Item";
  id: string;
  completed: boolean;
}

export interface UpdateItem {
  /**
   * Updates the properties of an item in a list
   */
  updateItem: UpdateItem_updateItem | null;
}

export interface UpdateItemVariables {
  itemId: string;
  completed?: boolean | null;
}
