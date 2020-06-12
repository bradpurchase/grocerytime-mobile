/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateList
// ====================================================

export interface CreateList_createList_trip {
  __typename: "GroceryTrip";
  id: string;
  itemsCount: number | null;
}

export interface CreateList_createList {
  __typename: "List";
  id: string;
  name: string;
  trip: CreateList_createList_trip | null;
}

export interface CreateList {
  /**
   * Create a list
   */
  createList: CreateList_createList | null;
}

export interface CreateListVariables {
  name: string;
}
