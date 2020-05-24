/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignupMutation
// ====================================================

export interface SignupMutation_signup {
  __typename: "AuthToken";
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: any | null;
}

export interface SignupMutation {
  /**
   * Create a new user account
   */
  signup: SignupMutation_signup | null;
}

export interface SignupMutationVariables {
  email: string;
  password: string;
}
