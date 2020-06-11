import * as React from 'react'
import { ActivityIndicator, Image, TouchableOpacity, Text } from 'react-native'
import { RouteProp, useTheme } from '@react-navigation/native'

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
import { currentUserIsCreator } from '../../services/list'

import TripView from './TripView'
import HeaderTitle from './HeaderTitle'

interface Props {
  route: RouteProp<RootStackParamList, 'ListView'>
  navigation: ListViewNavigationProp
}

const ListViewScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const { colors } = useTheme()

    const authContext = React.useContext(AuthContext)
    const currentUserId = authContext.user?.id as string

    const listParam: List = route.params.list
    const shouldDismiss: boolean | undefined = route.params.dismiss

    const { loading, data, refetch, subscribeToMore } = useQuery(LIST_QUERY, {
      variables: { id: listParam.id },
    })

    React.useEffect(() => {
      const refetchOnFocus = navigation.addListener('focus', () => {
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

    React.useLayoutEffect(() => {
      if (shouldDismiss) {
        navigation.setOptions({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 10,
                width: 85,
              }}
              onPress={() => navigation.navigate('Lists')}>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 16,
                }}>
                Dismiss
              </Text>
            </TouchableOpacity>
          ),
        })
      }
    }, [shouldDismiss])

    React.useLayoutEffect(() => {
      if (data) {
        const isCreator: boolean = currentUserIsCreator(
          currentUserId,
          data.list,
        )
        if (isCreator) {
          navigation.setOptions({
            headerTitle: () => (
              <HeaderTitle list={data.list} isCreator={true} />
            ),
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
                    data.list,
                    () => {
                      navigation.navigate('RenameList', { list: data.list })
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
            headerTitle: () => (
              <HeaderTitle list={data.list} isCreator={false} />
            ),
            headerRight: () => <></>,
          })
        }
      }
    }, [navigation, data])

    if (loading) return <ActivityIndicator size="large" />

    return (
      <ListContext.Provider value={{ data, refetch, subscribeToMore }}>
        <TripView />
      </ListContext.Provider>
    )
  },
)

export default ListViewScreen
