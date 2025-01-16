import { create } from 'zustand'
import { $http } from '~/modules/axios'
import helpers from '../helpers'

const supportedLocales = ['kr', 'en']

export type Modal = {
  id: string
  options: object
  // @ts-expect-error 모달 컴포넌트에서 어떤 옵션을 넘겨줄지 사전에 다 명시하는 것은 불가능함.
  component: (...args) => React.ReactNode
  resolve: (e?: Event) => void
}

export type ToastType = 'success' | 'warning' | 'error'

export type Toast = {
  id: string
  html: string
  show: boolean
  duration: number
  type: ToastType
}

type AppState = {
  modals: Modal[]
  addModal: (modal: Modal) => void
  removeModal: (modal: Modal) => void
  removeAllModals: () => void

  toasts: Toast[]
  addToast: (toast: Toast) => void
  removeToast: (toast: Toast) => void

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
  modals: [],
  addModal: (modal: Modal) => set((state) => {
    modal.id = helpers.util.generateUUIDV4()

    return {
      modals: [modal, ...state.modals]
    }
  }),
  removeModal: (modal: Modal) => set((state) => {
    const idx = state.modals.findIndex(m => m.id === modal.id)
    if (idx >= 0) state.modals = state.modals.slice(0, idx).concat(state.modals.slice(idx + 1))

    return { modals: state.modals }
  }),
  removeAllModals: () => set({ modals: [] }),

  // Toasts
  toasts: [],
  addToast: (toast: Toast) => set((state) => {
    toast.id = helpers.util.generateUUIDV4()

    return {
      toasts: [toast, ...state.toasts]
    }
  }),
  removeToast: (toast: Toast) => set((state) => {
    const idx = state.toasts.findIndex(t => t.id === toast.id)
    if (idx >= 0) state.toasts = state.toasts.slice(0, idx).concat(state.toasts.slice(idx + 1))

    return { toasts: state.toasts }
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
    theme: 'light',
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