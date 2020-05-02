import * as React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { ListCellNavigationProp } from '../../navigator/types'

import { useMutation } from '@apollo/react-hooks'
import { DELETE_LIST_MUTATION } from '../../queries/deleteList'
import * as DeleteListTypes from '../../queries/__generated__/DeleteList'

import { listActionSheet } from '../../helpers/ListActions'
import { List } from '../../types/List'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

interface Props {
  list: List
  navigation: ListCellNavigationProp
  refetchList: () => void
}

const ListCell: React.FC<Props> = React.memo(
  ({ list, navigation, refetchList }: Props) => {
    const { name, itemsCount } = list

    //TODO figure out how to avoid needing to share this useMutation
    // everywhere and just do it in listActionSheet()
    const [deleteList] = useMutation<
      DeleteListTypes.DeleteList,
      DeleteListTypes.DeleteListVariables
    >(DELETE_LIST_MUTATION, {
      onCompleted: (data) => {
        if (data.deleteList?.id) {
          refetchList()
        }
      },
    })

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate('ListView', { list })}
        onLongPress={() => listActionSheet(list, deleteList)}>
        <View style={styles.container}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>{itemsCount} items</Text>
        </View>
      </TouchableOpacity>
    )
  },
)

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
