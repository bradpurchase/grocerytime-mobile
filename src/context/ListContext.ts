import React from 'react'

type Item = {
  id: string
  listId: string
  userId: string
  name: string
  quantity: number
  createdAt: string
  updatedAt: string
}

type List = {
  id: string
  name: string
  items: Item[]
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
