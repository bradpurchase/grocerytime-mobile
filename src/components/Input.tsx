import * as React from 'react'
import { TextInput, StyleSheet } from 'react-native'

import colors from '../styles/colors'
import fonts from '../styles/fonts'

const Input: React.FC = (props: any) => {
  return (
    <TextInput
      placeholderTextColor="#ddd"
      style={styles.textInput}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
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

export default Input
