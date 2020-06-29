import * as React from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  Text,
} from 'react-native'
const { width, height } = Dimensions.get('window')
import i18n from '../../i18n'

import { RouteProp } from '@react-navigation/native'
import {
  RootStackParamList,
  SignupNavigationProp,
} from '../../types/Navigation'

import { useMutation } from '@apollo/react-hooks'
import { SIGNUP_MUTATION } from '../../queries/signup'
import * as SignupMutationTypes from '../../queries/__generated__/SignupMutation'

import colors from '../../styles/colors'
import Button from '../../components/Button'

import AuthContext from '../../context/AuthContext'

interface Props {
  route: RouteProp<RootStackParamList, 'Signup'>
  navigation: SignupNavigationProp
}

const SignupScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const authContext = React.useContext(AuthContext)

    const [formData, setFormData] = React.useState({
      email: '',
      password: '',
      submitting: false,
    })

    const [signup, { error }] = useMutation<
      SignupMutationTypes.SignupMutation,
      SignupMutationTypes.SignupMutationVariables
    >(SIGNUP_MUTATION, {
      variables: {
        email: formData.email,
        password: formData.password,
      },
      onCompleted: (data) => {
        //TODO if listParam is not undefined, join and redirect to list after signup
        authContext.login(data.signup)
        setFormData({ ...formData, submitting: false })
      },
    })
    if (error) {
      error.graphQLErrors?.map(({ message }, i) => {
        return Alert.alert('Signup Failed', message)
      })
    }

    const emailIsValid = () => {
      const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(formData.email.toLowerCase())
    }

    const handleSignupButtonPress = () => {
      if (emailIsValid()) {
        setFormData({ ...formData, submitting: true })
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
                placeholder={i18n.t('auth.email')}
                placeholderTextColor="#666"
                style={styles.textInput}
                keyboardType="email-address"
                autoCompleteType="email"
                autoCapitalize="none"
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                editable={!formData.submitting}
              />
              <TextInput
                placeholder={i18n.t('auth.password')}
                placeholderTextColor="#666"
                style={styles.textInput}
                secureTextEntry
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                editable={!formData.submitting}
              />
              <Button
                label={
                  formData.submitting
                    ? i18n.t('loading.working_on_it')
                    : i18n.t('auth.sign_up')
                }
                onPress={handleSignupButtonPress}
                disabled={
                  formData.email.length === 0 ||
                  formData.password.length === 0 ||
                  formData.submitting
                }
              />
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    )
  },
)

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
