import * as React from 'react'
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
  data: ListQueryData
  refetch: () => void
}

const ListContext = React.createContext<ListContextProps>({
  data: {
    list: { id: '', name: '', items: [], listUsers: [] },
    networkStatus: 0,
  },
  refetch: () => {},
})
export default ListContext
