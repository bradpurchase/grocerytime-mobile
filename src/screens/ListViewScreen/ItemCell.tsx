import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

interface Item {
  id: string
  name: string
  quantity: number
}

interface Props {
  item: Item
}

const ItemCell: React.FC<Props> = ({ item }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name} {item.quantity > 1 && `(${item.quantity})`}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    flex: 1,
    padding: 20,
  },
  title: {
    color: colors.BLACK,
    fontFamily: fonts.REGULAR,
    fontSize: 16,
    fontWeight: '400',
  },
})

export default ItemCell