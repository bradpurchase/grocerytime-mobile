import * as React from 'react'
import { View, TouchableOpacity, Text, Alert } from 'react-native'
import { useTheme } from '@react-navigation/native'

import { useMutation } from '@apollo/react-hooks'
import { UPDATE_ITEM_MUTATION } from '../../queries/updateItem'
import * as UpdateItemTypes from '../../queries/__generated__/UpdateItem'
import { DELETE_ITEM_MUTATION } from '../../queries/deleteItem'
import * as DeleteItemTypes from '../../queries/__generated__/DeleteItem'
import { LIST_QUERY } from '../../queries/list'

import ItemContext from '../../context/ItemContext'
import { Item, List } from '../../types'

const QuantityStepper: React.FC = React.memo(() => {
  const { colors } = useTheme()

  const itemContext = React.useContext(ItemContext)
  const { id, listId, quantity, completed } = itemContext

  const [itemQuantity, setItemQuantity] = React.useState<number>(quantity)

  const [updateItem] = useMutation<
    UpdateItemTypes.UpdateItem,
    UpdateItemTypes.UpdateItemVariables
  >(UPDATE_ITEM_MUTATION, {
    optimisticResponse: {
      __typename: 'Mutation',
      updateItem: {
        __typename: 'Item',
        id: id,
        quantity: itemQuantity,
        completed: completed,
      },
    },
  })

  const [deleteItem, { error }] = useMutation<
    DeleteItemTypes.DeleteItem,
    DeleteItemTypes.DeleteItemVariables
  >(DELETE_ITEM_MUTATION, {
    update(cache, { data }) {
      const listData: any = cache.readQuery({
        query: LIST_QUERY,
        variables: {
          id: listId,
        },
      })
      const list: List = listData.list
      cache.writeQuery({
        query: LIST_QUERY,
        data: {
          list: {
            ...list,
            items: list.items?.filter(
              (item: Item) => item.id !== data?.deleteItem?.id,
            ),
          },
        },
      })
    },
  })
  if (error) console.log(error)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setItemQuantity(newQuantity)
      updateItem({ variables: { itemId: id, quantity: newQuantity } })
    } else if (newQuantity === 0) {
      Alert.alert(
        'Delete item?',
        'Setting the quantity to zero will delete the item. Are you sure you want to do this?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel pressed...'),
            style: 'cancel',
          },
          {
            text: 'Delete Item',
            onPress: () => handleDeleteItem(),
            style: 'destructive',
          },
        ],
      )
    }
  }

  const handleDeleteItem = () => {
    //TODO implement this...
    console.log('[handleDeleteItem] Delete item...')
    deleteItem({
      variables: {
        itemId: id,
      },
    })
  }

  return (
    <View style={{ flexDirection: 'column' }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderColor: colors.primary,
            borderWidth: 1,
            borderRadius: 64,
            width: 40,
            height: 40,
          }}
          onPress={() => handleQuantityChange(itemQuantity - 1)}>
          <Text style={{ fontSize: 22, color: colors.text }}>-</Text>
        </TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
          }}>
          <Text style={{ fontSize: 14, color: colors.subtitle }}>
            {itemQuantity}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderColor: colors.primary,
            borderWidth: 1,
            borderRadius: 64,
            width: 42,
            height: 40,
          }}
          onPress={() => handleQuantityChange(itemQuantity + 1)}>
          <Text style={{ fontSize: 22, color: colors.text }}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
})

export default QuantityStepper
