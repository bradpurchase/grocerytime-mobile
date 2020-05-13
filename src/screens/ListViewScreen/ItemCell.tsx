import * as React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@react-navigation/native'

import { Item } from './types'
import Checkbox from '../../components/Checkbox'

import { useMutation } from '@apollo/react-hooks'
import { UPDATE_ITEM_MUTATION } from '../../queries/updateItem'

import { TouchableOpacity } from 'react-native-gesture-handler'

interface Props {
  item: Item
}

const ItemCell: React.FC<Props> = React.memo(({ item }) => {
  const { colors } = useTheme()

  const { id, name, quantity, completed } = item

  const [updateItem] = useMutation(UPDATE_ITEM_MUTATION, {
    variables: {
      itemId: id,
      completed: !completed,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      updateItem: {
        __typename: 'Item',
        id: id,
        completed: !completed,
      },
    },
  })

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 8,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        marginHorizontal: 10,
        marginBottom: 10,
      }}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          flexDirection: 'row',
          width: 200,
        }}
        onPress={() => updateItem()}>
        <Checkbox checked={completed} onPress={() => updateItem()} />
        <Text
          style={{
            color: colors.text,
            fontSize: 16,
            fontWeight: '400',
            flexDirection: 'column',
            marginLeft: 15,
            textDecorationLine: completed ? 'line-through' : 'none',
          }}>
          {name} {quantity > 1 && `(${quantity})`}
        </Text>
      </TouchableOpacity>
    </View>
  )
})

export default ItemCell
