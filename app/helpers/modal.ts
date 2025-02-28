import { Modal } from '~/types'
import useAppStore from '~/store/app'

const initModal = ({
  options,
  component,
}: {
  options: object,
  // @ts-expect-error 모달 컴포넌트에서 어떤 옵션을 넘겨줄지 사전에 다 명시하는 것은 불가능함.
  component: (...args) => React.ReactNode,
}) => new Promise(resolve => {
  const appStore = useAppStore.getState()
  appStore.addModal({ options, component, resolve } as Modal)
})

const modal = {
  open: initModal,
  center: (dom: HTMLElement | null) => {
    setTimeout(() => {
      if (!dom) return

      const rect = dom.getBoundingClientRect()
      dom.style.top = `calc(50% - ${rect.height / 2}px)`
      dom.style.left = `calc(50% - ${rect.width / 2}px)`
    })
  },
}

export default modal