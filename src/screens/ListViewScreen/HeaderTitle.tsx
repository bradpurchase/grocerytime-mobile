import * as React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native'
import ActionSheet from 'react-native-actions-sheet'

import i18n from '../../i18n'

import { List } from '../../types'
import { listIsShared, listUsersCount } from '../../services/list'
import ListUsersActionSheet from './ListUsersActionSheet'

interface Props {
  list: List
  isCreator: boolean
}

const HeaderTitle: React.FC<Props> = React.memo(
  ({ list, isCreator }: Props) => {
    const { colors } = useTheme()

    const actionSheetRef = React.createRef()

    const listName = () => (
      <Text
        numberOfLines={1}
        style={{
          color: colors.primary,
          fontSize: 17,
          fontWeight: '700',
          textAlign: 'center',
          width: 250,
        }}>
        {list.name}
      </Text>
    )

    if (listIsShared(list)) {
      const numShared = listUsersCount(list)
      return (
        <>
          <TouchableOpacity
            onPress={() => actionSheetRef.current?.setModalVisible()}>
            {listName()}
            <Text
              style={{
                textAlign: 'center',
                color: colors.subtitle,
                fontSize: 12,
                fontWeight: '400',
              }}>
              {isCreator
                ? i18n.t('lists.shared_with_num', { count: numShared })
                : i18n.t('lists.shared_with_you')}
            </Text>
          </TouchableOpacity>
          <ActionSheet ref={actionSheetRef}>
            <ListUsersActionSheet list={list} />
          </ActionSheet>
        </>
      )
    }

    return <View>{listName()}</View>
  },
)

export default HeaderTitle
