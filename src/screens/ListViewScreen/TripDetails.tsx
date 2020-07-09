import * as React from 'react'
import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native'
import { useTheme } from '@react-navigation/native'
import FastImage from 'react-native-fast-image'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

import i18n from '../../i18n'

import { useMutation } from '@apollo/react-hooks'
import { UPDATE_TRIP_MUTATION } from '../../queries/updateTrip'
import * as UpdateTripTypes from '../../queries/__generated__/UpdateTrip'

import ListContext from '../../context/ListContext'
import { Trip } from '../../types'
import { numCompletedItems, allItemsCompleted } from '../../services/trip'
import { getSettingValue } from '../../services/settings'

interface EditItemInputSettings {
  autoCapitalize: boolean
  autoCorrect: boolean
}

const TripDetails: React.FC = React.memo(() => {
  const { colors } = useTheme()

  const listContext = React.useContext(ListContext)
  const { data, refetch } = listContext
  const trip: Trip = data.list.trip

  const [editingMode, setEditingMode] = React.useState<boolean>(false)
  const [tripName, setTripName] = React.useState<string>(trip.name)
  const tripNameInputRef = React.useRef<TextInput>(null)

  const [settings, setSettings] = React.useState<EditItemInputSettings>({
    autoCapitalize: true,
    autoCorrect: false,
  })

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

  React.useEffect(() => {
    // Focus the trip name TextInput when editing mode is enabled
    if (editingMode) {
      tripNameInputRef?.current?.focus()
    }
  }, [editingMode])

  const [updateTrip, { error }] = useMutation<
    UpdateTripTypes.UpdateTrip,
    UpdateTripTypes.UpdateTripVariables
  >(UPDATE_TRIP_MUTATION, {
    onCompleted: (data) => {
      setEditingMode(!editingMode)
      if (data.updateTrip?.completed) {
        refetch()
      }
    },
  })
  if (error && error.graphQLErrors) {
    Alert.alert('Oops!', error.graphQLErrors[0].message)
  }

  const completedItems: number = numCompletedItems(trip)
  const tripFinished: boolean = allItemsCompleted(trip)

  const handleCompleteTripTapped = () => {
    ReactNativeHapticFeedback.trigger('impactLight')
    let body = i18n.t('trips.items_remaining_complete_trip_prompt_body')
    let options = [
      {
        text: i18n.t('global.cancel'),
        onPress: () => console.log('Cancel pressed...'),
        style: 'cancel',
      },
    ]
    if (tripFinished) {
      body = i18n.t('trips.complete_trip_prompt_body')
      options.push({
        text: i18n.t('trips.complete_trip'),
        onPress: () =>
          updateTrip({ variables: { tripId: trip.id, completed: true } }),
        style: 'default',
      })
    } else {
      options.push(
        {
          text: i18n.t('trips.complete_and_copy_items'),
          onPress: () =>
            updateTrip({
              variables: {
                tripId: trip.id,
                completed: true,
                copyRemainingItems: true,
              },
            }),
          style: 'default',
        },
        {
          text: i18n.t('trips.complete_and_start_fresh_trip'),
          onPress: () =>
            updateTrip({ variables: { tripId: trip.id, completed: true } }),
          style: 'default',
        },
      )
    }
    Alert.alert(i18n.t('trips.complete_trip_prompt_heading'), body, options)
  }

  const handleUpdateTripName = () => {
    updateTrip({
      variables: {
        tripId: trip.id,
        name: tripName,
      },
      optimisticResponse: {
        updateTrip: {
          __typename: 'GroceryTrip',
          id: trip.id,
          completed: trip.completed,
          name: tripName,
        },
      },
    })
  }

  return (
    <View style={{ flexDirection: 'row', margin: 20, marginBottom: 0 }}>
      {editingMode ? (
        <TextInput
          ref={tripNameInputRef}
          style={{
            backgroundColor: 'transparent',
            flexDirection: 'column',
            fontSize: 24,
            fontWeight: '700',
            width: 300,
          }}
          defaultValue={tripName}
          returnKeyType="done"
          clearTextOnFocus
          placeholder={i18n.t('trips.enter_trip_name')}
          onChangeText={(text) => setTripName(text)}
          onSubmitEditing={() => handleUpdateTripName()}
          autoCorrect={settings.autoCorrect ?? false}
          autoCapitalize={settings.autoCapitalize ? 'words' : 'sentences'}
        />
      ) : (
        <TouchableOpacity
          style={{
            flexDirection: 'column',
            flex: 1,
          }}
          onPress={() => setEditingMode(!editingMode)}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{
              color: colors.text,
              fontSize: 24,
              fontWeight: '700',
              flexDirection: 'row',
              lineHeight: 35,
              width: 300,
            }}>
            {trip.name}
          </Text>
          <Text
            style={{
              color: colors.subtitle,
              fontSize: 18,
              fontWeight: '500',
              flexDirection: 'row',
            }}>
            {trip.itemsCount > 0 ? (
              <>
                {i18n.t('items.items_to_pickup_count', {
                  count: trip.itemsCount - completedItems,
                })}
              </>
            ) : (
              <>{i18n.t('items.empty_state.heading')}</>
            )}
          </Text>
        </TouchableOpacity>
      )}

      {!editingMode && (
        <View
          style={{
            alignSelf: 'center',
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'column',
          }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              position: 'absolute',
              right: 0,
            }}
            onPress={() => handleCompleteTripTapped()}>
            <FastImage
              style={{
                width: 25,
                height: 25,
              }}
              resizeMode="contain"
              source={require('../../assets/icons/CheckmarkGreen.png')}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
})

export default TripDetails
