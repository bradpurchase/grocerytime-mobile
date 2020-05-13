import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native'

import { RouteProp } from '@react-navigation/native'
import {
  RootStackParamList,
  RenameListNavigationProp,
} from '../../types/Navigation'

import { useMutation } from '@apollo/react-hooks'
import { UPDATE_LIST_MUTATION } from '../../queries/updateList'
import * as UpdateListTypes from '../../queries/__generated__/UpdateList'

import colors from '../../styles/colors'

interface Props {
  route: RouteProp<RootStackParamList, 'RenameList'>
  navigation: RenameListNavigationProp
}

type FormData = {
  name: string
}

const RenameListScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const [formData, setFormData] = React.useState<FormData>({
      name: route.params.list.name,
    })
    const nameEmpty = formData.name.length === 0

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.headerButtonLabel}>Cancel</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            style={styles.headerButton}
            activeOpacity={nameEmpty ? 1 : 0.7}
            onPress={() => (nameEmpty ? {} : updateList())}>
            <Text
              style={StyleSheet.flatten([
                styles.headerButtonLabel,
                { opacity: nameEmpty ? 0.7 : 1 },
              ])}>
              Done
            </Text>
          </TouchableOpacity>
        ),
      })
    })

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
      <View style={styles.container}>
        <SectionList
          sections={[
            {
              title: 'List name',
              data: ['Name your list'],
            },
          ]}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.label}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.inputCell}>
              <TextInput
                style={styles.input}
                placeholderTextColor="#666"
                placeholder={item}
                clearButtonMode="while-editing"
                autoCapitalize="words"
                defaultValue={route.params.list.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
            </View>
          )}
          keyExtractor={(index) => index.toString()}
        />
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  headerButton: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: 70,
  },
  headerButtonLabel: {
    color: colors.WHITE,
    fontSize: 16,
  },
  inputCell: {
    backgroundColor: colors.WHITE,
    display: 'flex',
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
    paddingHorizontal: 20,
    textTransform: 'uppercase',
  },
  input: {
    flexDirection: 'column',
    fontSize: 16,
    paddingVertical: 5,
  },
  sectionFooter: {
    color: colors.MEDIUM_GREY,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 25,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
})

export default RenameListScreen
