import { ActionSheetIOS } from 'react-native'
import { List } from '../types/List'

export const shareActionSheet = (list: List) => {
  const shareUrl = `https://groceryti.me/share/${list.id}`
  return ActionSheetIOS.showShareActionSheetWithOptions(
    {
      message: `I'd like to work on my grocery list "${list.name}" with you on GroceryTime. Click here to join: ${shareUrl}`,
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
        'Are you sure you want to delete this list? If this list is shared, the other members will be notified. You cannot undo this action.',
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

export const listActionSheet = (list: List, deleteList: Function) => {
  return ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ['Share with others...', 'Delete list...', 'Dismiss'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2,
    },
    (buttonIdx) => {
      console.log(`Tapped buttonIdx ${buttonIdx}`)
      if (buttonIdx === 0) {
        shareActionSheet(list)
      } else if (buttonIdx === 1) {
        deleteListConfirmationActionSheet(list, deleteList)
      }
    },
  )
}
