import * as React from 'react'
import { ScrollView, View, TouchableOpacity, Text } from 'react-native'
import { List, ListUser } from '../../types'

import { useTheme } from '@react-navigation/native'

interface Props {
  list: List
}

const ListUsersActionSheet: React.FC<Props> = React.memo(({ list }) => {
  const { colors } = useTheme()

  return (
    <View style={{ backgroundColor: colors.background }}>
      <View
        style={{
          padding: 20,
        }}>
        <Text
          style={{
            color: colors.primary,
            fontSize: 18,
            fontWeight: '700',
            textAlign: 'center',
          }}>
          People in this list
        </Text>
      </View>
      <ScrollView
        style={{
          backgroundColor: colors.card,
          borderRadius: 8,
          margin: 8,
          marginTop: 0,
          marginBottom: 40,
        }}>
        {list.listUsers?.map((listUser: ListUser) => (
          <View
            key={listUser.userId}
            style={{
              backgroundColor: colors.card,
              flexDirection: 'row',
              padding: 20,
            }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: '500',
                flexDirection: 'column',
              }}>
              {listUser.user?.email}
            </Text>
            {listUser.creator && (
              <Text
                style={{
                  color: colors.subtitle,
                  fontSize: 14,
                  fontWeight: '500',
                  flexDirection: 'column',
                  marginLeft: 5,
                  lineHeight: 20,
                }}>
                (creator)
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  )
})

export default ListUsersActionSheet
