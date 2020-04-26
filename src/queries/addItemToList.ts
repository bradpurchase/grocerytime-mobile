import { gql } from 'apollo-boost'

export const ADD_ITEM_TO_LIST_MUTATION = gql`
  mutation AddItemToList($listId: ID!, $name: String!, $quantity: Int) {
    addItemToList(listId: $listId, name: $name, quantity: $quantity) {
      id
      listId
      name
      quantity
      createdAt
      updatedAt
    }
  }
`
