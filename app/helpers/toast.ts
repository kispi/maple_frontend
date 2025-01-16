import { DefaultError } from '~/modules/axios'
import useAppStore, { Toast, ToastType } from '~/store/app'

const showToast = ({
  html,
  duration = 3000,
  type = 'success',
}: {
  html: string,
  duration?: number,
  type?: ToastType,
}) => {
  const appStore = useAppStore.getState()
  appStore.addToast({ html, duration, type } as Toast)
}

const toast = {
  success: (html: string, duration?: number) => showToast({ html, duration, type: 'success' }),
  warning: (html: string, duration?: number) => showToast({ html, duration, type: 'warning' }),
  error: (error: string | DefaultError, duration?: number) => {
    if (typeof error === 'string') showToast({ html: error, duration, type: 'error' })
    else if (((error || {}).data || {}).message) showToast({ html: error.data.message, duration, type: 'error' })
  },
  custom: ({
    html,
    duration,
    type,
  }: {
    html: string,
    duration?: number,
    type: ToastType,
  }) => showToast({ html, duration, type }),
}

export default toast