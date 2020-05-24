import { gql } from 'apollo-boost'

export const NEW_ITEM_IN_LIST_SUBSCRIPTION = gql`
  subscription NewItemInList($listId: ID!) {
    newItemInList(listId: $listId) {
      id
      name
      quantity
      completed
    }
  }
`