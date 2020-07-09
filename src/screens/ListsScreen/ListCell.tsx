import * as React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { useTheme } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import i18n from '../../i18n'

import { ListCellNavigationProp } from '../../types/Navigation'
import { List } from '../../types/List'
import { listIsShared } from '../../services/list'
import { numCompletedItems } from '../../services/trip'

import PendingListOptions from './PendingListOptions'

interface Props {
  list: List
  pending: boolean
  refetch: () => void
  navigation: ListCellNavigationProp
}

const ListCell: React.FC<Props> = React.memo(
  ({ list, pending, refetch, navigation }: Props) => {
    const { colors } = useTheme()

    const { name, trip } = list
    const isShared: boolean = listIsShared(list)
    const completedItems: number = numCompletedItems(trip)

    const handleListViewNavigation = () => {
      if (pending) return false
      navigation.navigate('ListView', { list, dismiss: false })
    }

    return (
      <>
        {pending && (
          <PendingListOptions
            list={list}
            refetch={refetch}
            navigation={navigation}
          />
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
              {list.trip.items.length > 0 ? (
                <>
                  {i18n.t('items.items_to_pickup_count', {
                    count: list.trip.items.length - completedItems,
                  })}
                </>
              ) : (
                <>{i18n.t('items.empty_state.heading')}</>
              )}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    )
  },
)
export default ListCell
