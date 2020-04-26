import * as React from 'react'
import { View, SectionList, RefreshControl, Text, StyleSheet } from 'react-native'

import ListContext from '../../context/ListContext'

import EmptyState from '../../components/EmptyState'
import ItemCell from './ItemCell'
import fonts from '../../styles/fonts'

const ItemsList: React.FC = () => {
  const listContext = React.useContext(ListContext)
  const { data, refetch } = listContext

  if (!data) return null
  const { list, networkStatus } = data

  // Need to represent it like this for the SectionList
  //TODO: classify these items for each department in the grocery store
  let itemsData: any[] = []
  if (list.items.length > 0) {
    itemsData = [{
      title: "Other",
      data: list.items,
    }]
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={itemsData}
        renderSectionHeader={({ section: { title }}) => <Text style={styles.sectionHeader}>{title}</Text>}
        renderItem={({ item }) => <ItemCell item={item} />}
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
  sectionHeader: {
    fontSize: 16,
    fontFamily: fonts.REGULAR,
    fontWeight: '500',
    padding: 20,
    paddingHorizontal: 20,
  }
})

export default ItemsList
