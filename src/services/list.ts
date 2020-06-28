import { List, ListUser } from '../types'

export const getListCreator = (list: List): ListUser | undefined => {
  return list.listUsers?.find((user) => user.creator)
}

export const currentUserIsCreator = (
  currentUserId: string,
  list: List,
): boolean => {
  const creatorUser = getListCreator(list)
  return currentUserId === creatorUser?.userId
}

export const pendingForCurrentUser = (list: List, email: string): boolean => {
  if (!list.listUsers) return false
  return list.listUsers?.some((listUser: ListUser) => listUser.email === email)
}

export const listIsShared = (list: List): boolean => {
  if (!list.listUsers) return false
  return list.listUsers?.some((listUser: ListUser) => !listUser.creator)
}

export const listUsersCount = (list: List): number => list.listUsers?.length - 1
