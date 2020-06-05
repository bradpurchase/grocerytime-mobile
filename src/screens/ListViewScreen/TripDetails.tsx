import * as React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@react-navigation/native'

import ListContext from '../../context/ListContext'
import { Trip } from '../../types'

const TripDetails: React.FC = React.memo(() => {
  const { colors } = useTheme()

  const listContext = React.useContext(ListContext)
  const { data } = listContext
  const trip: Trip = data.list.trip

  return (
    <View
      style={{
        flexDirection: 'column',
        margin: 20,
        marginBottom: 0,
      }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 24,
          fontWeight: '700',
          flexDirection: 'row',
          lineHeight: 35,
        }}>
        {trip.name}
      </Text>
      <Text
        style={{
          color: colors.subtitle,
          fontSize: 18,
          fontWeight: '500',
          flexDirection: 'row',
        }}>
        0/{trip.itemsCount} items completed
      </Text>
    </View>
  )
})

export default TripDetails
