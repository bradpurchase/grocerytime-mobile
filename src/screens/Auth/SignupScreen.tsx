import React, { useState, useContext, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'

import { useMutation } from '@apollo/react-hooks'
import { ApolloError } from 'apollo-boost'
import { SIGNUP_MUTATION } from '../../queries/signup'
import * as SignupMutationTypes from '../../queries/__generated__/SignupMutation'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'
import Button from '../../components/Button'

import AuthContext from '../../context/AuthContext'

const SignupScreen: React.FC = () => {
  const authContext = useContext(AuthContext)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  const [signup, { error }] = useMutation<
    SignupMutationTypes.SignupMutation,
    SignupMutationTypes.SignupMutationVariables
  >(SIGNUP_MUTATION, {
    variables: {
      email: email,
      password: password,
    },
    onError: (error: ApolloError) => {
      console.log(error)
    },
    onCompleted: (data) => {
      authContext.login(data.signup)
      setSubmitting(false)
    },
  })

  useEffect(() => {
    error?.graphQLErrors.map(({ message }, i) => {
      return Alert.alert('Signup Failed', message)
    })
  }, [error])

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
