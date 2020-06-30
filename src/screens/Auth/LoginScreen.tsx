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
import i18n from '../../i18n'

import { useMutation } from '@apollo/react-hooks'
import { ApolloError } from 'apollo-boost'
import { LOGIN_MUTATION } from '../../queries/login'
import * as TokenMutationTypes from '../../queries/__generated__/TokenMutation'

import { LoginNavigationProp } from '../../types/Navigation'

import colors from '../../styles/colors'
import Button from '../../components/Button'

import AuthContext from '../../context/AuthContext'

interface Props {
  navigation: LoginNavigationProp
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
      if (data.token) authContext.login(data.token)
      setSubmitting(false)
    },
  })

  useEffect(() => {
    error?.graphQLErrors.map(({ message }, i) => {
      return Alert.alert(i18n.t('auth.errors.login_failed'), message)
    })
  }, [error])

  const handleLoginButtonPress = () => {
    setSubmitting(true)
    login()
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
              placeholderTextColor="#666"
              style={styles.textInput}
              placeholder={i18n.t('auth.email')}
              keyboardType="email-address"
              autoCompleteType="email"
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
              editable={!submitting}
            />
            <TextInput
              placeholderTextColor="#666"
              style={styles.textInput}
              placeholder={i18n.t('auth.password')}
              secureTextEntry
              returnKeyType="done"
              onChangeText={(text) => setPassword(text)}
              editable={!submitting}
              onSubmitEditing={() => handleLoginButtonPress()}
            />
            <Button
              label={
                submitting
                  ? i18n.t('loading.working_on_it')
                  : i18n.t('auth.log_in')
              }
              onPress={handleLoginButtonPress}
              disabled={
                email.length === 0 || password.length === 0 || submitting
              }
            />
            <Button
              label={i18n.t('auth.no_account_yet')}
              onPress={() => navigation.navigate('Signup')}
              transparent
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
    fontWeight: '500',
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
export default LoginScreen
