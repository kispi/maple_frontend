import { useCallback, useEffect } from 'react'
import AppLoading from './AppLoading'
import AppModal from './AppModal'
import AppToast from './AppToast'
import AppTooltip from './AppTooltip'
import useAppStore from '~/store/app'
import loadVendors from '~/lazy-loads'
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
  useAppStore.getState().removeAllTooltips()
}

const onResize = () => {
  setIsMobile()
  useAppStore.getState().removeAllTooltips()
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
  const { modals, toasts, tooltips, setSettings } = useAppStore()

  const loadSettings = useCallback(() => {
    const storedSettings = helpers.localStorage.getMeta('settings') || {}
    if (!storedSettings.nickname) storedSettings.nickname = `방문자_${helpers.randomString().substring(0, 6)}`
    setSettings(storedSettings)
  }, [setSettings])

  useEffect(() => {
    setIsMobile()
    loadSettings()
    loadVendors()
    useAppStore.getState().loadConfig()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { capture: true })
  
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [loadSettings])

  return <div className="app-addons">
    {Object.keys(toasts).length > 0 && <div className="app-toasts">
      {Object.keys(toasts).map((key, idx) => <AppToast toast={toasts[key]} key={idx}/>)}
    </div>}
    {Object.keys(modals).map((key, idx) => <AppModal modal={modals[key]} key={idx}/>)}
    {Object.keys(tooltips).map((key, idx) => <AppTooltip tooltip={tooltips[key]} key={idx}/>)}
    <AppLoading />
    <GoToTop/>
  </div>
}

export default AppAddons