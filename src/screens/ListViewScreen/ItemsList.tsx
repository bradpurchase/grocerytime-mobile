import * as React from 'react'
import { View, RefreshControl } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'

import { useMutation } from '@apollo/react-hooks'
import { REORDER_ITEM_MUTATION } from '../../queries/reorderItem'

import ListContext from '../../context/ListContext'
import { Item } from '../../types'

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

  const [listItems, setListItems] = React.useState(list.items)

  // Effect for when we receive new items (i.e. item added)
  React.useEffect(() => {
    setListItems(list.items)
  }, [list.items])

  const [reorderItem] = useMutation(REORDER_ITEM_MUTATION, {
    onCompleted: (data) => {
      setListItems(data.reorderItem.items)
    },
  })

  const onDragEnd = (dragData: DragData) => {
    console.log('onDragEnd called')
    const { data, from, to } = dragData

    setListItems(data)

    // Handle case where the item was dragged but didn't move positions
    if (from === to) return

    // Perform mutations on the dragged item and the current item
    const item: Item = data[to]
    const currPos = item.position
    const newPos = list.items[to].position
    const direction = currPos > newPos ? 'up' : 'down'

    //TODO for each item, determine whether position should be
    // increased or decreased depending on new position vs current
    const updatedItems = data.map((item: Item) => {
      let newPos = item.position
      console.log(item.id, list.items[from].id)
      if (item.id === list.items[from].id) {
        newPos = direction == 'up' ? item.position - 1 : item.position + 1
      } else {
        newPos = direction == 'up' ? item.position + 1 : item.position - 1
      }
      return {
        __typename: 'Item',
        id: item.id,
        listId: item.listId,
        position: newPos,
        name: item.name,
        quantity: item.quantity,
        completed: item.completed,
      }
    })
    console.log(updatedItems)

    reorderItem({
      variables: {
        itemId: item.id,
        position: list.items[to].position,
      },
      // optimisticResponse: {
      //   __typename: 'Mutation',
      //   reorderItem: {
      //     __typename: 'List',
      //     id: list.id,
      //     name: list.name,
      //     items: updatedItems,
      //   },
      // },
      // update(cache, { data: { reorderItem } }) {
      //   const listData: any = cache.readQuery({
      //     query: LIST_QUERY,
      //     variables: {
      //       id: item.listId,
      //     },
      //   })
      //   const list: List = listData.list
      //   console.log(reorderItem.items)
      //   cache.writeQuery({
      //     query: LIST_QUERY,
      //     data: {
      //       list: {
      //         ...list,
      //         items: reorderItem.items,
      //       },
      //     },
      //   })
      // },
    })
  }

  return (
    <View style={{ flex: 1 }}>
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
export default ItemsList
