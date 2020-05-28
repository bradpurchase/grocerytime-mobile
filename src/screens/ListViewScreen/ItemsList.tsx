import * as React from 'react'
import { View, RefreshControl, FlatList } from 'react-native'

import ListContext from '../../context/ListContext'

import { useMutation } from '@apollo/react-hooks'
import { DELETE_ITEM_MUTATION } from '../../queries/deleteItem'
import * as DeleteItemTypes from '../../queries/__generated__/DeleteItem'

import EmptyState from '../../components/EmptyState'
import ItemCell from './ItemCell'
import AddItemInput from './AddItemInput'

import { Item } from '../../types'

const ItemsList: React.FC = React.memo(() => {
  const listContext = React.useContext(ListContext)
  const { data, refetch } = listContext

  if (!data) return null
  const { list, networkStatus } = data

  const [deleteItem, { error }] = useMutation<
    DeleteItemTypes.DeleteItem,
    DeleteItemTypes.DeleteItemVariables
  >(DELETE_ITEM_MUTATION, {
    onCompleted: (data) => {
      console.log(data)
      refetch()
    },
  })
  if (error) console.log(error)

  const handleDeleteItem = (data: any) => {
    const item: Item = data.item
    deleteItem({
      variables: {
        itemId: item.id,
      },
    })
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      <AddItemInput />

      <FlatList
        data={list.items}
        extraData={refetch()}
        renderItem={({ item }: any) => <ItemCell key={item.id} item={item} />}
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
