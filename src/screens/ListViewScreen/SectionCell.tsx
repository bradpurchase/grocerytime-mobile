import * as React from 'react'
import { Text } from 'react-native'
import { useTheme } from '@react-navigation/native'

interface Props {
  title: string
}

const SectionCell: React.FC<Props> = ({ title }: Props) => {
  const { colors } = useTheme()

  return (
    <Text
      style={{
        color: colors.subtitle,
        fontSize: 14,
        fontWeight: '500',
        padding: 10,
        paddingHorizontal: 30,
        textTransform: 'uppercase',
      }}>
      {title}
    </Text>
  )
}
export default SectionCell
