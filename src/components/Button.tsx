import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import colors from '../styles/colors'

interface Props {
  label: string
  onPress: () => void
}

const Button: React.FC<Props> = (props) => {
  const { label, onPress } = props

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    justifyContent: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    width: '100%',
  },
  text: {
    color: colors.BLACK,
    fontWeight: '700',
    height: 20,
    textAlign: 'center',
  },
})

export default Button
