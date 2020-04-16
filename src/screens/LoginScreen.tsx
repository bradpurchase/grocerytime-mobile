import React, { useState, useContext, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation'

import { useMutation } from '@apollo/react-hooks'
import { ApolloError } from 'apollo-boost'
import { LOGIN_MUTATION } from '../queries/login'
import * as TokenMutationTypes from '../queries/__generated__/TokenMutation'

import colors from '../styles/colors'
import fonts from '../styles/fonts'
import Button from '../components/Button'

import AuthContext from '../context/AuthContext'

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const LoginScreen: React.FC<Props> = ({ navigation }: Props) => {
  const authContext = useContext(AuthContext)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [login, { error }] = useMutation<
    TokenMutationTypes.TokenMutation,
    TokenMutationTypes.TokenMutationVariables
  >(LOGIN_MUTATION, {
    variables: {
      grantType: 'login',
      email: email,
      password: password,
    },
    onError: (error: ApolloError) => {
      console.log(error)
    },
    onCompleted: (data) => {
      console.log(data)
      if (data.token) authContext.login(data.token)
      setSubmitting(false)
    },
  })

  useEffect(() => {
    error?.graphQLErrors.map(({ message }, i) => {
      return Alert.alert('Login failed', message)
    })
  }, [error])

  const handleLoginButtonPress = () => {
    setSubmitting(true)
    login()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headingLabel}>Sign in</Text>
      <View style={styles.form}>
        <TextInput
          placeholderTextColor="#ddd"
          style={styles.textInput}
          placeholder="Email"
          keyboardType="email-address"
          autoCompleteType="email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
          editable={!submitting}
        />
        <TextInput
          placeholderTextColor="#ddd"
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          editable={!submitting}
        />
        <Button
          label="Sign in"
          onPress={handleLoginButtonPress}
          disabled={email.length === 0 || password.length === 0 || submitting}
        />
        <Button
          label="I don't have an account yet!"
          onPress={() => navigation.navigate('Signup')}
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
export default LoginScreen
