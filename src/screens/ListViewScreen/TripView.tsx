import * as React from 'react'
import { View, RefreshControl } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'

import { useMutation } from '@apollo/react-hooks'
import { REORDER_ITEM_MUTATION } from '../../queries/reorderItem'

import ListContext from '../../context/ListContext'
import { Trip, Item } from '../../types'

import EmptyState from '../../components/EmptyState'
import TripDetails from './TripDetails'
import AddItemInput from './AddItemInput'
import ItemCell from './ItemCell'

interface DragData {
  data: any
  from: number
  to: number
}

const TripView: React.FC = React.memo(() => {
  const listContext = React.useContext(ListContext)
  const { data, refetch } = listContext
  const { list, networkStatus } = data
  const trip: Trip = list.trip

  const [listItems, setListItems] = React.useState(trip.items)

  // Effect for when we receive item updates (i.e. item added/updated)
  React.useEffect(() => {
    setListItems(trip.items)
  }, [trip.items])

  const [reorderItem] = useMutation(REORDER_ITEM_MUTATION)

  const onDragEnd = (dragData: DragData) => {
    const { data, from, to } = dragData

    setListItems(data)

    // Handle case where the item was dragged but didn't move positions
    if (from === to) return

    const item: Item = data[to]
    reorderItem({
      variables: {
        itemId: item.id,
        position: trip.items[to].position,
      },
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <TripDetails />

      <AddItemInput />

      <DraggableFlatList
        data={listItems}
        extraData={refetch()}
        keyExtractor={(item, idx) => item.id}
        onDragEnd={onDragEnd}
        renderItem={({ item, drag }: any) => (
          <ItemCell key={item.id} item={item} drag={drag} />
        )}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            title="No items"
            body="Add your first item by typing above."
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={networkStatus === 4}
            onRefresh={() => refetch()}
          />
        }
      />
    </View>
  )
})
export default TripView
