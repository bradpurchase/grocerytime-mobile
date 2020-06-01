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

import { RouteProp, useTheme } from '@react-navigation/native'
import {
  RootStackParamList,
  SignupNavigationProp,
} from '../../types/Navigation'

import { useMutation } from '@apollo/react-hooks'
import { ApolloError } from 'apollo-boost'
import { SIGNUP_MUTATION } from '../../queries/signup'
import * as SignupMutationTypes from '../../queries/__generated__/SignupMutation'

import colors from '../../styles/colors'
import Button from '../../components/Button'

import AuthContext from '../../context/AuthContext'
import { List } from '../../types/List'

interface Props {
  route: RouteProp<RootStackParamList, 'Signup'>
  navigation: SignupNavigationProp
}

const SignupScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const { colors } = useTheme()

    const authContext = React.useContext(AuthContext)

    // Note: This component's route accepts an optional list param for list sharing.
    // If someone follows a share link and they are not logged in, we redirect
    // them here via JoinListScreen which serves as a conduit
    const listParam: List | undefined = route.params.list

    React.useLayoutEffect(() => {
      // When there is a listParam present, show the headerTitle
      navigation.setOptions({
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 10,
              width: 90,
            }}
            onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: colors.primary, fontSize: 16 }}>Dismiss</Text>
          </TouchableOpacity>
        ),
      })
    }, [])

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
      onError: (error: ApolloError) => {
        console.log(error)
      },
      onCompleted: (data) => {
        //TODO if listParam is not undefined, join and redirect to list after signup
        authContext.login(data.signup)
        setFormData({ ...formData, submitting: false })
      },
    })

    React.useEffect(() => {
      error?.graphQLErrors.map(({ message }, i) => {
        return Alert.alert('Signup Failed', message)
      })
    }, [error])

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

    if (listParam) {
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
            You've been invited to join {listParam.name}
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
              onPress={handleSignupButtonPress}
              disabled={
                formData.email.length === 0 ||
                formData.password.length === 0 ||
                formData.submitting
              }
            />
          </View>
        </ScrollView>
      )
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
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                editable={!formData.submitting}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#666"
                style={styles.textInput}
                secureTextEntry
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                editable={!formData.submitting}
              />
              <Button
                label={formData.submitting ? 'Working on it...' : 'Sign up'}
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
