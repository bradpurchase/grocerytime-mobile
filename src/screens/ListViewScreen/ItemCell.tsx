import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { Item } from './types'
import Checkbox from '../../components/Checkbox'

import { useMutation } from '@apollo/react-hooks'
import { UPDATE_ITEM_MUTATION } from '../../queries/updateItem'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface Props {
  item: Item
}

const ItemCell: React.FC<Props> = React.memo(({ item }) => {
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
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.checkboxTapArea}
        onPress={() => updateItem()}>
        <Checkbox checked={completed} />
        <Text
          style={StyleSheet.flatten([
            styles.title,
            completed && styles.strikedTitle,
          ])}>
          {name} {quantity > 1 && `(${quantity})`}
        </Text>
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  checkboxTapArea: {
    flexDirection: 'row',
    width: 200,
  },
  title: {
    color: colors.BLACK,
    fontFamily: fonts.REGULAR,
    fontSize: 16,
    fontWeight: '400',
    flexDirection: 'column',
    marginLeft: 15,
  },
  strikedTitle: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
})

export default ItemCell
