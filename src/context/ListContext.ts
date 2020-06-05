import * as React from 'react'
import { Trip, ListUser } from '../types'

type List = {
  id: string
  name: string
  trip: Trip
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
    list: {
      id: '',
      name: '',
      trip: { id: '', name: '', completed: false, items: [] },
      listUsers: [],
    },
    networkStatus: 0,
  },
  refetch: () => {},
})
export default ListContext
