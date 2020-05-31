import * as React from 'react'
import { useTheme } from '@react-navigation/native'
import { View, Text, Switch } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import { Setting } from '../../types'
import { getSettingValue } from '../../services/settings'

interface Props {
  setting: Setting
}

const SettingsCell: React.FC<Props> = React.memo(({ setting }) => {
  const { colors } = useTheme()

  const [val, setVal] = React.useState<string>('false')

  const loadValue = async () => {
    const settingValue = await getSettingValue(setting.key)
    if (settingValue !== null) {
      setVal(JSON.stringify(settingValue))
    }
  }

  React.useEffect(() => {
    loadValue()
  }, [])

  const saveValue = async (newVal: boolean) => {
    try {
      const newValStr = JSON.stringify(newVal)
      await AsyncStorage.setItem(setting.key, newValStr)
      setVal(newValStr)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSwitchToggle = (newVal: boolean) => {
    saveValue(newVal)
  }

  const switchValue = JSON.parse(val)
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 8,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
        paddingVertical: 20,
        marginHorizontal: 8,
        marginBottom: 8,
      }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 16,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>
        {setting.name}
      </Text>
      <Switch
        value={switchValue}
        onValueChange={handleSwitchToggle}
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          position: 'absolute',
          right: 20,
        }}
      />
    </View>
  )
})

export default SettingsCell
