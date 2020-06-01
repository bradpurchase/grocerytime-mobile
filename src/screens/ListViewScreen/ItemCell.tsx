import * as React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Alert,
  ActionSheetIOS,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@react-navigation/native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import { Item, List } from '../../types'
import Checkbox from '../../components/Checkbox'
import QuantityStepper from './QuantityStepper'

import ListContext from '../../context/ListContext'
import ItemContext from '../../context/ItemContext'

import { useMutation } from '@apollo/react-hooks'
import { UPDATE_ITEM_MUTATION } from '../../queries/updateItem'
import { DELETE_ITEM_MUTATION } from '../../queries/deleteItem'
import * as DeleteItemTypes from '../../queries/__generated__/DeleteItem'
import { LIST_QUERY } from '../../queries/list'

interface Props {
  item: Item
}

const ItemCell: React.FC<Props> = React.memo(({ item }) => {
  const { colors } = useTheme()

  const { id, listId, name, quantity, completed } = item

  const [editingMode, setEditingMode] = React.useState<boolean>(false)
  const [itemName, setItemName] = React.useState<string>(name)

  const listContext = React.useContext(ListContext)
  const { refetch } = listContext

  const [updateItem] = useMutation(UPDATE_ITEM_MUTATION, {
    optimisticResponse: {
      __typename: 'Mutation',
      updateItem: {
        __typename: 'Item',
        id: id,
        listId: listId,
        completed: completed,
        name: itemName,
        quantity: quantity,
      },
    },
    onCompleted: () => {
      setEditingMode(false)
      refetch()
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

  React.useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [editingMode])

  const handleMenuButtonTapped = () => {
    ReactNativeHapticFeedback.trigger('impactLight')
    return ActionSheetIOS.showActionSheetWithOptions(
      {
        title: item.name,
        options: [
          'Move to next trip...',
          'Include in each trip...',
          'Delete item...',
          'Dismiss',
        ],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 3,
      },
      (buttonIdx) => {
        if (buttonIdx === 1) {
          handleDeleteButtonTapped()
        }
      },
    )
  }

  const handleDeleteButtonTapped = () => {
    ReactNativeHapticFeedback.trigger('impactLight')
    Alert.alert('Delete item?', 'Are you sure you want to delete this item?', [
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
    ])
  }

  const handleDeleteItem = () => {
    deleteItem({
      variables: {
        itemId: id,
      },
    })
  }

  return (
    <ItemContext.Provider value={item}>
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 8,
          flex: 1,
          flexDirection: 'column',
          padding: 18,
          paddingVertical: 20,
          marginHorizontal: 8,
          marginBottom: 8,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={completed ? () => {} : () => setEditingMode(!editingMode)}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}>
            <Checkbox
              checked={completed}
              disabled={editingMode}
              onPress={() =>
                updateItem({
                  variables: {
                    itemId: id,
                    completed: !completed,
                  },
                })
              }
            />
            {editingMode ? (
              <TextInput
                style={{
                  backgroundColor: 'transparent',
                  flexDirection: 'column',
                  fontSize: 16,
                  fontWeight: '500',
                  marginLeft: 15,
                  width: 200,
                }}
                defaultValue={name}
                returnKeyType="done"
                onChangeText={(text) => setItemName(text)}
                onSubmitEditing={() =>
                  updateItem({
                    variables: {
                      itemId: id,
                      name: itemName,
                    },
                  })
                }
                autoCorrect={false}
                autoCapitalize="words"
              />
            ) : (
              <>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: '500',
                    flexDirection: 'column',
                    marginLeft: 15,
                    lineHeight: 20,
                    textDecorationLine: completed ? 'line-through' : 'none',
                  }}>
                  {itemName}
                </Text>
                {quantity > 1 && (
                  <Text
                    style={{
                      color: colors.subtitle,
                      fontSize: 14,
                      fontWeight: '500',
                      flexDirection: 'column',
                      marginLeft: 5,
                      lineHeight: 20,
                    }}>
                    ({quantity})
                  </Text>
                )}
              </>
            )}
          </View>

          {editingMode && !completed && (
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                flex: 1,
              }}>
              <QuantityStepper />
              <View
                style={{
                  alignSelf: 'center',
                  flex: 1,
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                {/* <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    position: 'absolute',
                    right: 45,
                  }}
                  onPress={() => handleMenuButtonTapped()}>
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                    }}
                    resizeMode="contain"
                    source={require('../../assets/icons/More.png')}
                  />
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    position: 'absolute',
                    right: 0,
                  }}
                  onPress={() => handleDeleteButtonTapped()}>
                  <FastImage
                    style={{
                      width: 25,
                      height: 25,
                    }}
                    resizeMode="contain"
                    source={require('../../assets/icons/Delete.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ItemContext.Provider>
  )
})

export default ItemCell
