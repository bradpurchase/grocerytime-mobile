import * as React from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'

interface Props {
  checked: boolean
  onPress?: () => void
}

const Checkbox: React.FC<Props> = (props) => {
  const { checked, onPress } = props

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      onPress={onPress}>
      <View
        style={StyleSheet.flatten([
          styles.checkbox,
          checked ? styles.checked : styles.unchecked,
        ])}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  checkbox: {
    borderWidth: 1,
    borderRadius: 64,
    height: 20,
    width: 20,
  },
  checked: {
    backgroundColor: '#48BB78',
    borderColor: '#48BB78',
  },
  unchecked: {
    backgroundColor: 'transparent',
    borderColor: '#ccc',
  },
})

export default Checkbox
