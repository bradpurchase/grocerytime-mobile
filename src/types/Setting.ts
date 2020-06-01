export interface Setting {
  name: string
  key: string
  type: 'switch' | 'screen'
  screen?: string
}
