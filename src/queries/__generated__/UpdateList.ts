/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateList
// ====================================================

export interface UpdateList_updateList {
  __typename: "List";
  id: string;
  name: string;
}

export interface UpdateList {
  /**
   * Update a list
   */
  updateList: UpdateList_updateList | null;
}

export interface UpdateListVariables {
  listId: string;
  name?: string | null;
}
