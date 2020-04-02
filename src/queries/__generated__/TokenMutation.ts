/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TokenMutation
// ====================================================

export interface TokenMutation_token {
  __typename: "AuthToken";
  accessToken: string;
  refreshToken: string;
  expiresIn: any | null;
}

export interface TokenMutation {
  /**
   * Retrieve an access token
   */
  token: TokenMutation_token | null;
}

export interface TokenMutationVariables {
  grantType: string;
  email?: string | null;
  password?: string | null;
}
