import { StackNavigationProp } from '@react-navigation/stack'
import { List } from './List'

export type RootStackParamList = {
  Main: undefined
  Login: undefined
  Signup: undefined
  Settings: undefined
  JoinList: { id: string }
  Lists: undefined
  NewList: undefined
  RenameList: { list: List }
  ShareList: { list: List }
  ListView: { list: List }
}

export type LoginNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>

export type SettingsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Settings'
>

export type JoinListNavigationProp = StackNavigationProp<
  RootStackParamList,
  'JoinList'
>

export type ListCellNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Lists'
>

export type ListViewNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ListView'
>

export type NewListNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NewList'
>

export type RenameListNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RenameList'
>

export type ShareListNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ShareList'
>
