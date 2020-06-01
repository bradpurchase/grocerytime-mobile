import * as React from 'react'
import { View, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import { RouteProp } from '@react-navigation/native'

import {
  RootStackParamList,
  ListViewNavigationProp,
} from '../../types/Navigation'
import { List } from '../../types/List'

import { useQuery, useMutation } from '@apollo/react-hooks'
import { LIST_QUERY } from '../../queries/list'
import { NEW_ITEM_IN_LIST_SUBSCRIPTION } from '../../queries/newItemInList'
import { DELETE_LIST_MUTATION } from '../../queries/deleteList'
import * as DeleteListTypes from '../../queries/__generated__/DeleteList'

import AuthContext from '../../context/AuthContext'
import ListContext from '../../context/ListContext'
import { listActionSheet } from '../../helpers/ListActions'
import { currentUserIsCreator } from '../../services/list'

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

    const { loading, data, refetch, subscribeToMore } = useQuery(LIST_QUERY, {
      variables: { id: listParam.id },
    })

    React.useEffect(() => {
      const refetchOnFocus = navigation.addListener('focus', () => {
        console.log(`[refetchOnFocus] refetching list...`)
        refetch()
      })
      return refetchOnFocus
    }, [navigation])

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
      subscribeToMore({
        document: NEW_ITEM_IN_LIST_SUBSCRIPTION,
        variables: { listId: data?.list.id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const newItem = subscriptionData.data.newItemInList

          return Object.assign({}, prev, {
            list: {
              ...list,
              items: [newItem, ...prev.list.items],
            },
          })
        },
      })
    }, [])

    React.useLayoutEffect(() => {
      if (loading) return
      if (isCreator) {
        navigation.setOptions({
          headerTitle: () => <HeaderTitle list={list} isCreator={true} />,
          headerRight: () => (
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 10,
                width: 50,
              }}
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
                style={{
                  justifyContent: 'center',
                  resizeMode: 'contain',
                }}
                source={require('../../assets/icons/MenuVertical.png')}
              />
            </TouchableOpacity>
          ),
        })
      } else {
        navigation.setOptions({
          headerTitle: () => <HeaderTitle list={list} isCreator={false} />,
          headerRight: () => <></>,
        })
      }
    }, [navigation, loading])

    if (loading) return <ActivityIndicator size="large" />

    return (
      <ListContext.Provider value={{ data, refetch }}>
        <ItemsList />
      </ListContext.Provider>
    )
  },
)

export default ListViewScreen
