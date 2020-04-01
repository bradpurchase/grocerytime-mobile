import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

import colors from '../styles/colors'
import Button from '../components/Button'

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  const handleLoginButtonPress = () => {
    setSubmitting(true)
    console.log(email, password)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headingLabel}>Sign in 🔑</Text>
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
        <Button label="Sign in" onPress={handleLoginButtonPress} />
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
    fontWeight: '500',
    marginBottom: 20,
    height: 50,
    paddingHorizontal: 20,
  },
})
export default LoginScreen
