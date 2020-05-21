import * as React from 'react'
import {
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'

import { RouteProp, useTheme } from '@react-navigation/native'

import {
  RootStackParamList,
  JoinListNavigationProp,
} from '../../types/Navigation'
import { List } from '../../types'

import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { ME_QUERY } from '../../queries/me'
import { SHAREABLE_LIST_QUERY } from '../../queries/list'
import { ADD_LIST_USER_MUTATION } from '../../queries/addListUser'
import * as AddListUserMutationTypes from '../../queries/__generated__/AddListUser'

import AuthContext, { AuthContextProps } from '../../context/AuthContext'

import Button from '../../components/Button'

interface Props {
  route: RouteProp<RootStackParamList, 'JoinList'>
  navigation: JoinListNavigationProp
}

const JoinListScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const { colors } = useTheme()

    const authContext: AuthContextProps = React.useContext(AuthContext)

    const [formData, setFormData] = React.useState({
      email: '',
      password: '',
      submitting: false,
    })

    const listId = route.params.id
    const {
      loading,
      data: sharableListData,
      error: sharableListQueryError,
    } = useQuery(SHAREABLE_LIST_QUERY, {
      variables: { id: listId },
    })
    if (sharableListQueryError) console.log(sharableListQueryError)

    const [addListUser, { error }] = useMutation<
      AddListUserMutationTypes.AddListUser,
      AddListUserMutationTypes.AddListUserVariables
    >(ADD_LIST_USER_MUTATION, {
      onCompleted: () => {
        const list: List = { id: listId }
        navigation.navigate('ListView', {
          list,
        })
      },
    })

    const [getCurrentUser, { data: meData }] = useLazyQuery(ME_QUERY)
    console.log(meData)
    // if (meData.me) {
    //   addListUser({
    //     variables: {
    //       userId: meData.me.id,
    //       listId: listId,
    //     },
    //   })
    // }

    React.useEffect(() => {
      if (authContext.token.length > 0) {
        console.log('we have token, just join and redirect to list')
        getCurrentUser()
      }
    }, [authContext.token])

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              paddingHorizontal: 0,
              paddingVertical: 10,
              width: 80,
            }}
            onPress={() => navigation.popToTop()}>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
              }}>
              Dismiss
            </Text>
          </TouchableOpacity>
        ),
        headerRight: () => <></>,
      })
    })

    const handleSignup = () => {
      console.log('TODO handleSignup')
    }

    if (loading) {
      return (
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return (
      <ScrollView
        style={{
          flex: 1,
          marginTop: 40,
          padding: 20,
        }}>
        <Text
          style={{
            color: colors.text,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: '700',
            marginBottom: 30,
            lineHeight: 25,
          }}>
          You've been invited to join {sharableListData.sharableList.name}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: colors.subtitle,
            fontSize: 16,
            lineHeight: 25,
            marginBottom: 30,
          }}>
          Once you've joined this list you can collaborate on it together and
          receive updates in real time.
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: colors.subtitle,
            fontSize: 16,
            lineHeight: 25,
            marginBottom: 30,
          }}>
          First, create a free account below:
        </Text>
        <View style={{ marginTop: 10 }}>
          <TextInput
            placeholderTextColor="#666"
            style={{
              backgroundColor: colors.card,
              borderRadius: 4,
              color: colors.text,
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 15,
              height: 50,
              paddingHorizontal: 20,
            }}
            placeholder="Email"
            keyboardType="email-address"
            autoCompleteType="email"
            autoCapitalize="none"
            onChangeText={(text) =>
              setFormData({
                ...formData,
                email: text,
              })
            }
            editable={!formData.submitting}
          />
          <TextInput
            placeholderTextColor="#666"
            style={{
              backgroundColor: colors.card,
              borderRadius: 4,
              color: colors.text,
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 15,
              height: 50,
              paddingHorizontal: 20,
            }}
            placeholder="Password"
            secureTextEntry
            returnKeyType="done"
            onChangeText={(text) =>
              setFormData({
                ...formData,
                password: text,
              })
            }
            editable={!formData.submitting}
          />
          <Button
            label="Sign up and Join List"
            onPress={() => handleSignup()}
            disabled={
              formData.email.length === 0 ||
              formData.password.length === 0 ||
              formData.submitting
            }
          />
        </View>
      </ScrollView>
    )
  },
)

export default JoinListScreen
