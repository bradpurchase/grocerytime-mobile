/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LeaveList
// ====================================================

export interface LeaveList_leaveList {
  __typename: "ListUser";
  listId: string;
  email: string | null;
}

export interface LeaveList {
  /**
   * Deletes the current user's ListUser record for the listID
   */
  leaveList: LeaveList_leaveList | null;
}

export interface LeaveListVariables {
  listId: string;
}
