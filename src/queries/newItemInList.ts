import { gql } from 'apollo-boost'

export const NEW_ITEM_IN_LIST_SUBSCRIPTION = gql`
  subscription NewItemInList {
    newItemInList {
      id
      name
      quantity
      completed
    }
  }
`
