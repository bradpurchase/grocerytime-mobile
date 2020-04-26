import * as React from 'react'
import {
  View,
  RefreshControl,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'

import ListContext from '../../context/ListContext'

import { useMutation } from '@apollo/react-hooks'
import { DELETE_ITEM_MUTATION } from '../../queries/deleteItem'
import * as DeleteItemTypes from '../../queries/__generated__/DeleteItem'

import EmptyState from '../../components/EmptyState'
import SectionCell from './SectionCell'
import ItemCell from './ItemCell'

import fonts from '../../styles/fonts'
import colors from '../../styles/colors'

import { Item } from './types'

const ItemsList: React.FC = () => {
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
      <SwipeListView
        useSectionList
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
        disableRightSwipe
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-100}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    color: colors.WHITE,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    fontFamily: fonts.REGULAR,
    right: 0,
  },
})

export default ItemsList
