import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'

interface Props {
  checked: boolean
  disabled?: boolean
  onPress: () => void
}

const Checkbox: React.FC<Props> = ({ checked, disabled = false, onPress }) => {
  const handleOnPress = () => {
    if (disabled) return false
    onPress()
  }

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.9}
      style={{ flexDirection: 'column' }}
      onPress={handleOnPress}>
      <View
        style={{
          backgroundColor: checked ? '#48BB78' : 'transparent',
          borderColor: checked ? '#48BB78' : '#ccc',
          borderWidth: 2,
          borderRadius: 64,
          height: 20,
          opacity: disabled ? 0.5 : 1,
          width: 20,
        }}
      />
    </TouchableOpacity>
  )
}

export default Checkbox
