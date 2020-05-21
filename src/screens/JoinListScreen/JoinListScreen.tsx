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

import { List } from '../../types/List'
import { shareActionSheet } from '../../helpers/ListActions'

import { useQuery } from '@apollo/react-hooks'
import { SHAREABLE_LIST_QUERY } from '../../queries/list'

import { getAccessToken } from '../../services/token'

import Button from '../../components/Button'

interface Props {
  route: RouteProp<RootStackParamList, 'JoinList'>
  navigation: JoinListNavigationProp
}

const JoinListScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const { colors } = useTheme()

    //TODO just join and redirect if logged in

    const [formData, setFormData] = React.useState({
      email: '',
      password: '',
      submitting: false,
    })
    const [tokenData, setTokenData] = React.useState({
      loading: true,
      token: '',
    })

    const checkAuthentication = async () => {
      try {
        const token = await getAccessToken()
        if (token) {
          setTokenData({ loading: false, token })
        } else {
          setTokenData({ ...tokenData, loading: false })
        }
      } catch (e) {
        //TODO better error handling
        console.error(e)
      }
    }

    React.useEffect(() => {
      checkAuthentication()
    }, [])

    React.useEffect(() => {
      if (tokenData.token.length > 0) {
        console.log('we have token, just join and redirect to list')
      }
    }, [tokenData])

    const { loading, data, error } = useQuery(SHAREABLE_LIST_QUERY, {
      variables: { id: route.params.id },
    })
    if (error) console.log(error)

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

    if (loading || tokenData.loading) {
      return (
        <View
          style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
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
          You've been invited to join {data.sharableList.name}
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
            onChangeText={(text) => setFormData({ ...formData, email: text })}
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
              setFormData({ ...formData, password: text })
            }
            editable={!formData.submitting}
          />
          <Button
            label="Sign up and Join List"
            onPress={() => shareActionSheet(list)}
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
