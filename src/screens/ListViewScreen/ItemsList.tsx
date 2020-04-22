import * as React from 'react'
import { View, FlatList, RefreshControl, Text, StyleSheet } from 'react-native'

import ListContext from '../../context/ListContext'

import EmptyState from '../../components/EmptyState'

const ItemsList: React.FC = () => {
  const listContext = React.useContext(ListContext)
  const { data, refetch } = listContext

  if (!data) return null
  const { list, networkStatus } = data

  return (
    <View style={styles.container}>
      <FlatList
        data={list.items}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            title="No items"
            body="Add your first item by typing above."
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={networkStatus === 4}
            onRefresh={() => refetch()}
          />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default ItemsList
