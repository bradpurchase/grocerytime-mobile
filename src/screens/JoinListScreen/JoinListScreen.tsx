import * as React from 'react'
import { ActivityIndicator } from 'react-native'
import { RouteProp } from '@react-navigation/native'

import {
  RootStackParamList,
  JoinListNavigationProp,
} from '../../types/Navigation'
import { List } from '../../types'

import { useQuery, useMutation } from '@apollo/react-hooks'
import { SHAREABLE_LIST_QUERY } from '../../queries/list'
import { JOIN_LIST_MUTATION } from '../../queries/joinList'
import * as JoinListMutationTypes from '../../queries/__generated__/JoinList'

import AuthContext, { AuthContextProps } from '../../context/AuthContext'

interface Props {
  route: RouteProp<RootStackParamList, 'JoinList'>
  navigation: JoinListNavigationProp
}

const JoinListScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const authContext: AuthContextProps = React.useContext(AuthContext)

    const listId = route.params.id
    const list: List = { id: listId }
    const {
      loading,
      data: sharableListData,
      error: sharableListQueryError,
    } = useQuery(SHAREABLE_LIST_QUERY, {
      variables: { id: listId },
    })
    if (sharableListQueryError) console.log(sharableListQueryError)

    const [joinList] = useMutation<
      JoinListMutationTypes.JoinList,
      JoinListMutationTypes.JoinListVariables
    >(JOIN_LIST_MUTATION)

    React.useEffect(() => {
      if (loading) return
      if (authContext.user?.token && authContext.user.token.length > 0) {
        console.log('we have token, just join and redirect to list')
        joinList({
          variables: {
            listId: listId,
          },
        }).then((data) => {
          console.log('here', data)
          navigation.replace('ListView', { list })
        })
      } else {
        navigation.navigate('Signup', {
          list: {
            id: listId,
            name: sharableListData.sharableList.name,
          } as List,
        })
      }
    }, [loading])

    if (!loading) return <ActivityIndicator size="large" />
  },
)

export default JoinListScreen
