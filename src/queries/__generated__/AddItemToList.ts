/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddItemToList
// ====================================================

export interface AddItemToList_addItemToList {
  __typename: "Item";
  id: string;
  listId: string;
  name: string;
  quantity: number;
  createdAt: any | null;
  updatedAt: any | null;
}

export interface AddItemToList {
  /**
   * Add an item to a list
   */
  addItemToList: AddItemToList_addItemToList | null;
}

export interface AddItemToListVariables {
  listId: string;
  name: string;
  quantity?: number | null;
}
