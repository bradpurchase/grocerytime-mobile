/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: me
// ====================================================

export interface me_me_lists {
  __typename: "List";
  id: string;
  name: string;
}

export interface me_me {
  __typename: "User";
  lists: (me_me_lists | null)[] | null;
}

export interface me {
  /**
   * Retrieve the current user
   */
  me: me_me | null;
}
