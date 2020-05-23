import { gql } from 'apollo-boost'

export const JOIN_LIST_MUTATION = gql`
  mutation JoinList($listId: ID!) {
    joinList(listId: $listId) {
      listId
    }
  }
`
