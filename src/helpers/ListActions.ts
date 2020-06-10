import { ActionSheetIOS } from 'react-native'
import { List } from '../types/List'

export const shareActionSheet = (list: List) => {
  const listName = list.name ?? ''
  const shareUrl = `https://groceryti.me/share/${list.id}`
  return ActionSheetIOS.showShareActionSheetWithOptions(
    {
      message: `I'd like to work on my grocery list "${listName}" with you on GroceryTime. Click here to join: ${shareUrl}`,
    },
    (error) => console.log(error),
    (success, method) => console.log(success, method),
  )
}

const deleteListConfirmationActionSheet = (
  list: List,
  deleteList: Function,
) => {
  return ActionSheetIOS.showActionSheetWithOptions(
    {
      message:
        'Are you sure you want to delete this list and its items? If this list is shared, the other members will be notified. You cannot undo this action.',
      options: ['Delete', 'Dismiss'],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 1,
    },
    (buttonIdx) => {
      if (buttonIdx === 0) {
        deleteList({ variables: { listId: list.id } })
      }
    },
  )
}

export const listActionSheet = (
  list: List,
  renameList: Function,
  deleteList: Function,
) => {
  let options = ['Share list...', 'Rename list...', 'Delete list...', 'Dismiss']
  let renameButtonIndex = 1
  let destructiveButtonIndex = 2
  let cancelButtonIndex = 3
  // Limit sharing to up to 5 for now so we can keep tabs on how subscriptions
  // are working server side
  const atShareLimit = list.listUsers && list.listUsers.length >= 5
  if (atShareLimit) {
    options.shift()
    renameButtonIndex = renameButtonIndex - 1
    destructiveButtonIndex = destructiveButtonIndex - 1
    cancelButtonIndex = cancelButtonIndex - 1
  }
  return ActionSheetIOS.showActionSheetWithOptions(
    {
      options,
      destructiveButtonIndex,
      cancelButtonIndex,
    },
    (buttonIdx) => {
      if (!atShareLimit && buttonIdx === 0) {
        shareActionSheet(list)
      }
      if (buttonIdx === renameButtonIndex) {
        renameList()
      }
      if (buttonIdx === destructiveButtonIndex) {
        deleteListConfirmationActionSheet(list, deleteList)
      }
    },
  )
}
