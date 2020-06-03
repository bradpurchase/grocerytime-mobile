import * as React from 'react'
import { View, RefreshControl } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'

import { useMutation } from '@apollo/react-hooks'
import { REORDER_ITEM_MUTATION } from '../../queries/updateItem'
import * as ReorderItemMutationTypes from '../../queries/__generated__/ReorderItem'

import ListContext from '../../context/ListContext'

import EmptyState from '../../components/EmptyState'
import ItemCell from './ItemCell'
import AddItemInput from './AddItemInput'

interface DragData {
  data: any
  from: number
  to: number
}

const ItemsList: React.FC = React.memo(() => {
  const listContext = React.useContext(ListContext)
  const { data, refetch } = listContext
  const { list, networkStatus } = data

  const [reorderItem] = useMutation<
    ReorderItemMutationTypes.ReorderItem,
    ReorderItemMutationTypes.ReorderItemVariables
  >(REORDER_ITEM_MUTATION, {
    onCompleted: (data) => {
      console.log(data)
    },
  })

  const renderItem = ({ item, drag }: any) => (
    <ItemCell key={item.id} item={item} drag={drag} />
  )

  const onDragEnd = (dragData: DragData) => {
    const { data, from, to } = dragData

    // Handle case where the item was dragged but didn't move positions
    if (from === to) return

    // Perform mutations on the dragged item and the current item
    reorderItem({
      variables: {
        itemId: data[to].id,
        position: list.items[to].position,
      },
      optimisticResponse: {
        updateItem: {
          __typename: 'Item',
          id: data[to].id,
          position: list.items[to].position,
        },
      },
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <AddItemInput />

      <DraggableFlatList
        data={list.items}
        extraData={refetch()}
        keyExtractor={(item, _idx) => `draggable-item-${item.id}`}
        onDragEnd={onDragEnd}
        renderItem={renderItem}
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
export default ItemsList
