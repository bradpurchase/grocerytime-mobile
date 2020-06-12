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
import { LISTS_QUERY } from '../../queries/lists'

import { ListCellNavigationProp } from '../../types/Navigation'

import EmptyState from '../../components/EmptyState'
import ScreenTitle from '../../components/ScreenTitle'
import ListCell from './ListCell'

interface Props {
  navigation: ListCellNavigationProp
}

const ListsScreen: React.FC<Props> = ({ navigation }: Props) => {
  const { loading, data, refetch } = useQuery(LISTS_QUERY)

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
          onPress={() => navigation.navigate('Settings')}>
          <Image
            style={styles.icon}
            source={require('../../assets/icons/Settings.png')}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('NewList')}>
          <Image
            style={styles.icon}
            source={require('../../assets/icons/Plus.png')}
          />
        </TouchableOpacity>
      ),
    })
  }, [])

  return (
    <View
      style={{
        flex: 1,
        marginTop: 20,
      }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <ScreenTitle title="Lists" />
          <FlatList
            data={data.lists}
            extraData={refetch()}
            renderItem={({ item: list }) => (
              <ListCell
                key={list.id}
                list={list}
                navigation={navigation}
                refetchList={() => refetch()}
              />
            )}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
              <EmptyState
                title="No lists"
                body="Create your first list by tapping the + button above."
              />
            }
            refreshControl={
              <RefreshControl
                refreshing={data.networkStatus === 4}
                onRefresh={() => refetch()}
              />
            }
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
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
    width: 60,
  },
})

export default ListsScreen
