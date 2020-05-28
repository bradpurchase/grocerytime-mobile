import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  TextInput,
  Alert,
} from 'react-native'
import { RouteProp, useTheme } from '@react-navigation/native'

import {
  RootStackParamList,
  SettingsNavigationProp,
} from '../../types/Navigation'

import AuthContext from '../../context/AuthContext'

import ScreenTitle from '../../components/ScreenTitle'

interface Props {
  navigation: SettingsNavigationProp
}

const SettingsScreen: React.FC<Props> = React.memo(({ navigation }) => {
  const { colors } = useTheme()

  const authContext = React.useContext(AuthContext)

  const logoutAlert = () =>
    Alert.alert('Log out?', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel pressed'),
        style: 'cancel',
      },
      {
        text: 'Log Out',
        onPress: () => authContext.logout(),
      },
    ])

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            width: 70,
          }}
          onPress={() => navigation.goBack()}>
          <Text
            style={{
              color: colors.primary,
              fontSize: 16,
            }}>
            Cancel
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            width: 75,
          }}
          onPress={() => logoutAlert()}>
          <Text
            style={{
              color: colors.primary,
              fontSize: 16,
            }}>
            Log Out
          </Text>
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
      <ScreenTitle title="Settings" />
    </View>
  )
})

export default SettingsScreen
