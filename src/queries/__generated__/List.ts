/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: List
// ====================================================

export interface List_list_items {
  __typename: "Item";
  id: string;
  name: string;
  quantity: number;
  completed: boolean;
}

export interface List_list_listUsers {
  __typename: "ListUser";
  userId: string;
  creator: boolean;
}

export interface List_list {
  __typename: "List";
  id: string;
  name: string;
  items: (List_list_items | null)[] | null;
  listUsers: (List_list_listUsers | null)[] | null;
}

export interface List {
  /**
   * Retrieve a list and its items
   */
  list: List_list | null;
}

export interface ListVariables {
  id: string;
}
