import * as React from 'react'
import { TouchableOpacity, View, Text, Alert } from 'react-native'
import { useTheme } from '@react-navigation/native'

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
        'Decline invite?',
        "Are you sure you want to decline this list invite? You won't become a member of this list and it will disappear from this screen.",
        [
          {
            text: 'Cancel',
            onPress: () => console.log('cancel pressed'),
            style: 'cancel',
          },
          {
            text: 'Decline Invite',
            onPress: () => declineListInvite(),
          },
        ],
      )
    }

    const handleAcceptListInvite = () => {
      Alert.alert(
        'Accept invite?',
        'Are you sure you want to accept this list invite? You will become a member of this list and can add items and receive updates.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('cancel pressed'),
            style: 'cancel',
          },
          {
            text: 'Accept Invite',
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
          You were invited to this list. Would you like to join?
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
              Decline
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
              Accept and join
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  },
)

export default PendingListOptions
