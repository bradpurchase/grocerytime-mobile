/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SharableList
// ====================================================

export interface SharableList_sharableList {
  __typename: "List";
  name: string;
}

export interface SharableList {
  /**
   * Retrieve basic info about a list for sharing
   */
  sharableList: SharableList_sharableList | null;
}

export interface SharableListVariables {
  id: string;
}
