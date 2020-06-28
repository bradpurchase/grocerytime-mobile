/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeclineListInvite
// ====================================================

export interface DeclineListInvite_declineListInvite {
  __typename: "ListUser";
  listId: string;
  email: string | null;
}

export interface DeclineListInvite {
  /**
   * Declines a list invitation for a user
   */
  declineListInvite: DeclineListInvite_declineListInvite | null;
}

export interface DeclineListInviteVariables {
  listId: string;
}
