import * as React from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  ActionSheetIOS,
  TouchableOpacity,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'

import { RootStackParamList } from '../../navigator/types'

import { useQuery } from '@apollo/react-hooks'
import { LIST_QUERY } from '../../queries/list'

import ListContext from '../../context/ListContext'
import { ListViewNavigationProp } from '../../navigator/types'

import ItemsList from './ItemsList'
import AddItemInput from './AddItemInput'

interface Props {
  route: RouteProp<RootStackParamList, 'ListView'>
  navigation: ListViewNavigationProp
}

const ListViewScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const { loading, data, refetch } = useQuery(LIST_QUERY, {
      variables: { id: route.params.list.id },
    })

    const shareActionSheet = () => {
      const shareUrl = `https://groceryti.me/share/${route.params.list.id}`
      return ActionSheetIOS.showShareActionSheetWithOptions(
        {
          message: `I'd like to work on my grocery list "${route.params.list.name}" with you in the app GroceryTime. Click here to join: ${shareUrl}`,
        },
        (error) => console.log(error),
        (success, method) => console.log(success, method),
      )
    }

    const menuActionSheet = () => {
      return ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Share with others...', 'Delete list...', 'Dismiss'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        (buttonIdx) => {
          console.log(`Tapped buttonIdx ${buttonIdx}`)
          if (buttonIdx === 0) {
            shareActionSheet()
          } else if (buttonIdx === 1) {
            deleteListConfirmationActionSheet()
          }
        },
      )
    }

    const deleteListConfirmationActionSheet = () => {
      //TODO consider: if the list is shared, do we need to do anything
      // different when deleting it? (at least a diff message)
      return ActionSheetIOS.showActionSheetWithOptions(
        {
          message:
            'Are you sure you want to delete this list? You cannot undo this action.',
          options: ['Delete', 'Dismiss'],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        },
        (buttonIdx) => {
          if (buttonIdx === 0) {
            //TODO call delete list mutation
          }
        },
      )
    }

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => menuActionSheet()}>
            <Image
              style={styles.icon}
              source={require('../../assets/icons/MenuVerticalWhite.png')}
            />
          </TouchableOpacity>
        ),
      })
    }, [])

    if (loading) {
      return (
        <View
          style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return (
      <ListContext.Provider value={{ data, refetch }}>
        <View style={styles.container}>
          <AddItemInput />
          <ItemsList />
        </View>
      </ListContext.Provider>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: 50,
  },
  icon: {
    justifyContent: 'center',
    resizeMode: 'contain',
  },
})

export default ListViewScreen
