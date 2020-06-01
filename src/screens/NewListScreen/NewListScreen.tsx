import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native'
import { useTheme } from '@react-navigation/native'

import { NewListNavigationProp } from '../../types/Navigation'

import { useMutation } from '@apollo/react-hooks'
import { CREATE_LIST_MUTATION } from '../../queries/createList'
import * as CreateListTypes from '../../queries/__generated__/CreateList'

interface Props {
  navigation: NewListNavigationProp
}

type FormData = {
  name: string
}

const NewListScreen: React.FC<Props> = React.memo(({ navigation }: Props) => {
  const { colors } = useTheme()

  const [formData, setFormData] = React.useState<FormData>({ name: '' })
  const nameEmpty = formData.name.length === 0

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
            width: 70,
          }}
          onPress={() => navigation.goBack()}>
          <Text
            style={{
              color: colors.primary,
              fontSize: 16,
            }}>
            Cancel
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
            width: 70,
          }}
          activeOpacity={nameEmpty ? 1 : 0.7}
          onPress={() => (nameEmpty ? {} : createList())}>
          <Text
            style={{
              color: colors.primary,
              fontSize: 16,
              opacity: nameEmpty ? 0.7 : 1,
            }}>
            Done
          </Text>
        </TouchableOpacity>
      ),
    })
  })

  const [createList, { error }] = useMutation<
    CreateListTypes.CreateList,
    CreateListTypes.CreateListVariables
  >(CREATE_LIST_MUTATION, {
    variables: {
      name: formData.name,
    },
    onCompleted: (data) => {
      if (data.createList?.id) {
        Keyboard.dismiss()
        navigation.navigate('ShareList', {
          list: {
            id: data.createList.id,
            name: formData.name,
          },
        })
      }
    },
  })

  if (error && error.graphQLErrors) {
    Alert.alert('Oops!', error.graphQLErrors[0].message)
  }

  return (
    <View
      style={{
        flex: 1,
        marginTop: 20,
      }}>
      <SectionList
        sections={[
          {
            title: 'List details',
            data: ['Name your list'],
          },
        ]}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              fontWeight: '500',
              padding: 10,
              paddingHorizontal: 20,
              textTransform: 'uppercase',
            }}>
            {title}
          </Text>
        )}
        renderSectionFooter={() => (
          <Text
            style={{
              color: colors.subtitle,
              fontSize: 15,
              lineHeight: 24,
              marginTop: 20,
              paddingHorizontal: 20,
              textAlign: 'center',
            }}>
            After creating this list, you can share it with others and work on
            it together.
          </Text>
        )}
        renderItem={({ item }) => (
          <TextInput
            style={{
              backgroundColor: colors.card,
              display: 'flex',
              flexDirection: 'column',
              fontSize: 16,
              padding: 20,
            }}
            placeholderTextColor="#999"
            placeholder={item}
            clearButtonMode="while-editing"
            autoCapitalize="words"
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        )}
        keyExtractor={(index) => index.toString()}
      />
    </View>
  )
})

export default NewListScreen
