import { User } from './User'

export interface ListUser {
  id: string
  userId: string
  creator: boolean
  email: string
  user?: User
}
