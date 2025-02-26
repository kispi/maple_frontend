import useAppStore  from '~/store/app'
import json from '~/assets/translations'

export const translate = (key?: string) => {
  const settings = useAppStore.getState().settings
  const upper = (key || '').toUpperCase()
  const locale = settings.locale || 'kr'
  return (json[upper] || {})[locale] || key || ''
}