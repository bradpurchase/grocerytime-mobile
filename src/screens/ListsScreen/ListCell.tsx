import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import { ListCellNavigationProp } from '../../navigator/types'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

interface List {
  id: string
  name: string
  itemsCount: number
}

interface Props {
  list: List
  navigation: ListCellNavigationProp
}

const ListCell: React.FC<Props> = React.memo(({ list, navigation }: Props) => {
  const { name, itemsCount } = list

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('ListView', { list })}>
      <View style={styles.container}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>{itemsCount} items</Text>
      </View>
    </TouchableWithoutFeedback>
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
