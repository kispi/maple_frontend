import { useEffect } from 'react'
import loadVendors from '~/lazy-loads'
import AppModal from './AppModal'
import AppToast from './AppToast'
import useAppStore from '~/store/app'
import helpers from '~/helpers'
import './addons.scss'

const setIsMobile = () => {
  useAppStore.getState().setIsMobile(window.innerWidth < 768)
}

const onScroll = () => {
  if (!document.scrollingElement) return

  const scrollTop = document.scrollingElement.scrollTop
  if (!scrollTop) return

  useAppStore.getState().setScrollTop(scrollTop)
}

const GoToTop = () => {
  const { scrollTop } = useAppStore()

  return <div
    onClick={() => {
      if (!document.scrollingElement) return

      document.scrollingElement.scrollTop = 0
      useAppStore.getState().setScrollTop(0)
    }}
    className={`go-to-top ${scrollTop <= 120 ? 'no-show' : ''}`}>
    <i className="fal fa-arrow-up"/>
  </div>
}

const AppAddons = () => {
  const { modals, toasts, setSettings } = useAppStore()

  const loadSettings = () => {
    const storedSettings = helpers.localStorage.getMeta('settings') || {}
    if (!storedSettings.nickname) storedSettings.nickname = `방문자_${helpers.randomString().substring(0, 6)}`
    setSettings(storedSettings)
  }

  useEffect(() => {
    setIsMobile()
    loadSettings()
    loadVendors()
    useAppStore.getState().loadConfig()
    window.addEventListener('resize', setIsMobile)
    window.addEventListener('scroll', onScroll, { capture: true })
  
    return () => {
      window.removeEventListener('resize', setIsMobile)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return <>
    {modals.map((modal, idx) => <AppModal modal={modal} key={idx}/>)}
    {toasts.length > 0 && <div className="app-toasts">
      {toasts.map((toast, idx) => <AppToast toast={toast} key={idx}/>)}
    </div>}
    <GoToTop/>
  </>
}

export default AppAddons