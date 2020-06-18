/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Lists
// ====================================================

export interface Lists_lists_trip_items {
  __typename: "Item";
  id: string;
  name: string;
  quantity: number;
  position: number;
  completed: boolean;
  updatedAt: any | null;
}

export interface Lists_lists_trip {
  __typename: "GroceryTrip";
  id: string;
  name: string;
  completed: boolean;
  itemsCount: number | null;
  updatedAt: any | null;
  items: (Lists_lists_trip_items | null)[] | null;
}

export interface Lists_lists_listUsers_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface Lists_lists_listUsers {
  __typename: "ListUser";
  id: string;
  userId: string | null;
  creator: boolean;
  user: Lists_lists_listUsers_user | null;
}

export interface Lists_lists {
  __typename: "List";
  id: string;
  name: string;
  trip: Lists_lists_trip | null;
  listUsers: (Lists_lists_listUsers | null)[] | null;
}

export interface Lists {
  /**
   * Retrieve lists for the current user
   */
  lists: (Lists_lists | null)[] | null;
}
