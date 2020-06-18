import { gql } from 'apollo-boost'

export const INVITE_TO_LIST_MUTATION = gql`
  mutation InviteToList($listId: ID!, $email: String!) {
    inviteToList(listId: $listId, email: $email) {
      __typename
      id
      listId
      email
    }
  }
`
