import * as React from 'react'
import { View, TextInput, Image, StyleSheet } from 'react-native'

import ListContext from '../../context/ListContext'

import { useMutation } from '@apollo/react-hooks'
import { ADD_ITEM_TO_LIST_MUTATION } from '../../queries/addItemToList'
import * as AddItemToListTypes from '../../queries/__generated__/AddItemToList'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

const AddItemInput: React.FC = () => {
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
    textInputRef.current?.focus()
  }

  const handleAddItem = () => {
    if (item.length === 0) return
    addItemToList()
  }

  return (
    <View style={styles.container}>
      <Image style={styles.icon} source={require('../../assets/icons/Plus.png')} />
      <TextInput
        style={styles.textInput}
        placeholder="Add an item..."
        placeholderTextColor="#666"
        returnKeyType="done"
        ref={textInputRef}
        onChangeText={(text) => setItem(text)}
        onSubmitEditing={() => handleAddItem()}
      />
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 64,
    color: colors.BLACK,
    flexDirection: 'row', 
    fontFamily: fonts.REGULAR,
    margin: 20,
    height: 50,
    paddingHorizontal: 20,
  },
  icon: {
    alignItems: 'center',
    marginRight: 10,
    resizeMode: 'stretch',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
})

export default AddItemInput
