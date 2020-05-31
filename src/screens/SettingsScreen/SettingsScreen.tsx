import * as React from 'react'
import { View, Text, TouchableOpacity, SectionList, Alert } from 'react-native'
import { useTheme } from '@react-navigation/native'

import { SettingsNavigationProp } from '../../types/Navigation'

import AuthContext from '../../context/AuthContext'

import SettingsCell from './SettingsCell'

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
        onPress: () => handleLogout(),
      },
    ])

  const handleLogout = () => {
    authContext.logout()
    navigation.pop()
  }

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
    })
  }, [])

  const settingsData = [
    // {
    //   title: 'Appearance',
    //   data: [
    //     {
    //       key: 'settings.appearance',
    //       name: 'Theme',
    //       type: 'screen',
    //       screen: 'AppearanceSettings',
    //     },
    //   ],
    // },
    {
      title: 'Adding items',
      data: [
        {
          key: 'settings.autoCapitalize',
          name: 'Capitalize first letter of each word',
          type: 'switch',
        },
        {
          key: 'settings.autoCorrect',
          name: 'Use autocorrect',
          type: 'switch',
        },
      ],
    },
  ]

  return (
    <View
      style={{
        flex: 1,
        marginTop: 20,
      }}>
      <SectionList
        sections={settingsData}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            style={{
              color: colors.subtitle,
              fontSize: 13,
              fontWeight: '500',
              padding: 10,
              paddingHorizontal: 18,
              textTransform: 'uppercase',
            }}>
            {title}
          </Text>
        )}
        renderItem={({ item }: any) => (
          <SettingsCell key={item.key} setting={item} />
        )}
        contentContainerStyle={{ flexGrow: 1 }}
        ListFooterComponent={() => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              backgroundColor: colors.card,
              borderRadius: 8,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 18,
              paddingVertical: 20,
              marginTop: 30,
              marginHorizontal: 8,
            }}
            onPress={() => logoutAlert()}>
            <Text
              style={{
                color: colors.primary,
                fontSize: 16,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}>
              Log Out
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
})

export default SettingsScreen
