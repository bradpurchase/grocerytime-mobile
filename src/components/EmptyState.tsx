import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import fonts from '../styles/fonts'

interface Props {
  title: string
  body?: string
}

const EmptyState: React.FC<Props> = (props) => {
  const { title, body } = props

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {body && <Text style={styles.body}>{body}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.REGULAR,
    fontSize: 21,
    fontWeight: '500',
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    fontFamily: fonts.REGULAR,
  },
})

export default EmptyState
