import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  TextInput,
  Keyboard,
  Alert,
  StyleSheet,
} from 'react-native'

import { NewListNavigationProp } from '../../types/Navigation'

import { useMutation } from '@apollo/react-hooks'
import { CREATE_LIST_MUTATION } from '../../queries/createList'
import * as CreateListTypes from '../../queries/__generated__/CreateList'

import colors from '../../styles/colors'

interface Props {
  navigation: NewListNavigationProp
}

type FormData = {
  name: string
}

const NewListScreen: React.FC<Props> = React.memo(({ navigation }: Props) => {
  const [formData, setFormData] = React.useState<FormData>({ name: '' })
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
          onPress={() => (nameEmpty ? {} : createList())}>
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
    <View style={styles.container}>
      <SectionList
        sections={[
          {
            title: 'List details',
            data: ['Name your list'],
          },
        ]}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.label}>{title}</Text>
        )}
        renderSectionFooter={() => (
          <Text style={styles.sectionFooter}>
            After creating this list, you can share it with others and work on
            it together.
          </Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.inputCell}>
            <TextInput
              style={styles.input}
              placeholderTextColor="#666"
              placeholder={item}
              clearButtonMode="while-editing"
              autoCapitalize="words"
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>
        )}
        keyExtractor={(index) => index.toString()}
      />
    </View>
  )
})

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
    color: colors.RED,
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
    fontSize: 15,
    lineHeight: 24,
    marginTop: 25,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
})

export default NewListScreen
