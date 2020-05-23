import * as React from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'

import {
  RootStackParamList,
  ListViewNavigationProp,
} from '../../types/Navigation'
import { List } from '../../types/List'

import { useQuery, useMutation } from '@apollo/react-hooks'
import { LIST_QUERY } from '../../queries/list'
import { DELETE_LIST_MUTATION } from '../../queries/deleteList'
import * as DeleteListTypes from '../../queries/__generated__/DeleteList'

import AuthContext from '../../context/AuthContext'
import ListContext from '../../context/ListContext'
import { listActionSheet } from '../../helpers/ListActions'
import { getListCreator, currentUserIsCreator } from '../../services/list'

import ItemsList from './ItemsList'
import HeaderTitle from './HeaderTitle'

interface Props {
  route: RouteProp<RootStackParamList, 'ListView'>
  navigation: ListViewNavigationProp
}

const ListViewScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const authContext = React.useContext(AuthContext)
    const currentUserId = authContext.user?.id as string

    const listParam: List = route.params.list

    const { loading, data, refetch } = useQuery(LIST_QUERY, {
      variables: { id: listParam.id },
    })

    const [deleteList] = useMutation<
      DeleteListTypes.DeleteList,
      DeleteListTypes.DeleteListVariables
    >(DELETE_LIST_MUTATION, {
      onCompleted: (data) => {
        if (data.deleteList?.id) {
          navigation.popToTop()
        }
      },
    })

    const list: List = data && data.list
    const isCreator: boolean = data
      ? currentUserIsCreator(currentUserId, list)
      : false

    React.useEffect(() => {
      if (loading) return
      if (isCreator) {
        navigation.setOptions({
          headerTitle: () => <HeaderTitle list={list} isCreator={isCreator} />,
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() =>
                listActionSheet(
                  list,
                  () => {
                    navigation.navigate('RenameList', { list })
                  },
                  deleteList,
                )
              }>
              <Image
                style={styles.icon}
                source={require('../../assets/icons/MenuVerticalWhite.png')}
              />
            </TouchableOpacity>
          ),
        })
      } else {
        navigation.setOptions({
          headerTitle: () => <HeaderTitle list={list} isCreator={isCreator} />,
          headerRight: () => <></>,
        })
      }
    }, [navigation])

    if (loading) {
      return (
        <View
          style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return (
      <ListContext.Provider value={{ data, refetch }}>
        <View style={styles.container}>
          <ItemsList />
        </View>
      </ListContext.Provider>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  headerButton: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: 50,
  },
  icon: {
    justifyContent: 'center',
    resizeMode: 'contain',
  },
})

export default ListViewScreen
