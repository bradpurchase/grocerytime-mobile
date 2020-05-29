import * as React from 'react'
import {
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native'

import { RouteProp, useTheme } from '@react-navigation/native'

import {
  RootStackParamList,
  JoinListNavigationProp,
} from '../../types/Navigation'
import { List } from '../../types'

import { useQuery, useMutation } from '@apollo/react-hooks'
import { SHAREABLE_LIST_QUERY } from '../../queries/list'
import { JOIN_LIST_MUTATION } from '../../queries/joinList'
import * as JoinListMutationTypes from '../../queries/__generated__/JoinList'

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

    const [joinList] = useMutation<
      JoinListMutationTypes.JoinList,
      JoinListMutationTypes.JoinListVariables
    >(JOIN_LIST_MUTATION)

    React.useEffect(() => {
      if (authContext.user?.token && authContext.user.token.length > 0) {
        console.log('we have token, just join and redirect to list')
        joinList({
          variables: {
            listId: listId,
          },
        }).then((data) => {
          console.log('here', data)
          const list: List = { id: listId }
          navigation.push('ListView', {
            list,
          })
        })
      }
    }, [authContext.user])

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
                color: colors.primary,
                fontSize: 16,
              }}>
              Dismiss
            </Text>
          </TouchableOpacity>
        ),
        headerRight: () => <></>,
      })
    })

    const emailIsValid = () => {
      const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(formData.email.toLowerCase())
    }

    const handleSignup = () => {
      if (emailIsValid()) {
        setFormData({ ...formData, submitting: true })
        console.log('TODO handleSignup')
      } else {
        Alert.alert(
          'Oops!',
          "That doesn't appear to be a valid email address. Please check it and try again.",
        )
      }
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
            label={
              formData.submitting ? 'Submitting...' : 'Sign up and Join List'
            }
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
