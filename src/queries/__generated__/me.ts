/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Me
// ====================================================

export interface Me_me_lists_trip {
  __typename: "GroceryTrip";
  id: string;
  itemsCount: number | null;
}

export interface Me_me_lists {
  __typename: "List";
  id: string;
  name: string;
  trip: Me_me_lists_trip | null;
}

export interface Me_me {
  __typename: "User";
  id: string;
  lists: (Me_me_lists | null)[] | null;
}

export interface Me {
  /**
   * Retrieve the current user
   */
  me: Me_me | null;
}
