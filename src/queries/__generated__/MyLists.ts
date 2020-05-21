/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyLists
// ====================================================

export interface MyLists_me_lists {
  __typename: "List";
  id: string;
  name: string;
  itemsCount: number | null;
}

export interface MyLists_me {
  __typename: "User";
  lists: (MyLists_me_lists | null)[] | null;
}

export interface MyLists {
  /**
   * Retrieve the current user
   */
  me: MyLists_me | null;
}
