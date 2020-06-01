import * as React from 'react'
import { View, RefreshControl, FlatList } from 'react-native'

import ListContext from '../../context/ListContext'

import EmptyState from '../../components/EmptyState'
import ItemCell from './ItemCell'
import AddItemInput from './AddItemInput'

const ItemsList: React.FC = React.memo(() => {
  const listContext = React.useContext(ListContext)
  const { data, refetch } = listContext
  const { list, networkStatus } = data

  return (
    <View style={{ flex: 1 }}>
      <AddItemInput />

      <FlatList
        data={list.items}
        extraData={refetch()}
        renderItem={({ item }: any) => <ItemCell key={item.id} item={item} />}
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
})
export default ItemsList
