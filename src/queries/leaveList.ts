import { gql } from 'apollo-boost'

export const LEAVE_LIST_MUTATION = gql`
  mutation LeaveList($listId: ID!) {
    leaveList(listId: $listId) {
      listId
      email
    }
  }
`
