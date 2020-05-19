import * as React from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
  RootStackParamList,
  ListViewNavigationProp,
} from '../../types/Navigation'
import { List } from '../../types/List'

import { useQuery, useMutation } from '@apollo/react-hooks'
import { LIST_QUERY } from '../../queries/list'
import { DELETE_LIST_MUTATION } from '../../queries/deleteList'
import * as DeleteListTypes from '../../queries/__generated__/DeleteList'

import ListContext from '../../context/ListContext'
import { listActionSheet } from '../../helpers/ListActions'

import ItemsList from './ItemsList'
import AddItemInput from './AddItemInput'
import HeaderTitle from './HeaderTitle'

interface Props {
  route: RouteProp<RootStackParamList, 'ListView'>
  navigation: ListViewNavigationProp
}

const ListViewScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const list: List = route.params.list

    const { loading, data, error, refetch } = useQuery(LIST_QUERY, {
      variables: { id: list.id },
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

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: () => <HeaderTitle loading={loading} list={data?.list} />,
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
