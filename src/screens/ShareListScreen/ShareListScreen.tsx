import * as React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { RouteProp } from '@react-navigation/native'
import {
  RootStackParamList,
  ShareListNavigationProp,
} from '../../navigator/types'

import { List } from '../../types/List'
import { shareActionSheet } from '../../helpers/ListActions'

import Button from '../../components/Button'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

interface Props {
  route: RouteProp<RootStackParamList, 'ShareList'>
  navigation: ShareListNavigationProp
}

const ShareListScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const list: List = route.params.list

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => <></>,
        headerRight: () => (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.popToTop()}>
            <Text style={styles.headerButtonLabel}>Done</Text>
          </TouchableOpacity>
        ),
      })
    })

    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Your list was created!</Text>
        <Text style={styles.textLabel}>
          Next, share this list with others. Tap the button below to share this
          list using your method of choice. Once shared, you can collaborate on
          it together and see updates in real time.
        </Text>
        <Text style={styles.textLabel}>
          You can also receive notifications when new items are added to this
          list by other members. Simply make sure notifications are enabled for
          GroceryTime!
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            label="Share this List"
            onPress={() => shareActionSheet(list)}
          />
        </View>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 20,
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
    fontFamily: fonts.REGULAR,
    fontSize: 16,
  },
  heading: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: fonts.REGULAR,
    marginBottom: 30,
  },
  textLabel: {
    textAlign: 'center',
    color: colors.DARK_GREY,
    fontFamily: fonts.REGULAR,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 10,
  },
})

export default ShareListScreen
