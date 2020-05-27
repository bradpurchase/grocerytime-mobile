import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native'
const { width, height } = Dimensions.get('window')

import { useMutation } from '@apollo/react-hooks'
import { ApolloError } from 'apollo-boost'
import { SIGNUP_MUTATION } from '../../queries/signup'
import * as SignupMutationTypes from '../../queries/__generated__/SignupMutation'

import colors from '../../styles/colors'
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

  const emailIsValid = () => {
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(email.toLowerCase())
  }

  const handleSignupButtonPress = () => {
    if (emailIsValid()) {
      setSubmitting(true)
      signup()
    } else {
      Alert.alert(
        'Oops!',
        "That doesn't appear to be a valid email address. Please check it and try again.",
      )
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.bgImage}
        source={require('../../assets/images/AuthScreensBG.png')}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/LogoWhite.png')}
          />
          <View style={styles.form}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#666"
              style={styles.textInput}
              keyboardType="email-address"
              autoCompleteType="email"
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
              editable={!submitting}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#666"
              style={styles.textInput}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              editable={!submitting}
            />
            <Button
              label={submitting ? 'Working on it...' : 'Sign up'}
              onPress={handleSignupButtonPress}
              disabled={
                email.length === 0 || password.length === 0 || submitting
              }
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  bgImage: {
    width: width,
    height: height,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  logo: {
    justifyContent: 'center',
    resizeMode: 'contain',
    width: '50%',
  },
  formContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: width,
  },
  headingLabel: {
    color: colors.WHITE,
    fontSize: 32,
    fontWeight: '800',
  },
  form: {
    width: '80%',
    marginTop: 20,
  },
  textInput: {
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    color: colors.BLACK,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
    height: 50,
    paddingHorizontal: 20,
  },
})
export default SignupScreen
