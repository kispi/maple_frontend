import useAppStore from '~/store/app'

const tooltip = {
  show: ({
    id,
    text,
    showAbove,
    below,
    useCloser,
    width,
    fit,
  }: {
    id: string,
    text: string,
    showAbove: HTMLElement,
    below?: boolean,
    useCloser?: boolean,
    width?: number,
    fit?: boolean
  }) => {
    const appStore = useAppStore.getState()
    return appStore.addTooltip({ id, text, showAbove, below, useCloser, fit, width })
  },
  hide: (id: string) => {
    const appStore = useAppStore.getState()
    appStore.removeTooltip(id)
  },
}

export default tooltip
