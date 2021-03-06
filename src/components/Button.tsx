import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../styles/colors'

interface Props {
  label: string
  onPress: () => void
  disabled?: boolean
  transparent?: boolean
}

const Button: React.FC<Props> = (props) => {
  const { label, onPress, disabled, transparent } = props

  const handleOnPress = () => {
    if (disabled) return null
    onPress()
  }

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={styles.container}
      activeOpacity={disabled ? 1 : 0.9}>
      <View
        style={StyleSheet.flatten([
          styles.button,
          disabled && styles.disabledButton,
          transparent && styles.transparentButton,
        ])}>
        <Text style={styles.text}>{label}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.RED,
    borderRadius: 4,
    opacity: 1,
    paddingVertical: 16,
    width: '100%',
  },
  disabledButton: {
    opacity: 0.9,
  },
  transparentButton: {
    backgroundColor: 'transparent',
  },
  text: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    height: 20,
    textAlign: 'center',
  },
})

export default Button
