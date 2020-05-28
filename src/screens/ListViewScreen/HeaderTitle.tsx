import * as React from 'react'
import { Text, View } from 'react-native'
import { useTheme } from '@react-navigation/native'

import { List } from '../../types'
import { listIsShared } from '../../services/list'

interface Props {
  list: List
  isCreator: boolean
}

const HeaderTitle: React.FC<Props> = React.memo(
  ({ list, isCreator }: Props) => {
    const { colors } = useTheme()

    const listUsers = list.listUsers
    const numShared = listUsers && listUsers.length - 1 // subtract one to exclude the current user

    return (
      <View>
        <Text
          numberOfLines={1}
          style={{
            color: colors.primary,
            fontSize: 16,
            fontWeight: '700',
            textAlign: 'center',
          }}>
          {list.name}
        </Text>
        {listIsShared(list) && (
          <Text
            style={{
              textAlign: 'center',
              color: colors.subtitle,
              fontSize: 12,
              fontWeight: '400',
            }}>
            Shared with{' '}
            {isCreator ? (
              <>
                {numShared} {numShared && numShared > 1 ? 'people' : 'person'}
              </>
            ) : (
              <>you</>
            )}
          </Text>
        )}
      </View>
    )
  },
)

export default HeaderTitle
