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
   * Join a list via share link
   */
  joinList: JoinList_joinList | null;
}

export interface JoinListVariables {
  listId: string;
}
