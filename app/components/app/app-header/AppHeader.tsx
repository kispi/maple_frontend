import { useRouter } from '~/hooks'
import useAppStore from '~/store/app'
import helpers from '~/helpers'
import './app-header.scss'

const AppHeader = () => {
  const { settings, setSettings } = useAppStore()

  const { push } = useRouter()

  const toggleShowNav = () => {
    setSettings({ showNav: !settings.showNav })
  }

  const countryByLocale = { kr: 'kr', en: 'us', '': '' }

  return <header className="app-header">
    <div className="layout-centered">
      <i
        className={`far ${settings.showNav ? 'fa-times' : 'fa-bars'} cursor-pointer nav-toggler center`}
        onClick={toggleShowNav}
      />
      <a
        href="/"
        className="f-20 f-600 f-ubuntu"
        onClick={e => {
          e.preventDefault()
          push('/')
        }}>
        maple.coinsect.io
      </a>
      <div className="header-functions">
        <div
          onClick={() => setSettings({ locale: settings.locale === 'kr' ? 'en' : 'kr' })}
          className="header-function m-l-a cursor-pointer">
          {helpers.flagEmoji(countryByLocale[settings.locale || ''])}
        </div>
        <div
          onClick={() => setSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
          className="header-function m-l-a cursor-pointer">
          <i className={`fa ${settings.theme === 'dark' ? 'fa-sun c-bitcoin' : 'fa-moon c-success'}`}/>
        </div>
      </div>
    </div>
  </header>
}

export default AppHeader