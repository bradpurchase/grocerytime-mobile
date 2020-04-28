import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { Item } from './types'
import Checkbox from '../../components/Checkbox'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

interface Props {
  item: Item
}

const ItemCell: React.FC<Props> = React.memo(({ item }) => {
  const { name, quantity } = item

  const [checked, setChecked] = React.useState(false)

  return (
    <View style={styles.container}>
      <Checkbox checked={checked} onPress={() => setChecked(!checked)} />
      <Text
        style={StyleSheet.flatten([
          styles.title,
          checked && styles.strikedTitle,
        ])}
        onPress={() => setChecked(!checked)}>
        {name} {quantity > 1 && `(${quantity})`}
      </Text>
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
