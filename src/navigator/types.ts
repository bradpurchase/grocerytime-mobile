import { StackNavigationProp } from '@react-navigation/stack'

type RootStackParamList = {
  Login: undefined
  Signup: undefined
  Lists: undefined
  ListView: { list: { id: string; name: string } }
}

type ListCellNavigationProp = StackNavigationProp<RootStackParamList, 'Lists'>

export { RootStackParamList, ListCellNavigationProp }
