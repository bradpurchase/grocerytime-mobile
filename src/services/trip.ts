import { Trip, Item } from '../types'

export const numCompletedItems = (trip: Trip): number =>
  trip.items.filter((item: Item) => item.completed).length

export const allItemsCompleted = (trip: Trip): boolean =>
  trip.items.length === numCompletedItems(trip)
