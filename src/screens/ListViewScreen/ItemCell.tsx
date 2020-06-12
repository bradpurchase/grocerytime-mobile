import * as React from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useTheme } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import { Item, List } from '../../types'
import Checkbox from './Checkbox'
import QuantityStepper from './QuantityStepper'

import ListContext from '../../context/ListContext'
import ItemContext from '../../context/ItemContext'

import { useMutation } from '@apollo/react-hooks'
import { UPDATE_ITEM_MUTATION } from '../../queries/updateItem'
import { DELETE_ITEM_MUTATION } from '../../queries/deleteItem'
import * as DeleteItemTypes from '../../queries/__generated__/DeleteItem'
import { LIST_QUERY } from '../../queries/list'

import { getSettingValue } from '../../services/settings'

interface EditItemInputSettings {
  autoCapitalize: boolean
  autoCorrect: boolean
}

interface Props {
  item: Item
  drag: any
}

const ItemCell: React.FC<Props> = React.memo(({ item, drag }) => {
  const { colors } = useTheme()

  const { id, groceryTripId, name, quantity, completed } = item

  const [editingMode, setEditingMode] = React.useState<boolean>(false)
  const [itemName, setItemName] = React.useState<string>(name)

  const [settings, setSettings] = React.useState<EditItemInputSettings>({
    autoCapitalize: true,
    autoCorrect: false,
  })

  const listContext = React.useContext(ListContext)
  const { data, refetch } = listContext

  React.useEffect(() => {
    setItemName(item.name)
  }, [item])

  const [updateItem] = useMutation(UPDATE_ITEM_MUTATION, {
    optimisticResponse: {
      __typename: 'Mutation',
      updateItem: {
        __typename: 'Item',
        id: id,
        groceryTripId: groceryTripId,
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
    update(cache, { data: deleteItemdata }) {
      const listData: any = cache.readQuery({
        query: LIST_QUERY,
        variables: {
          id: data.list.id,
        },
      })
      const list: List = listData.list
      cache.writeQuery({
        query: LIST_QUERY,
        data: {
          list: {
            ...list,
            trip: {
              ...list.trip,
              items: list.trip.items?.filter(
                (item: Item) => item.id !== deleteItemdata?.deleteItem?.id,
              ),
            },
          },
        },
      })
    },
  })
  if (error) console.log(error)

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

  const getSettings = async () => {
    const autoCapitalize = await getSettingValue('settings.autoCapitalize')
    const autoCorrect = await getSettingValue('settings.autoCorrect')
    if (autoCapitalize !== null && autoCorrect !== null) {
      setSettings({ autoCapitalize, autoCorrect })
    }
  }

  React.useEffect(() => {
    getSettings()
  }, [])

  return (
    <ItemContext.Provider value={item}>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          backgroundColor: colors.card,
          borderRadius: 8,
          flex: 1,
          flexDirection: 'column',
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
                marginLeft: 5,
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
              autoCorrect={settings.autoCorrect ?? false}
              autoCapitalize={settings.autoCapitalize ? 'words' : 'sentences'}
            />
          ) : (
            <View style={{ paddingTop: 20, flexDirection: 'row' }}>
              <Text
                numberOfLines={2}
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '500',
                  flexDirection: 'column',
                  marginLeft: 5,
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
            </View>
          )}
        </View>

        {editingMode && !completed && (
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              padding: 20,
              paddingTop: 10,
            }}>
            <QuantityStepper />
            <View
              style={{
                alignSelf: 'center',
                flex: 1,
                justifyContent: 'center',
                flexDirection: 'column',
              }}>
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
