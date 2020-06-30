import * as React from 'react'
import { TouchableOpacity, View, Text, Alert } from 'react-native'
import { useTheme } from '@react-navigation/native'
import i18n from '../../i18n'

import { ListCellNavigationProp } from '../../types/Navigation'
import { List } from '../../types/List'

import { useMutation } from '@apollo/react-hooks'
import { JOIN_LIST_MUTATION } from '../../queries/joinList'
import * as JoinListMutationTypes from '../../queries/__generated__/JoinList'
import { DECLINE_LIST_INVITE_MUTATION } from '../../queries/declineListInvite'
import * as DeclineListInviteTypes from '../../queries/__generated__/DeclineListInvite'

interface Props {
  list: List
  refetch: () => void
  navigation: ListCellNavigationProp
}

const PendingListOptions: React.FC<Props> = React.memo(
  ({ list, refetch, navigation }) => {
    const { colors } = useTheme()

    const [joinList] = useMutation<
      JoinListMutationTypes.JoinList,
      JoinListMutationTypes.JoinListVariables
    >(JOIN_LIST_MUTATION, {
      variables: {
        listId: list.id,
      },
      onCompleted: () => {
        navigation.navigate('ListView', { list, dismiss: false })
      },
    })

    const [declineListInvite] = useMutation<
      DeclineListInviteTypes.DeclineListInvite,
      DeclineListInviteTypes.DeclineListInviteVariables
    >(DECLINE_LIST_INVITE_MUTATION, {
      variables: {
        listId: list.id,
      },
      onCompleted: () => {
        refetch()
      },
    })

    const handleDeclineListInvite = () => {
      Alert.alert(
        i18n.t('lists.invite.decline_confirm_heading'),
        i18n.t('lists.invite.decline_confirm_body'),
        [
          {
            text: i18n.t('global.cancel'),
            onPress: () => console.log('cancel pressed'),
            style: 'cancel',
          },
          {
            text: i18n.t('lists.invite.decline_invite'),
            onPress: () => declineListInvite(),
          },
        ],
      )
    }

    const handleAcceptListInvite = () => {
      Alert.alert(
        i18n.t('lists.invite.accept_confirm_heading'),
        i18n.t('lists.invite.accept_confirm_body'),
        [
          {
            text: i18n.t('global.cancel'),
            onPress: () => console.log('cancel pressed'),
            style: 'cancel',
          },
          {
            text: i18n.t('lists.invite.accept_invite'),
            onPress: () => joinList(),
          },
        ],
      )
    }

    return (
      <View
        style={{
          backgroundColor: colors.success,
          borderRadius: 8,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          marginHorizontal: 10,
        }}>
        <Text
          style={{
            color: colors.successText,
            fontSize: 15,
            fontWeight: '500',
            lineHeight: 22,
            padding: 20,
          }}>
          {i18n.t('lists.invite.body')}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.successLight,
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 20,
            }}
            onPress={() => handleDeclineListInvite()}>
            <Text
              style={{
                color: colors.successText,
                fontSize: 16,
                fontWeight: '500',
                textAlign: 'center',
              }}>
              {i18n.t('global.decline')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.successLight,
              borderLeftWidth: 1,
              borderLeftColor: colors.success,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              padding: 20,
            }}
            onPress={() => handleAcceptListInvite()}>
            <Text
              style={{
                color: colors.successText,
                fontSize: 16,
                fontWeight: '500',
                textAlign: 'center',
              }}>
              {i18n.t('lists.invite.accept_and_join')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  },
)

export default PendingListOptions
