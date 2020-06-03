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
  drag: any
}

const ItemCell: React.FC<Props> = React.memo(({ item, drag }) => {
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

  //TODO find a way to bring this back - it messes up reordering because it rerenders
  // React.useEffect(() => {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  // }, [editingMode])

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
      <TouchableOpacity
        activeOpacity={1}
        style={{
          backgroundColor: colors.card,
          borderRadius: 8,
          flex: 1,
          flexDirection: 'column',
          padding: 18,
          paddingVertical: 20,
          marginHorizontal: 8,
          marginBottom: 8,
        }}
        onPress={completed ? () => {} : () => setEditingMode(!editingMode)}
        onLongPress={drag}>
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
                numberOfLines={2}
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '500',
                  flexDirection: 'column',
                  marginLeft: 15,
                  lineHeight: 20,
                  textDecorationLine: completed ? 'line-through' : 'none',
                  maxWidth: '80%',
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
    </ItemContext.Provider>
  )
})

export default ItemCell
