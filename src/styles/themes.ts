import { DefaultTheme } from '@react-navigation/native'
import colors from './colors'

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.RED,
    background: colors.BG_LIGHT,
    card: colors.CARD_LIGHT,
    text: colors.BLACK,
    subtitle: colors.DARK_GREY,
  },
}

export const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.RED,
    background: colors.BG_DARK,
    card: colors.CARD_DARK,
    text: colors.WHITE,
    subtitle: colors.LIGHT_GREY,
  },
}
