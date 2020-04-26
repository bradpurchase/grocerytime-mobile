import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { Item } from './types'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

interface Props {
  item: Item
}

const ItemCell: React.FC<Props> = ({ item }) => {
  const { name, quantity } = item

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {name} {quantity > 1 && `(${quantity})`}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
    flex: 1,
    padding: 20,
    paddingHorizontal: 30,
  },
  title: {
    color: colors.BLACK,
    fontFamily: fonts.REGULAR,
    fontSize: 16,
    fontWeight: '400',
  },
})

export default ItemCell
