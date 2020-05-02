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
} from '../../navigator/types'

import { useQuery } from '@apollo/react-hooks'
import { LIST_QUERY } from '../../queries/list'

import ListContext from '../../context/ListContext'
import { listActionSheet } from '../../helpers/ListActions'
import { List } from '../../types/List'

import ItemsList from './ItemsList'
import AddItemInput from './AddItemInput'

interface Props {
  route: RouteProp<RootStackParamList, 'ListView'>
  navigation: ListViewNavigationProp
}

const ListViewScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const list: List = route.params.list

    const { loading, data, refetch } = useQuery(LIST_QUERY, {
      variables: { id: list.id },
    })

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => listActionSheet(list)}>
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
          <AddItemInput />
          <ItemsList />
        </View>
      </ListContext.Provider>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
