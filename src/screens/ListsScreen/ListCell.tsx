import * as React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { ListCellNavigationProp } from '../../navigator/types'

import { listActionSheet } from '../../helpers/ListActions'
import { List } from '../../types/List'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

interface Props {
  list: List
  navigation: ListCellNavigationProp
}

const ListCell: React.FC<Props> = React.memo(({ list, navigation }: Props) => {
  const { name, itemsCount } = list

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => navigation.navigate('ListView', { list })}
      onLongPress={() => listActionSheet(list)}>
      <View style={styles.container}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>{itemsCount} items</Text>
      </View>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 20,
  },
  title: {
    color: colors.BLACK,
    fontFamily: fonts.REGULAR,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
  },
  subtitle: {
    color: colors.DARK_GREY,
    fontFamily: fonts.REGULAR,
    fontSize: 15,
  },
})

export default ListCell
