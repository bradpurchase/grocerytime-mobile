import * as React from 'react'
import { Text, StyleSheet } from 'react-native'

import fonts from '../../styles/fonts'

interface Props {
  title: string
}

const SectionCell: React.FC<Props> = ({ title }: Props) => (
  <Text style={styles.sectionHeader}>{title}</Text>
)

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 14,
    fontFamily: fonts.REGULAR,
    fontWeight: '500',
    padding: 10,
    paddingHorizontal: 30,
    textTransform: 'uppercase',
  },
})

export default SectionCell
