import * as React from 'react'
import { Item } from '../types'

type ItemContextProps = {
  item: Item | null
}

const ItemContext = React.createContext<ItemContextProps>({ item: null })
export default ItemContext
