import { create } from 'zustand'
import { $http } from '~/modules/axios'
import { Modal, Toast, Tooltip } from '~/types'
import helpers from '../helpers'

const supportedLocales = ['kr', 'en']

type AppState = {
  modals: { [key: string]: Modal }
  addModal: (modal: Modal) => void
  removeModal: (modal: Modal) => void
  removeAllModals: () => void

  toasts: { [key: string]: Toast }
  addToast: (toast: Toast) => void
  removeToast: (toast: Toast) => void

  tooltips: { [key: string]: Tooltip }
  addTooltip: (tooltip: Tooltip) => void
  removeTooltip: (tooltipId: string) => void
  removeAllTooltips: () => void

  loading: { [key: string]: boolean }
  setLoading: (key: string, value: boolean) => void

  windowInnerWidth: number
  isMobile: boolean
  setIsMobile: (isMobile: boolean) => void

  scrollTop: number
  setScrollTop: (scrollTop: number) => void

  settings: {
    theme?: 'light' | 'dark'
    locale?: 'kr' | 'en'
    nickname?: string
    showNav?: boolean
    markdown?: string
  }
  setSettings: (settings: AppState['settings']) => void

  config: {
    emojis: Record<string, { emoji: string }>
    ip: string
    maxlength: { nickname: number, postTitle: number, profileImageUrl: number, replyContent: number }
    version: { frontend?: string, backend?: string }
  }
  loadConfig: () => Promise<object>
}

const useAppStore = create<AppState>((set) => ({
  // Modals
  modals: {},
  addModal: (modal: Modal) => set((state) => {
    modal.id = helpers.util.generateUUIDV4()
    state.modals[modal.id] = modal

    return { modals: state.modals }
  }),
  removeModal: (modal: Modal) => set((state) => {
    delete state.modals[modal.id]
    return { modals: state.modals }
  }),
  removeAllModals: () => set({ modals: {} }),

  // Toasts
  toasts: {},
  addToast: (toast: Toast) => set((state) => {
    toast.id = helpers.util.generateUUIDV4()
    state.toasts[toast.id] = toast
    return { toasts: state.toasts }
  }),
  removeToast: (toast: Toast) => set((state) => {
    delete state.toasts[toast.id]
    return { toasts: state.toasts }
  }),

  // Tooltips
  tooltips: {},
  addTooltip: (tooltip) => set((state) => {
    if (!tooltip.id) {
      console.warn('Tooltip ID is required')
      return { tooltips: state.tooltips }
    }

    state.tooltips[tooltip.id] = tooltip
    return { tooltips: state.tooltips }
  }),
  removeTooltip: (tooltipId) => set((state) => {
    delete state.tooltips[tooltipId]
    return { tooltips: state.tooltips }
  }),
  removeAllTooltips: () => set({ tooltips: {} }),

  // Loading
  loading: {},
  setLoading: (key, value) => set((state) => {
    state.loading[key] = value
    return { loading: state.loading }
  }),

  windowInnerWidth: 0,
  isMobile: false,
  setIsMobile: (isMobile: boolean) => {
    set({ windowInnerWidth: window.innerWidth })
    set({ isMobile })
  },

  scrollTop: 0,
  setScrollTop: (scrollTop) => set({ scrollTop }),

  settings: {
    theme: 'dark',
    locale: 'kr',
    nickname: '',
    showNav: false,
    markdown: '',
  },
  setSettings: (settings) => set((state) => {
    const newSettings = { ...state.settings }
    if (settings.locale && !supportedLocales.includes(settings.locale)) settings.locale = 'kr'

    Object.assign(newSettings, settings)
    helpers.localStorage.setMeta('settings', newSettings)
    return { settings: newSettings }
  }),

  config: {
    emojis: {},
    ip: '',
    maxlength: { nickname: 0, postTitle: 0, profileImageUrl: 0, replyContent: 0 },
    version: { frontend: '', backend: '' },
  },
  loadConfig: async () => {
    try {
      const data = await $http.get('config') as AppState['config']
      set({ config: data })
      return data
    } catch (e) {
      return Promise.reject(e)
    }
  },
}))

export default useAppStore