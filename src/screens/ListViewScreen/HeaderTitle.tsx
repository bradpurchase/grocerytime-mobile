import * as React from 'react'
import { Text, View } from 'react-native'
import colors from '../../styles/colors'

import { List, ListUser } from '../../types'

interface Props {
  loading: boolean
  list: List
}

const HeaderTitle: React.FC<Props> = React.memo(({ loading, list }: Props) => {
  if (loading) return null

  const listUsers = list.listUsers
  const isShared = listUsers?.some((listUser: ListUser) => !listUser.creator)
  const numShared = listUsers && listUsers.length - 1 // subtract one to exclude the current user

  return (
    <View>
      <Text
        numberOfLines={1}
        style={{
          color: colors.WHITE,
          fontSize: 16,
          fontWeight: '700',
          textAlign: 'center',
        }}>
        {list.name}
      </Text>
      {isShared && (
        <Text
          style={{
            textAlign: 'center',
            color: '#FED7D7',
            fontSize: 12,
            fontWeight: '400',
          }}>
          Shared with {numShared}{' '}
          {numShared && numShared > 1 ? 'people' : 'person'}
        </Text>
      )}
    </View>
  )
})

export default HeaderTitle
