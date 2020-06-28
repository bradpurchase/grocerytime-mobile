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

import { getSettingValue } from '../../services/settings'

interface NewListInputSettings {
  autoCapitalize: boolean
  autoCorrect: boolean
}

interface Props {
  navigation: NewListNavigationProp
}

type FormData = {
  name: string
}

const NewListScreen: React.FC<Props> = React.memo(({ navigation }: Props) => {
  const { colors } = useTheme()

  const [settings, setSettings] = React.useState<NewListInputSettings>({
    autoCapitalize: true,
    autoCorrect: false,
  })

  const [formData, setFormData] = React.useState<FormData>({ name: '' })
  const nameEmpty = formData.name.length === 0

  React.useLayoutEffect(() => {
    navigation.setOptions({
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
        navigation.navigate('ShareNewList', {
          list: data.createList,
        })
      }
    },
  })

  if (error && error.graphQLErrors) {
    Alert.alert('Oops!', error.graphQLErrors[0].message)
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
        flex: 1,
        marginTop: 30,
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
              marginTop: 10,
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
            autoCorrect={settings.autoCorrect ?? false}
            autoCapitalize={settings.autoCapitalize ? 'words' : 'sentences'}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        )}
        keyExtractor={(index) => index.toString()}
      />
    </View>
  )
})

export default NewListScreen
