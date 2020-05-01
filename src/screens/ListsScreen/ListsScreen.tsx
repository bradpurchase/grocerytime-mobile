import * as React from 'react'
import {
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native'

import { useQuery } from '@apollo/react-hooks'
import { ME_QUERY } from '../../queries/me'

import { ListCellNavigationProp } from '../../navigator/types'
import AuthContext from '../../context/AuthContext'

import ListCell from './ListCell'

interface Props {
  navigation: ListCellNavigationProp
}

const ListsScreen: React.FC<Props> = React.memo(({ navigation }: Props) => {
  const { loading, data, refetch } = useQuery(ME_QUERY)
  const authContext = React.useContext(AuthContext)

  React.useEffect(() => {
    const refetchOnFocus = navigation.addListener('focus', () => {
      refetch()
    })
    return refetchOnFocus
  }, [navigation])

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => authContext.logout()}>
          <Image
            style={styles.icon}
            source={require('../../assets/icons/Settings.png')}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.push('NewList')}>
          <Image
            style={styles.icon}
            source={require('../../assets/icons/PlusWhite.png')}
          />
        </TouchableOpacity>
      ),
    })
  }, [])

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data.me.lists}
          renderItem={({ item: list }) => (
            <ListCell key={list.id} list={list} navigation={navigation} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={data.networkStatus === 4}
              onRefresh={() => refetch()}
            />
          }
        />
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
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

export default ListsScreen