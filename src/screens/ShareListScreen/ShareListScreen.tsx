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

interface Props {
  route: RouteProp<RootStackParamList, 'ShareList'>
  navigation: ShareListNavigationProp
}

interface FormData {
  email?: string
}

const ShareListScreen: React.FC<Props> = React.memo(
  ({ route, navigation }: Props) => {
    const { colors } = useTheme()

    const [formData, setFormData] = React.useState<FormData>()

    return (
      <View style={{ flex: 1 }}>
        <SectionList
          sections={[
            {
              title: 'Share by invitation',
              data: ['Name your list'],
            },
            {
              title: 'People in this list',
              data: [],
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
          renderItem={() => (
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
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          )}
          keyExtractor={(index) => index.toString()}
        />
      </View>
    )
  },
)

export default ShareListScreen
