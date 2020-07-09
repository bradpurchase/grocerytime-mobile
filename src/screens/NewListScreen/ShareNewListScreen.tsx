import * as React from 'react'
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native'

import i18n from '../../i18n'

import { RouteProp, useTheme } from '@react-navigation/native'
import {
  RootStackParamList,
  ShareListNavigationProp,
} from '../../types/Navigation'

import { useMutation } from '@apollo/react-hooks'
import { INVITE_TO_LIST_MUTATION } from '../../queries/inviteToList'
import * as InviteToListTypes from '../../queries/__generated__/InviteToList'

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

    //TODO dry this up - this code is shared with ListViewScreen
    const [inviteToList, { error: inviteToListError }] = useMutation<
      InviteToListTypes.InviteToList,
      InviteToListTypes.InviteToListVariables
    >(INVITE_TO_LIST_MUTATION, {
      onCompleted: (data) => {
        if (data.inviteToList?.email?.length > 0) {
          Alert.alert(
            i18n.t('lists.invite.invite_sent'),
            i18n.t('lists.invite.invite_sent_body'),
            [
              {
                text: i18n.t('global.ok'),
                onPress: () => console.log('invite sent alert dismissed'),
              },
            ],
          )
        }
      },
    })
    if (inviteToListError) {
      inviteToListError?.graphQLErrors.map(({ message }, i) => {
        return Alert.alert(i18n.t('lists.errors.share_failed'), message)
      })
    }

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
            onPress={() => {
              return Alert.prompt(
                i18n.t('lists.invite.share_prompt_heading'),
                i18n.t('lists.invite.share_prompt_body'),
                [
                  {
                    text: i18n.t('global.cancel'),
                    onPress: () => console.log('cancel pressed'),
                    style: 'cancel',
                  },
                  {
                    text: i18n.t('lists.invite.send_invite'),
                    onPress: (text) =>
                      inviteToList({
                        variables: {
                          listId: list.id,
                          email: text,
                        },
                      }),
                  },
                ],
              )
            }}
          />
        </View>
      </ScrollView>
    )
  },
)

export default ShareNewListScreen
