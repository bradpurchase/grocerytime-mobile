import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import { ListCellNavigationProp } from '../../navigator/types'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

interface List {
  id: string
  name: string
}

interface Props {
  list: List
  navigation: ListCellNavigationProp
}

const ListCell: React.FC<Props> = ({ list, navigation }: Props) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('ListView', { list })}>
      <View style={styles.container}>
        <Text style={styles.title}>{list.name}</Text>
        <Text style={styles.subtitle}>{list.id}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    flex: 1,
    marginBottom: 10,
    padding: 20,
    width: '100%',
  },
  title: {
    color: colors.BLACK,
    fontFamily: fonts.REGULAR,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 40,
  },
  subtitle: {
    color: colors.DARK_GREY,
    fontFamily: fonts.REGULAR,
    fontSize: 15,
  },
})

export default ListCell
