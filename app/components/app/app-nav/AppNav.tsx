import { useRouter } from '~/hooks'
import useAppStore from '~/store/app'
import helpers from '~/helpers'
import './app-nav.scss'
import { useLocation } from '@remix-run/react'

export const navItems = [{
  name: 'ABOUT',
  href: '/posts/about-coinsect-blog',
}]

const AppNav = () => {
  const { isMobile, setSettings } = useAppStore()

  const { pathname } = useLocation()

  const { push } = useRouter()

  return <>
    <nav
      className="app-nav">
      <div className="profile">{helpers.$t('SHORT_ABOUT')}</div>
      <div className="pages">
        {navItems.map((item, index) => <a
          draggable={false}
          href={item.href}
          onClick={e => {
            e.preventDefault()
            if (item.href) push(item.href)
            if (isMobile) setSettings({ showNav: false })
          }}
          key={index}
          className={`nav-item cursor-pointer ${pathname === item.href ? 'selected' : ''}`}>
          <i className="fal fa-link c-gs-88 m-r-8"/>{helpers.$t(item.name)}
        </a>)}
      </div>
    </nav>
    <div className="app-nav-overlay" onClick={() => setSettings({ showNav: false })}/>
  </>
}

export default AppNav