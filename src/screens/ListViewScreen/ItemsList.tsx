import * as React from 'react'
import {
  View,
  RefreshControl,
  Text,
  TouchableOpacity,
  SectionList,
  StyleSheet,
} from 'react-native'

import ListContext from '../../context/ListContext'

import { useMutation } from '@apollo/react-hooks'
import { DELETE_ITEM_MUTATION } from '../../queries/deleteItem'
import * as DeleteItemTypes from '../../queries/__generated__/DeleteItem'

import EmptyState from '../../components/EmptyState'
import SectionCell from './SectionCell'
import ItemCell from './ItemCell'

import { Item } from './types'

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
    onError: (error) => {
      console.log(error)
    },
  })

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

  const renderHiddenItem = (data: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => handleDeleteItem(data)}>
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
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
