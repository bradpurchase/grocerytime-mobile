import * as React from 'react'
import { Text, View, Dimensions } from 'react-native'
import { useTheme } from '@react-navigation/native'

interface Props {
  title: string
  body?: string
}

const EmptyState: React.FC<Props> = React.memo((props) => {
  const { colors } = useTheme()
  const { title, body } = props

  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 21,
          fontWeight: '500',
          marginBottom: 10,
          textAlign: 'center',
        }}>
        {title}
      </Text>
      {body && (
        <Text
          style={{
            color: colors.subtitle,
            fontSize: 18,
            textAlign: 'center',
            lineHeight: 25,
            width: Dimensions.get('window').width * 0.85,
          }}>
          {body}
        </Text>
      )}
    </View>
  )
})

export default EmptyState
