import { Item } from './index'

export interface Trip {
  id: string
  name: string
  completed: boolean
  itemsCount: number
  items: Item[]
}
