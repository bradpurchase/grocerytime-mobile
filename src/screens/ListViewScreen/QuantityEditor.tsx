import * as React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTheme } from '@react-navigation/native'

import ItemContext from '../../context/ItemContext'

const QuantityEditor: React.FC = React.memo(() => {
  const { colors } = useTheme()

  const itemContext = React.useContext(ItemContext)
  const { item } = itemContext

  return (
    <View style={{ flexDirection: 'column' }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            alignItems: 'center',
            backgroundColor: '#ddd',
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            padding: 10,
            paddingVertical: 12,
            width: 40,
          }}>
          <Text style={{ fontSize: 14, fontWeight: '500' }}>-</Text>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#f3f3f3',
            alignItems: 'center',
            padding: 10,
            paddingVertical: 12,
            width: 50,
          }}>
          <Text style={{ fontSize: 14, fontWeight: '500' }}>
            {item?.quantity}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            alignItems: 'center',
            backgroundColor: '#ddd',
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            padding: 16,
            paddingVertical: 12,
            width: 40,
          }}>
          <Text style={{ fontSize: 14, fontWeight: '500' }}>+</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Text
          style={{
            color: colors.subtitle,
            fontSize: 12,
          }}>
          Quantity
        </Text>
      </View>
    </View>
  )
})

export default QuantityEditor
