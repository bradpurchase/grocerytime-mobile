import * as React from 'react'
import { View, TextInput, StyleSheet, ActivityIndicator } from 'react-native'
import { RouteProp } from '@react-navigation/native'

import { RootStackParamList } from '../../navigator/types'

import { useQuery } from '@apollo/react-hooks'
import { LIST_QUERY } from '../../queries/list'

import ListContext from '../../context/ListContext'
import ItemsList from './ItemsList'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

interface Props {
  route: RouteProp<RootStackParamList, 'ListView'>
}

const ListViewScreen: React.FC<Props> = ({ route }: Props) => {
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
        <TextInput
          placeholder="Add an item to this list..."
          placeholderTextColor="#666"
          style={styles.textInput}
        />
        <ItemsList />
      </View>
    </ListContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: colors.BLACK,
    fontFamily: fonts.REGULAR,
    fontSize: 16,
    margin: 20,
    height: 60,
    paddingHorizontal: 24,
  },
})

export default ListViewScreen
