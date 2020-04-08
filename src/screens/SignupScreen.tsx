import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation'
import AsyncStorage from '@react-native-community/async-storage'

import { useMutation } from '@apollo/react-hooks'
import { ApolloError } from 'apollo-boost'
import { SIGNUP } from '../queries/signup'
import * as SignupMutationTypes from '../queries/__generated__/SignupMutation'

import colors from '../styles/colors'
import fonts from '../styles/fonts'
import Button from '../components/Button'

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const SignupScreen: React.FC<Props> = ({ navigation }: Props) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [signup, { error, data }] = useMutation<
    SignupMutationTypes.SignupMutation,
    SignupMutationTypes.SignupMutationVariables
  >(SIGNUP, {
    variables: {
      email: email,
      password: password,
    },
    onError: (error: ApolloError) => {
      console.log(error)
    },
    onCompleted: () => {
      authenticateUser()
      setSubmitting(false)
    },
  })

  const authenticateUser = async () => {
    console.log(data)
    try {
      await AsyncStorage.multiSet([
        ['@accessToken', data?.signup?.accessToken],
        ['@accessToken', data?.signup?.refreshToken],
        ['@accessToken', data?.signup?.expiresIn],
      ])
    } catch (e) {
      //TODO better error handling
      console.error(e)
    }

    //TODO transition to ListsScreen
  }

  const handleSignupButtonPress = () => {
    setSubmitting(true)
    signup()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headingLabel}>Sign up 👋</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#ddd"
          style={styles.textInput}
          keyboardType="email-address"
          autoCompleteType="email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
          editable={!submitting}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ddd"
          style={styles.textInput}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          editable={!submitting}
        />
        <Button
          label="Sign up"
          onPress={handleSignupButtonPress}
          disabled={email.length === 0 || password.length === 0 || submitting}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.BLACK,
    flex: 1,
    justifyContent: 'center',
  },
  headingLabel: {
    color: colors.WHITE,
    fontFamily: fonts.REGULAR,
    fontSize: 32,
    fontWeight: '800',
  },
  form: {
    width: '80%',
    marginTop: 50,
  },
  textInput: {
    backgroundColor: '#333',
    borderRadius: 4,
    color: colors.WHITE,
    fontFamily: fonts.REGULAR,
    fontWeight: '500',
    marginBottom: 20,
    height: 50,
    paddingHorizontal: 20,
  },
})
export default SignupScreen
