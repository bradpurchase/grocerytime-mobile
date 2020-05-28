import * as React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@react-navigation/native'

interface Props {
  title: string
}

const ScreenTitle: React.FC<Props> = React.memo(({ title }) => {
  const { colors } = useTheme()
  return (
    <View
      style={{
        marginHorizontal: 20,
        marginBottom: 20,
      }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 32,
          fontWeight: '700',
        }}>
        {title}
      </Text>
    </View>
  )
})

export default ScreenTitle
