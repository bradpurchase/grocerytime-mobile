import React from 'react'
import {
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native'

import { useQuery } from '@apollo/react-hooks'
import { ME_QUERY } from '../../queries/me'

import { ListCellNavigationProp } from '../../navigator/types'

import ListCell from './ListCell'

interface Props {
  navigation: ListCellNavigationProp
}

const ListsScreen: React.FC<Props> = ({ navigation }: Props) => {
  const { loading, data, refetch } = useQuery(ME_QUERY)

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data.me.lists}
          renderItem={({ item: list }) => (
            <ListCell list={list} navigation={navigation} />
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
})

export default ListsScreen
