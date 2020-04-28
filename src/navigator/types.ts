import { StackNavigationProp } from '@react-navigation/stack'

export type RootStackParamList = {
  Login: undefined
  Signup: undefined
  Lists: undefined
  ListView: { list: { id: string; name: string } }
}

export type LoginNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>

export type ListCellNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Lists'
>

export type ListViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ListView'
>
