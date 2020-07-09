import * as React from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'

import i18n from '../../i18n'

import { RouteProp, useTheme } from '@react-navigation/native'
import {
  RootStackParamList,
  ShareListNavigationProp,
} from '../../types/Navigation'

import { List } from '../../types/List'
import { shareActionSheet } from '../../helpers/ListActions'

import Button from '../../components/Button'

interface Props {
  route: RouteProp<RootStackParamList, 'ShareList'>
  navigation: ShareListNavigationProp
}

const ShareNewListScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const { colors } = useTheme()

    const list: List = route.params.list

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => <></>,
        headerRight: () => (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 10,
              width: 70,
            }}
            onPress={() =>
              navigation.navigate('ListView', { list, dismiss: true })
            }>
            <Text
              style={{
                color: colors.primary,
                fontSize: 16,
              }}>
              Done
            </Text>
          </TouchableOpacity>
        ),
      })
    })

    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            color: colors.text,
            textAlign: 'center',
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 30,
          }}>
          {i18n.t('lists.invite.share_after_create_heading')}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: colors.subtitle,
            fontSize: 16,
            lineHeight: 22,
            marginBottom: 30,
          }}>
          {i18n.t('lists.invite.share_after_create_body1')}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: colors.subtitle,
            fontSize: 16,
            lineHeight: 22,
            marginBottom: 30,
          }}>
          {i18n.t('lists.invite.share_after_create_body2')}
        </Text>
        <View style={{ marginTop: 10 }}>
          <Button
            label={i18n.t('lists.invite.share_this_list')}
            onPress={() => shareActionSheet(list)}
          />
        </View>
      </ScrollView>
    )
  },
)

export default ShareNewListScreen
