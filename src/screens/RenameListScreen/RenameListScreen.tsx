import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  TextInput,
  Alert,
} from 'react-native'
import { RouteProp, useTheme } from '@react-navigation/native'

import i18n from '../../i18n'

import { useMutation } from '@apollo/react-hooks'
import { UPDATE_LIST_MUTATION } from '../../queries/updateList'
import * as UpdateListTypes from '../../queries/__generated__/UpdateList'

import {
  RootStackParamList,
  RenameListNavigationProp,
} from '../../types/Navigation'

import { getSettingValue } from '../../services/settings'

interface RenameListInputSettings {
  autoCapitalize: boolean
  autoCorrect: boolean
}

interface Props {
  route: RouteProp<RootStackParamList, 'RenameList'>
  navigation: RenameListNavigationProp
}

type FormData = {
  name: string | undefined
}

const RenameListScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const { colors } = useTheme()

    const listId = route.params.list.id

    const [settings, setSettings] = React.useState<RenameListInputSettings>({
      autoCapitalize: true,
      autoCorrect: false,
    })

    const [formData, setFormData] = React.useState<FormData>({
      name: route.params.list.name,
    })
    const nameEmpty = formData.name?.length === 0

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
            onPress={() => (nameEmpty ? {} : updateList())}>
            <Text
              style={{
                color: colors.primary,
                fontSize: 16,
                opacity: nameEmpty ? 0.7 : 1,
              }}>
              {i18n.t('global.done')}
            </Text>
          </TouchableOpacity>
        ),
      })
    }, [])

    const [updateList, { error }] = useMutation<
      UpdateListTypes.UpdateList,
      UpdateListTypes.UpdateListVariables
    >(UPDATE_LIST_MUTATION, {
      variables: {
        listId,
        name: formData.name,
      },
      onCompleted: (data) => {
        if (data.updateList?.id) {
          navigation.goBack()
        }
      },
    })
    if (error && error.graphQLErrors) {
      Alert.alert(i18n.t('errors.oops'), error.graphQLErrors[0].message)
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
              title: i18n.t('lists.list_name'),
              data: [i18n.t('lists.name_your_list')],
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
          renderItem={({ item }) => (
            <TextInput
              style={{
                backgroundColor: colors.card,
                display: 'flex',
                flexDirection: 'column',
                fontSize: 16,
                padding: 20,
              }}
              placeholderTextColor="#666"
              placeholder={item}
              clearButtonMode="while-editing"
              autoCorrect={settings.autoCorrect ?? false}
              autoCapitalize={settings.autoCapitalize ? 'words' : 'sentences'}
              defaultValue={route.params.list.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          )}
          keyExtractor={(index) => index.toString()}
        />
      </View>
    )
  },
)

export default RenameListScreen
