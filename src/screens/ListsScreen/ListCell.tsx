import * as React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { useTheme } from '@react-navigation/native'

import { ListCellNavigationProp } from '../../types/Navigation'

import { useMutation } from '@apollo/react-hooks'
import { DELETE_LIST_MUTATION } from '../../queries/deleteList'
import * as DeleteListTypes from '../../queries/__generated__/DeleteList'

import AuthContext from '../../context/AuthContext'
import { List } from '../../types/List'

interface Props {
  list: List
  navigation: ListCellNavigationProp
  refetchList: () => void
}

const ListCell: React.FC<Props> = React.memo(
  ({ list, navigation, refetchList }: Props) => {
    const { colors } = useTheme()

    const authContext = React.useContext(AuthContext)
    const currentUserId = authContext.user?.id as string

    const { name, trip } = list

    //TODO figure out how to avoid needing to share this useMutation
    // everywhere and just do it in listActionSheet()
    const [deleteList] = useMutation<
      DeleteListTypes.DeleteList,
      DeleteListTypes.DeleteListVariables
    >(DELETE_LIST_MUTATION, {
      onCompleted: (data) => {
        console.log(data)
        if (data.deleteList?.id) {
          console.log('calling refetchList()')
          refetchList()
        }
      },
    })

    return (
      <TouchableOpacity
        style={{
          backgroundColor: colors.card,
          borderRadius: 8,
          flex: 1,
          marginHorizontal: 10,
          marginBottom: 10,
          padding: 20,
        }}
        activeOpacity={1}
        onPress={() => navigation.navigate('ListView', { list })}>
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
          }}>
          {name}
        </Text>
        <Text
          style={{
            color: colors.subtitle,
            fontSize: 16,
          }}>
          {trip.itemsCount} items
        </Text>
      </TouchableOpacity>
    )
  },
)
export default ListCell
