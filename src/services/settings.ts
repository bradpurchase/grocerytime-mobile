import AsyncStorage from '@react-native-community/async-storage'

export const getSettingValue = async (key: string): Promise<boolean> => {
  try {
    const setting = await AsyncStorage.getItem(key)
    if (setting !== null) {
      return JSON.parse(setting)
    }
  } catch (e) {
    console.log(e)
  }
  return false
}

export const setDefaultSettings = async () => {
  const defaultSettings = [
    ['firstRun', 'true'],
    ['settings.appearance', 'system'],
    ['settings.autoCapitalize', 'true'],
    ['settings.autoCorrect', 'false'],
  ]
  try {
    defaultSettings.map(async (setting) => {
      const settingData = await AsyncStorage.getItem(setting[0])
      if (settingData === null) {
        await AsyncStorage.setItem(setting[0], setting[1])
      }
    })
  } catch (e) {
    console.log(e)
  }
  console.log('done setting default settings')
}
