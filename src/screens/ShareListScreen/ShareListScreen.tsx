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

import {
  RootStackParamList,
  ShareListNavigationProp,
} from '../../types/Navigation'
import { List, ListUser } from '../../types'
import { listIsShared } from '../../services/list'

interface Props {
  route: RouteProp<RootStackParamList, 'ShareList'>
  navigation: ShareListNavigationProp
}

interface FormData {
  email?: string
}

interface Section {
  title: string
  data: any
}

const ShareListScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const { colors } = useTheme()

    const [formData, setFormData] = React.useState<FormData>({})

    const list: List = route.params.list
    const listUsers: ListUser[] = list.listUsers

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
            onPress={() => navigation.goBack()}>
            <Text
              style={{
                color: colors.primary,
                fontSize: 16,
              }}>
              Done
            </Text>
          </TouchableOpacity>
        ),
      })
    })

    return (
      <View style={{ flex: 1 }}>
        <SectionList<string | ListUser[]>
          sections={[
            {
              title: 'Share by invitation',
              data: ['Name your list'],
            },
            {
              title: 'People in this list',
              data: [listUsers],
            },
          ]}
          renderSectionHeader={({ section: { title } }) => (
            <Text
              style={{
                color: colors.text,
                fontSize: 14,
                fontWeight: '500',
                marginTop: 30,
                padding: 10,
                paddingHorizontal: 20,
                textTransform: 'uppercase',
              }}>
              {title}
            </Text>
          )}
          renderSectionFooter={({ section: { title } }) => {
            if (title === 'Share by invitation') {
              return (
                <Text
                  style={{
                    color: colors.subtitle,
                    fontSize: 15,
                    lineHeight: 24,
                    marginTop: 10,
                    paddingHorizontal: 20,
                    textAlign: 'center',
                  }}>
                  We'll send an email to this person with a link to sign up and
                  join this list so they can work on it with you.
                </Text>
              )
            }
            return null
          }}
          renderItem={({ section: { title } }) => {
            if (title === 'Share by invitation') {
              return (
                <TextInput
                  autoCompleteType="email"
                  style={{
                    backgroundColor: colors.card,
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: 16,
                    padding: 20,
                  }}
                  placeholderTextColor="#666"
                  placeholder="Enter an email address"
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                />
              )
            }
            return (
              <View
                style={{
                  backgroundColor: colors.card,
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                {list.listUsers?.map((listUser: ListUser) => (
                  <View
                    key={listUser.userId}
                    style={{
                      backgroundColor: colors.card,
                      flexDirection: 'row',
                      padding: 20,
                    }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 16,
                        fontWeight: '500',
                        flexDirection: 'column',
                      }}>
                      {listUser.user?.email}
                    </Text>
                    {listUser.creator && (
                      <Text
                        style={{
                          color: colors.subtitle,
                          fontSize: 14,
                          fontWeight: '500',
                          flexDirection: 'column',
                          marginLeft: 5,
                          lineHeight: 20,
                        }}>
                        (creator)
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )
          }}
          keyExtractor={(index) => index.toString()}
        />
      </View>
    )
  },
)

export default ShareListScreen
