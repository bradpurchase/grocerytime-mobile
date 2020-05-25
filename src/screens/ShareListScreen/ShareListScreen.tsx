import * as React from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'

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

const ShareListScreen: React.FC<Props> = React.memo(
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
            onPress={() => navigation.navigate('ListView', { list })}>
            <Text
              style={{
                color: '#fff',
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
        style={{
          flex: 1,
          marginTop: 40,
          padding: 20,
        }}>
        <Text
          style={{
            color: colors.text,
            textAlign: 'center',
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 30,
          }}>
          Your list was created!
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: colors.subtitle,
            fontSize: 16,
            lineHeight: 22,
            marginBottom: 30,
          }}>
          Next, share this list with others. Tap the button below to share this
          list using your method of choice. Once shared, you can collaborate on
          it together and see updates in real time.
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: colors.subtitle,
            fontSize: 16,
            lineHeight: 22,
            marginBottom: 30,
          }}>
          You can also receive notifications when new items are added to this
          list by other members. Simply make sure notifications are enabled for
          GroceryTime!
        </Text>
        <View style={{ marginTop: 10 }}>
          <Button
            label="Share this List"
            onPress={() => shareActionSheet(list)}
          />
        </View>
      </ScrollView>
    )
  },
)

export default ShareListScreen
