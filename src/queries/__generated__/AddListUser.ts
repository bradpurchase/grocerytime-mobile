/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddListUser
// ====================================================

export interface AddListUser_addListUser {
  __typename: "ListUser";
  listId: string;
}

export interface AddListUser {
  /**
   * Add a user to a list
   */
  addListUser: AddListUser_addListUser | null;
}

export interface AddListUserVariables {
  listId: string;
  userId: string;
}
