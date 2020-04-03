import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../styles/colors'
import fonts from '../styles/fonts'

interface Props {
  label: string
  onPress: () => void
  disabled?: boolean
}

const Button: React.FC<Props> = (props) => {
  const { label, onPress, disabled } = props

  const handleOnPress = () => {
    if (disabled) return null
    onPress()
  }

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={styles.container}
      activeOpacity={disabled ? 1 : 0.9}>
      <View style={disabled ? styles.disabledButton : styles.button}>
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
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    opacity: 1,
    paddingVertical: 12,
    width: '100%',
  },
  disabledButton: {
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    opacity: 0.5,
    paddingVertical: 12,
    width: '100%',
  },
  text: {
    color: colors.BLACK,
    fontFamily: fonts.REGULAR,
    fontWeight: '700',
    height: 20,
    textAlign: 'center',
  },
})

export default Button
