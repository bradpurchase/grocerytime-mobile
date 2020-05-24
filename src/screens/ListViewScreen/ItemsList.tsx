import * as React from 'react'
import { View, RefreshControl, SectionList, StyleSheet } from 'react-native'

import ListContext from '../../context/ListContext'

import { useMutation, useSubscription } from '@apollo/react-hooks'
import { DELETE_ITEM_MUTATION } from '../../queries/deleteItem'
import { NEW_ITEM_IN_LIST_SUBSCRIPTION } from '../../queries/newItemInList'
import * as DeleteItemTypes from '../../queries/__generated__/DeleteItem'

import EmptyState from '../../components/EmptyState'
import SectionCell from './SectionCell'
import ItemCell from './ItemCell'
import AddItemInput from './AddItemInput'

import { Item } from './types'

const ItemsList: React.FC = React.memo(() => {
  const listContext = React.useContext(ListContext)
  const { data, refetch } = listContext

  if (!data) return null
  const { list, networkStatus } = data

  const { loading: newItemLoading, data: newItemData } = useSubscription(
    NEW_ITEM_IN_LIST_SUBSCRIPTION,
  )
  console.log(newItemData)

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

  // Need to represent it like this for the SectionList
  //TODO: classify these items for each department in the grocery store
  let itemsData: any[] = []
  if (list.items.length > 0) {
    itemsData = [
      {
        title: 'Other',
        data: list.items,
      },
    ]
  }

  const handleDeleteItem = (data: any) => {
    const item: Item = data.item
    deleteItem({
      variables: {
        itemId: item.id,
      },
    })
  }

  return (
    <View style={styles.container}>
      <AddItemInput />

      <SectionList
        sections={itemsData}
        renderSectionHeader={({ section: { title } }) => (
          <SectionCell title={title} />
        )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
})

export default ItemsList
