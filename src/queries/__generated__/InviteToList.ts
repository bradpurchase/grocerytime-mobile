/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: InviteToList
// ====================================================

export interface InviteToList_inviteToList {
  __typename: "ListUser";
  id: string;
  listId: string;
  email: string | null;
}

export interface InviteToList {
  /**
   * Invite to a list via email
   */
  inviteToList: InviteToList_inviteToList | null;
}

export interface InviteToListVariables {
  listId: string;
  email: string;
}
