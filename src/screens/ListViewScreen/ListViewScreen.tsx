import * as React from 'react'
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Text,
  ActionSheetIOS,
  Alert,
} from 'react-native'
import { RouteProp, useTheme } from '@react-navigation/native'
import i18n from '../../i18n'

import {
  RootStackParamList,
  ListViewNavigationProp,
} from '../../types/Navigation'
import { List } from '../../types/List'

import { useQuery, useMutation } from '@apollo/react-hooks'
import { LIST_QUERY } from '../../queries/list'
import { DELETE_LIST_MUTATION } from '../../queries/deleteList'
import * as DeleteListTypes from '../../queries/__generated__/DeleteList'
import { INVITE_TO_LIST_MUTATION } from '../../queries/inviteToList'
import * as InviteToListTypes from '../../queries/__generated__/InviteToList'
import { LEAVE_LIST_MUTATION } from '../../queries/leaveList'
import * as LeaveListMutationTypes from '../../queries/__generated__/LeaveList'

import AuthContext from '../../context/AuthContext'
import ListContext from '../../context/ListContext'
import { currentUserIsCreator } from '../../services/list'

import TripView from './TripView'
import HeaderTitle from './HeaderTitle'

interface Props {
  route: RouteProp<RootStackParamList, 'ListView'>
  navigation: ListViewNavigationProp
}

const ListViewScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const { colors } = useTheme()

    const authContext = React.useContext(AuthContext)
    const currentUserId = authContext.user?.id as string

    const listParam: List = route.params.list
    const shouldDismiss: boolean | undefined = route.params.dismiss

    const { loading, data, refetch, subscribeToMore } = useQuery(LIST_QUERY, {
      variables: { id: listParam.id },
    })

    React.useEffect(() => {
      const refetchOnFocus = navigation.addListener('focus', () => {
        refetch()
      })
      return refetchOnFocus
    }, [navigation])

    const [deleteList] = useMutation<
      DeleteListTypes.DeleteList,
      DeleteListTypes.DeleteListVariables
    >(DELETE_LIST_MUTATION, {
      onCompleted: (data) => {
        if (data.deleteList?.id) {
          navigation.popToTop()
        }
      },
    })

    const [inviteToList, { error: inviteToListError }] = useMutation<
      InviteToListTypes.InviteToList,
      InviteToListTypes.InviteToListVariables
    >(INVITE_TO_LIST_MUTATION, {
      onCompleted: (data) => {
        if (data.inviteToList?.email?.length > 0) {
          Alert.alert(
            'Invite sent!',
            'An email was just sent to the email address provided with a link to join this list!',
            [
              {
                text: 'OK',
                onPress: () => refetch(),
              },
            ],
          )
        }
      },
    })
    if (inviteToListError) {
      inviteToListError?.graphQLErrors.map(({ message }, i) => {
        return Alert.alert('Share failed', message)
      })
    }

    const [leaveList] = useMutation<
      LeaveListMutationTypes.LeaveList,
      LeaveListMutationTypes.LeaveListVariables
    >(LEAVE_LIST_MUTATION, {
      variables: {
        listId: listParam.id,
      },
      onCompleted: () => {
        navigation.navigate('Lists')
      },
    })

    React.useLayoutEffect(() => {
      if (shouldDismiss) {
        navigation.setOptions({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 10,
                width: 85,
              }}
              onPress={() => navigation.navigate('Lists')}>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 16,
                }}>
                Dismiss
              </Text>
            </TouchableOpacity>
          ),
        })
      }
    }, [shouldDismiss])

    React.useLayoutEffect(() => {
      if (data) {
        const isCreator: boolean = currentUserIsCreator(
          currentUserId,
          data.list,
        )
        if (isCreator) {
          navigation.setOptions({
            headerTitle: () => (
              <HeaderTitle list={data.list} isCreator={true} />
            ),
            headerRight: () => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  width: 50,
                }}
                onPress={() => listCreatorActionSheet()}>
                <Image
                  style={{
                    justifyContent: 'center',
                    resizeMode: 'contain',
                  }}
                  source={require('../../assets/icons/MenuVertical.png')}
                />
              </TouchableOpacity>
            ),
          })
        } else {
          navigation.setOptions({
            headerTitle: () => (
              <HeaderTitle list={data.list} isCreator={false} />
            ),
            headerRight: () => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  width: 50,
                }}
                onPress={() => listMemberActionSheet()}>
                <Image
                  style={{
                    justifyContent: 'center',
                    resizeMode: 'contain',
                  }}
                  source={require('../../assets/icons/MenuVertical.png')}
                />
              </TouchableOpacity>
            ),
          })
        }
      }
    }, [navigation, data])

    const deleteListConfirmationActionSheet = () => {
      return ActionSheetIOS.showActionSheetWithOptions(
        {
          message:
            'Are you sure you want to delete this list and its items? If this list is shared, the other members will be notified. You cannot undo this action.',
          options: ['Delete', 'Dismiss'],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        },
        (buttonIdx) => {
          if (buttonIdx === 0) {
            deleteList({ variables: { listId: data.list.id } })
          }
        },
      )
    }

    const listCreatorActionSheet = () => {
      let options = ['Share list', 'Rename list', 'Delete list', 'Dismiss']
      let renameButtonIndex = 1
      let destructiveButtonIndex = 2
      let cancelButtonIndex = 3
      // Limit sharing to up to 5 for now so we can keep tabs on subscriptions load
      // Note: condition is greater than 5 because we don't count the list creator against the limit
      const atShareLimit = data.list.listUsers.length > 5
      if (atShareLimit) {
        options.shift()
        renameButtonIndex = renameButtonIndex - 1
        destructiveButtonIndex = destructiveButtonIndex - 1
        cancelButtonIndex = cancelButtonIndex - 1
      }
      return ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex,
          cancelButtonIndex,
        },
        (buttonIdx) => {
          if (!atShareLimit && buttonIdx === 0) {
            return Alert.prompt(
              'Share by invitation',
              'Enter the email address of the person you want to invite to this list',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('cancel pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Send Invite',
                  onPress: (text) =>
                    inviteToList({
                      variables: {
                        listId: listParam.id,
                        email: text,
                      },
                    }),
                },
              ],
            )
          }
          if (buttonIdx === renameButtonIndex) {
            navigation.navigate('RenameList', { list: data.list })
          }
          if (buttonIdx === destructiveButtonIndex) {
            deleteListConfirmationActionSheet()
          }
        },
      )
    }

    const listMemberActionSheet = () => {
      return ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [i18n.t('lists.leave_list'), i18n.t('global.dismiss')],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        },
        (buttonIdx) => {
          if (buttonIdx === 0) {
            Alert.alert(
              i18n.t('lists.leave_list_confirm_heading'),
              i18n.t('lists.leave_list_confirm_body'),
              [
                {
                  text: i18n.t('global.cancel'),
                  onPress: () => console.log('Cancel pressed...'),
                  style: 'cancel',
                },
                {
                  text: i18n.t('lists.leave_list_confirm_cta'),
                  onPress: () => leaveList(),
                  style: 'destructive',
                },
              ],
            )
          }
        },
      )
    }

    if (loading) return <ActivityIndicator size="large" />

    return (
      <ListContext.Provider value={{ data, refetch, subscribeToMore }}>
        <TripView />
      </ListContext.Provider>
    )
  },
)

export default ListViewScreen
