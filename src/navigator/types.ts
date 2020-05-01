import { StackNavigationProp } from '@react-navigation/stack'

export type RootStackParamList = {
  Main: undefined
  Login: undefined
  Signup: undefined
  Lists: undefined
  NewList: undefined
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

export type NewListNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NewList'
>

export type ListViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ListView'
>
