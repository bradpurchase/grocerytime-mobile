import * as React from 'react'
import { View, TextInput, Image } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { useColorScheme } from 'react-native-appearance'

import ListContext from '../../context/ListContext'

import { useMutation } from '@apollo/react-hooks'
import { ADD_ITEM_TO_TRIP_MUTATION } from '../../queries/addItemToTrip'
import * as AddItemToTripTypes from '../../queries/__generated__/AddItemToTrip'

import { getSettingValue } from '../../services/settings'

interface AddItemInputSettings {
  autoCapitalize: boolean
  autoCorrect: boolean
}

const AddItemInput: React.FC = React.memo(() => {
  const { colors } = useTheme()
  const colorScheme = useColorScheme()

  const [settings, setSettings] = React.useState<AddItemInputSettings>({
    autoCapitalize: true,
    autoCorrect: false,
  })

  const listContext = React.useContext(ListContext)
  const { data, refetch } = listContext
  if (!data) return null

  const [item, setItem] = React.useState<string>('')
  const textInputRef = React.useRef<TextInput>(null)

  const [addItemToTrip, { error }] = useMutation<
    AddItemToTripTypes.AddItemToTrip,
    AddItemToTripTypes.AddItemToTripVariables
  >(ADD_ITEM_TO_TRIP_MUTATION, {
    variables: {
      tripId: data.list.trip.id,
      name: item,
      quantity: 1,
    },
    onCompleted: (data) => {
      refetch()
      resetInput()
    },
  })
  if (error) console.log(error)

  const resetInput = () => {
    textInputRef.current?.clear()
  }

  const handleAddItem = () => {
    if (item.length === 0) return
    addItemToTrip()
  }

  const getSettings = async () => {
    const autoCapitalize = await getSettingValue('settings.autoCapitalize')
    const autoCorrect = await getSettingValue('settings.autoCorrect')
    if (autoCapitalize !== null && autoCorrect !== null) {
      setSettings({ autoCapitalize, autoCorrect })
    }
  }

  React.useEffect(() => {
    getSettings()
  }, [])

  return (
    <View
      style={{
        backgroundColor: colorScheme === 'dark' ? colors.card : '#ddd',
        borderRadius: 8,
        flexDirection: 'row',
        zIndex: 9999,
        padding: 18,
        alignSelf: 'center',
        margin: 10,
        marginVertical: 20,
      }}>
      <Image
        style={{
          alignItems: 'center',
          marginRight: 10,
          resizeMode: 'stretch',
        }}
        source={
          colorScheme === 'dark'
            ? require('../../assets/icons/PlusWhite.png')
            : require('../../assets/icons/PlusDark.png')
        }
      />
      <TextInput
        style={{
          flex: 1,
          fontSize: 17,
          fontWeight: '500',
        }}
        placeholder="Add an item..."
        placeholderTextColor={colorScheme === 'dark' ? '#ddd' : '#333'}
        returnKeyType="done"
        ref={textInputRef}
        onChangeText={(text) => setItem(text)}
        onSubmitEditing={() => handleAddItem()}
        autoCorrect={settings.autoCorrect ?? false}
        autoCapitalize={settings.autoCapitalize ? 'words' : 'sentences'}
      />
    </View>
  )
})
export default AddItemInput
