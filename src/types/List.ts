import { Trip, ListUser } from './index'

export interface List {
  id: string
  name?: string
  trip: Trip
  listUsers?: ListUser[]
}
