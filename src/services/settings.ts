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
