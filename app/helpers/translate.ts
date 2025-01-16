import useAppStore  from '~/store/app'
import json from '~/assets/translations'

export const translate = (key?: string) => {
  const settings = useAppStore.getState().settings
  const upper = (key || '').toUpperCase()
  const locale = settings.locale || 'kr'
  return (json[upper] || {})[locale] || key || ''
}

export const useTranslate = (key?: string) => {
  const settings = useAppStore(state => state.settings)
  const upper = (key || '').toUpperCase()
  const locale = settings.locale || 'kr'
  return (json[upper] || {})[locale] || key || ''
}