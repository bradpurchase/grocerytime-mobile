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
  NewListNavigationProp,
  RootStackParamList,
} from '../../navigator/types'

import { useMutation } from '@apollo/react-hooks'
import { CREATE_LIST_MUTATION } from '../../queries/createList'
import * as CreateListTypes from '../../queries/__generated__/CreateList'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

interface Props {
  navigation: NewListNavigationProp
}

type FormData = {
  name: string
}

const NewListScreen: React.FC<Props> = React.memo(({ navigation }: Props) => {
  const [formData, setFormData] = React.useState<FormData>({ name: '' })

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
          activeOpacity={formData.name.length === 0 ? 1 : 0.7}
          onPress={() => createList()}>
          <Text
            style={StyleSheet.flatten([
              styles.headerButtonLabel,
              { opacity: formData.name.length === 0 ? 0.7 : 1 },
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
            title: 'List details',
            data: ['Name your list'],
          },
        ]}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.label}>{title}</Text>
        )}
        renderSectionFooter={() => (
          <Text style={styles.sectionFooter}>
            After creating this list you will be sent to a screen that will
            allow you to share it and work on it with others.
          </Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.inputCell}>
            <TextInput
              style={styles.input}
              placeholderTextColor="#666"
              placeholder={item}
              clearButtonMode="while-editing"
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
    color: '#fff',
    fontFamily: fonts.REGULAR,
    fontSize: 16,
  },
  inputCell: {
    backgroundColor: colors.WHITE,
    display: 'flex',
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.REGULAR,
    fontWeight: '500',
    padding: 10,
    paddingHorizontal: 20,
    textTransform: 'uppercase',
  },
  input: {
    flexDirection: 'column',
    fontFamily: fonts.REGULAR,
    fontSize: 16,
    paddingVertical: 5,
  },
  sectionFooter: {
    color: colors.MEDIUM_GREY,
    fontFamily: fonts.REGULAR,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 25,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
})

export default NewListScreen
