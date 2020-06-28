import { gql } from 'apollo-boost'

export const DECLINE_LIST_INVITE_MUTATION = gql`
  mutation DeclineListInvite($listId: ID!) {
    declineListInvite(listId: $listId) {
      listId
      email
    }
  }
`
