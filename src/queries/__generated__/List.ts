/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: List
// ====================================================

export interface List_list_trip_items {
  __typename: "Item";
  id: string;
  name: string;
  quantity: number;
  position: number;
  completed: boolean;
}

export interface List_list_trip {
  __typename: "GroceryTrip";
  id: string;
  name: string;
  completed: boolean;
  itemsCount: number | null;
  items: (List_list_trip_items | null)[] | null;
}

export interface List_list_listUsers_user {
  __typename: "User";
  id: string;
  email: string;
}

export interface List_list_listUsers {
  __typename: "ListUser";
  id: string;
  userId: string | null;
  creator: boolean;
  email: string | null;
  user: List_list_listUsers_user | null;
}

export interface List_list {
  __typename: "List";
  id: string;
  name: string;
  trip: List_list_trip | null;
  listUsers: (List_list_listUsers | null)[] | null;
}

export interface List {
  /**
   * Retrieve a specific list
   */
  list: List_list | null;
}

export interface ListVariables {
  id: string;
}
