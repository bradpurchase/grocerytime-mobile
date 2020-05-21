import { Item, ListUser } from './index'

export interface List {
  id: string
  name?: string
  itemsCount?: number
  items?: Item[]
  listUsers?: ListUser[]
}
