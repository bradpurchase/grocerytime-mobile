import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import Button from '../components/Button'

import AuthContext from '../context/AuthContext'

const HomeScreen: React.FC = () => {
  const authContext = useContext(AuthContext)

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Home Screen ✨</Text>
      <Button
        label="Log out"
        onPress={() => authContext.logout()}
      />
    </View>
  )
}
export default HomeScreen
