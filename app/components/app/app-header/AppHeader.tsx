import { useNavigate } from '@remix-run/react'
import useAppStore from '~/store/app'
import helpers from '~/helpers'
import './app-header.scss'

const AppHeader = () => {
  const { settings, setSettings } = useAppStore()

  const navigate = useNavigate()

  const countryByLocale = { kr: 'kr', en: 'us', '': '' }

  return <header className="app-header">
    <div className="layout-centered">
      <a
        href="/"
        className="f-20 f-600 f-poppins"
        onClick={e => {
          e.preventDefault()
          navigate('/')
        }}>
        EVERY<span className="c-danger">M</span>APLE
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