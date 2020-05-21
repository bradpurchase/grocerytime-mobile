import { gql } from 'apollo-boost'

export const ADD_LIST_USER_MUTATION = gql`
  mutation AddListUser($listId: ID!, $userId: ID!) {
    addListUser(listId: $listId, userId: $userId) {
      listId
    }
  }
`
