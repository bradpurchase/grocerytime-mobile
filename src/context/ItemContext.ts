import * as React from 'react'
import { Item } from '../types'

const ItemContext = React.createContext<Item>({
  id: '',
  listId: '',
  userId: '',
  name: '',
  quantity: 0,
  completed: false,
  createdAt: '',
  updatedAt: '',
})
export default ItemContext
