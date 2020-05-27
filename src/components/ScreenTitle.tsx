import * as React from 'react'
import { Text } from 'react-native'
import { useTheme } from '@react-navigation/native'

interface Props {
  title: string
}

const ScreenTitle: React.FC<Props> = React.memo(({ title }) => {
  const { colors } = useTheme()
  return (
    <Text
      style={{
        color: colors.text,
        fontSize: 32,
        fontWeight: '700',
        marginHorizontal: 20,
        marginBottom: 20,
      }}>
      {title}
    </Text>
  )
})

export default ScreenTitle
