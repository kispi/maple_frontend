import useAppStore from '~/store/app'

const tooltip = {
  show: ({
    id,
    text,
    showAbove,
    below,
    useCloser,
    width,
  }: {
    id: string,
    text: string,
    showAbove: HTMLElement,
    below?: boolean,
    useCloser?: boolean,
    width?: number,
  }) => {
    const appStore = useAppStore.getState()
    return appStore.addTooltip({ id, text, showAbove, below, useCloser, width })
  },
  hide: (id: string) => {
    const appStore = useAppStore.getState()
    appStore.removeTooltip(id)
  },
}

export default tooltip
