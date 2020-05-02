/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteList
// ====================================================

export interface DeleteList_deleteList {
  __typename: "List";
  id: string;
}

export interface DeleteList {
  /**
   * Delete a list
   */
  deleteList: DeleteList_deleteList | null;
}

export interface DeleteListVariables {
  listId: string;
}
