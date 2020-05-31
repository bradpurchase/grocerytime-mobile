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
  ]
  try {
    await AsyncStorage.multiSet(defaultSettings)
  } catch (e) {
    console.log(e)
  }
  console.log('done setting default settings')
}
