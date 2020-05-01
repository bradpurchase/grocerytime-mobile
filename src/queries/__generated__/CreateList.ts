/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateList
// ====================================================

export interface CreateList_createList {
  __typename: "List";
  id: string;
}

export interface CreateList {
  /**
   * Create a grocery list
   */
  createList: CreateList_createList | null;
}

export interface CreateListVariables {
  name: string;
}
