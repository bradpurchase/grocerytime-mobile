/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: JoinList
// ====================================================

export interface JoinList_joinList {
  __typename: "ListUser";
  listId: string;
}

export interface JoinList {
  /**
   * Creates a proper ListUser membership and removes the pending state
   */
  joinList: JoinList_joinList | null;
}

export interface JoinListVariables {
  listId: string;
}
