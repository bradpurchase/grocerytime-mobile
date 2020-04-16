import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { RouteProp } from '@react-navigation/native'

import { RootStackParamList } from '../navigator/types'

interface Props {
  route: RouteProp<RootStackParamList, 'ListView'>
}

const ListViewScreen: React.FC<Props> = ({ route }: Props) => {
  return (
    <View style={styles.container}>
      <Text>{route.params.list.id}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
})

export default ListViewScreen
