import { gql } from 'apollo-boost'

export const CREATE_LIST_MUTATION = gql`
  mutation CreateList($name: String!) {
    createList(name: $name) {
      id
    }
  }
`
