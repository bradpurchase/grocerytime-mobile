import * as React from 'react'
import { ToucehableOpacity, View, Text } from 'react-native'
import { useTheme } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'

import { ListCellNavigationProp } from '../../types/Navigation'
import { List } from '../../types/List'
import { listIsShared } from '../../services/list'
import { numCompletedItems } from '../../services/trip'

import { useMutation } from '@apollo/react-hooks'
import { JOIN_LIST_MUTATION } from '../../queries/joinList'
import * as JoinListMutationTypes from '../../queries/__generated__/JoinList'

interface Props {
  list: List
  pending: boolean
  navigation: ListCellNavigationProp
}

const ListCell: React.FC<Props> = React.memo(
  ({ list, pending, navigation }: Props) => {
    const { colors } = useTheme()

    const { name, trip } = list
    const isShared: boolean = listIsShared(list)
    const completedItems: number = numCompletedItems(trip)

    const [joinList] = useMutation<
      JoinListMutationTypes.JoinList,
      JoinListMutationTypes.JoinListVariables
    >(JOIN_LIST_MUTATION)

    const handleListViewNavigation = () => {
      if (pending) return false
      navigation.navigate('ListView', { list, dismiss: false })
    }

    const declineListInvite = (list: List) => {
      console.log('decline list invite pressed')
    }

    const acceptListInvite = (list: List) => {
      joinList({
        variables: {
          listId: list.id,
        },
      }).then(() => {
        navigation.replace('ListView', { list })
      })
    }

    return (
      <>
        {pending && (
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
                onPress={() => declineListInvite(list)}>
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
                onPress={() => acceptListInvite(list)}>
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
        )}
        <TouchableOpacity
          style={{
            backgroundColor: colors.card,
            borderRadius: 8,
            borderTopLeftRadius: pending ? 0 : 8,
            borderTopRightRadius: pending ? 0 : 8,
            flex: 1,
            marginHorizontal: 10,
            marginBottom: 10,
            padding: 20,
            height: 90,
          }}
          activeOpacity={1}
          onPress={() => handleListViewNavigation()}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: '700',
                flexDirection: 'column',
              }}>
              {name}{' '}
            </Text>
            {isShared && (
              <FastImage
                style={{
                  width: 20,
                  height: 20,
                  flexDirection: 'column',
                  marginLeft: 5,
                }}
                resizeMode="contain"
                source={require('../../assets/icons/Shared.png')}
              />
            )}
            <FastImage
              style={{
                width: 14,
                height: 14,
                position: 'absolute',
                right: 0,
                top: 14,
              }}
              resizeMode="contain"
              source={require('../../assets/icons/DisclosureIndicator.png')}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                color: colors.subtitle,
                fontSize: 16,
                fontWeight: '500',
                flexDirection: 'column',
                marginTop: 8,
              }}>
              {completedItems}/{list.trip.items.length} items
            </Text>
          </View>
        </TouchableOpacity>
      </>
    )
  },
)
export default ListCell
