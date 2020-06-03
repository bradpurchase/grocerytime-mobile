/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: NewItemInList
// ====================================================

export interface NewItemInList_newItemInList {
  __typename: "Item";
  id: string;
  listId: string;
  name: string;
  quantity: number;
  completed: boolean;
}

export interface NewItemInList {
  /**
   * Retrieve a new item in a list
   */
  newItemInList: NewItemInList_newItemInList | null;
}

export interface NewItemInListVariables {
  listId: string;
}
