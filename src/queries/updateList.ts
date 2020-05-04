import { gql } from 'apollo-boost'

export const UPDATE_LIST_MUTATION = gql`
  mutation UpdateList($listId: ID!, $name: String) {
    updateList(listId: $listId, name: $name) {
      id
      name
    }
  }
`
