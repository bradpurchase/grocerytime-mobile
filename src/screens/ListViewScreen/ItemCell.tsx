import * as React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native'
import { useTheme } from '@react-navigation/native'

import { Item } from '../../types'
import Checkbox from '../../components/Checkbox'
import QuantityStepper from './QuantityStepper'

import ListContext from '../../context/ListContext'
import ItemContext from '../../context/ItemContext'

import { useMutation } from '@apollo/react-hooks'
import { UPDATE_ITEM_MUTATION } from '../../queries/updateItem'

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

  React.useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [editingMode])

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
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ItemContext.Provider>
  )
})

export default ItemCell
