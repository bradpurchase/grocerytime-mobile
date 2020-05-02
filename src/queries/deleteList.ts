import { gql } from 'apollo-boost'

export const DELETE_LIST_MUTATION = gql`
  mutation DeleteList($listId: ID!) {
    deleteList(listId: $listId) {
      id
    }
  }
`
