import React from 'react'
import { Item, ListUser } from '../types'

type List = {
  id: string
  name: string
  items: Item[]
  listUsers: ListUser[]
}

type ListQueryData = {
  list: List
  networkStatus: number
}

type ListContextProps = {
  data: ListQueryData | null
  refetch: () => void
}

const ListContext = React.createContext<ListContextProps>({
  data: null,
  refetch: () => {},
})
export default ListContext
