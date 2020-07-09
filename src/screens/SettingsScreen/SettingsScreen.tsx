import * as React from 'react'
import { View, Text, TouchableOpacity, SectionList, Alert } from 'react-native'
import { useTheme } from '@react-navigation/native'

import i18n from '../../i18n'
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
    Alert.alert(
      i18n.t('auth.log_out_prompt_heading'),
      i18n.t('auth.log_out_prompt_body'),
      [
        {
          text: i18n.t('global.cancel'),
          onPress: () => console.log('Cancel pressed'),
          style: 'cancel',
        },
        {
          text: i18n.t('auth.log_out'),
          onPress: () => handleLogout(),
        },
      ],
    )

  const handleLogout = () => {
    authContext.logout()
  }

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
      title: i18n.t('settings.editing'),
      data: [
        {
          key: 'settings.autoCapitalize',
          name: i18n.t('settings.auto_capitalize'),
          type: 'switch',
        },
        {
          key: 'settings.autoCorrect',
          name: i18n.t('settings.auto_correct'),
          type: 'switch',
        },
      ],
    },
  ]

  return (
    <View
      style={{
        flex: 1,
        marginTop: 30,
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
          <>
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
                {i18n.t('auth.log_out')}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: colors.subtitle,
                fontSize: 14,
                marginTop: 30,
                textAlign: 'center',
              }}>
              GroceryTime 1.0.0 beta 6
            </Text>
          </>
        )}
      />
    </View>
  )
})

export default SettingsScreen
