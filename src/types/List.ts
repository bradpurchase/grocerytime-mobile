import { Trip, ListUser } from './index'

export interface List {
  id: string
  name?: string
  itemsCount?: number
  trip?: Trip
  listUsers?: ListUser[]
}
