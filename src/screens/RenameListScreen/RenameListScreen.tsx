import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  TextInput,
  Alert,
} from 'react-native'

import { RouteProp } from '@react-navigation/native'
import {
  RootStackParamList,
  RenameListNavigationProp,
} from '../../types/Navigation'
import { useTheme } from '@react-navigation/native'

import { useMutation } from '@apollo/react-hooks'
import { UPDATE_LIST_MUTATION } from '../../queries/updateList'
import * as UpdateListTypes from '../../queries/__generated__/UpdateList'

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

    const [formData, setFormData] = React.useState<FormData>({
      name: route.params.list.name,
    })
    const nameEmpty = formData.name?.length === 0

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
            onPress={() => (nameEmpty ? {} : updateList())}>
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
    }, [])

    const [updateList, { error }] = useMutation<
      UpdateListTypes.UpdateList,
      UpdateListTypes.UpdateListVariables
    >(UPDATE_LIST_MUTATION, {
      variables: {
        listId: route.params.list.id,
        name: formData.name,
      },
      onCompleted: (data) => {
        if (data.updateList?.id) {
          navigation.goBack()
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
              title: 'List name',
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
              autoCapitalize="words"
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
