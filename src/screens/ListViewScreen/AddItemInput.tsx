import * as React from 'react'
import { View, TextInput, Image } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { useColorScheme } from 'react-native-appearance'

import ListContext from '../../context/ListContext'

import { useMutation } from '@apollo/react-hooks'
import { ADD_ITEM_TO_LIST_MUTATION } from '../../queries/addItemToList'
import * as AddItemToListTypes from '../../queries/__generated__/AddItemToList'

import { getSettingValue } from '../../services/settings'

const AddItemInput: React.FC = React.memo(() => {
  const { colors } = useTheme()
  const colorScheme = useColorScheme()

  const [autoCapitalize, setAutoCapitalize] = React.useState<boolean>(false)

  const listContext = React.useContext(ListContext)
  const { data, refetch } = listContext
  if (!data) return null

  const [item, setItem] = React.useState<string>('')
  const textInputRef = React.useRef<TextInput>(null)

  const [addItemToList, { error }] = useMutation<
    AddItemToListTypes.AddItemToList,
    AddItemToListTypes.AddItemToListVariables
  >(ADD_ITEM_TO_LIST_MUTATION, {
    variables: {
      listId: data.list.id,
      name: item,
      quantity: 1,
    },
    onCompleted: (data) => {
      refetch()
      resetInput()
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const resetInput = () => {
    textInputRef.current?.clear()
  }

  const handleAddItem = () => {
    if (item.length === 0) return
    addItemToList()
  }

  const autoCapitalizeSetting = async () => {
    const autoCapitalize = await getSettingValue('settings.autoCapitalize')
    if (autoCapitalize !== null) {
      setAutoCapitalize(autoCapitalize)
    }
  }

  React.useEffect(() => {
    autoCapitalizeSetting()
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
        autoCorrect={false}
        autoCapitalize={autoCapitalize ? 'words' : 'none'}
      />
    </View>
  )
})
export default AddItemInput
