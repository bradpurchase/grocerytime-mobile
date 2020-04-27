import * as React from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  InteractionManager,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'

import { RootStackParamList } from '../../navigator/types'

import { useQuery } from '@apollo/react-hooks'
import { LIST_QUERY } from '../../queries/list'

import ListContext from '../../context/ListContext'
import ItemsList from './ItemsList'
import AddItemInput from './AddItemInput'

interface Props {
  route: RouteProp<RootStackParamList, 'ListView'>
}

const ListViewScreen: React.FC<Props> = React.memo(({ route }: Props) => {
  const { loading, data, refetch } = useQuery(LIST_QUERY, {
    variables: { id: route.params.list.id },
  })

  if (loading) {
    return (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
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
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default ListViewScreen
