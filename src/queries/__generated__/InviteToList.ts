/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: InviteToList
// ====================================================

export interface InviteToList_inviteToList_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface InviteToList_inviteToList {
  __typename: "ListUser";
  id: string;
  listId: string;
  email: string | null;
  creator: boolean;
  userId: string | null;
  user: InviteToList_inviteToList_user | null;
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
