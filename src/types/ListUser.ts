import { User } from './User'

export interface ListUser {
  userId: string
  creator: boolean
  user?: User
}
