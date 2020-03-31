import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

const LoginScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headingLabel}>Sign in</Text>
      <View style={{ margin: 30 }}>
        <TextInput placeholder="Email address" style={styles.textInput} />
        <TextInput
          placeholder="Password"
          style={styles.textInput}
          secureTextEntry
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#363062',
    flex: 1,
    justifyContent: 'center',
  },
  headingLabel: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
  },
  textInput: {
    marginTop: 20,
    width: 300,
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFB',
    textAlign: 'center',
  },
})
export default LoginScreen
