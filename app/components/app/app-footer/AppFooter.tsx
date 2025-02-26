import helpers from '~/helpers'
import './app-footer.scss'

const AppFooter = ({ className }: { className?: string }) => {
  return <div className={`app-footer ${className || ''}`}>
    <div className="layout-centered">
      <div className="grid outer">
        <div className="category">
          <div className="category-title">{helpers.$t('CONTACTS')}</div>
          <div className="grid">
            <a href="mailto:coinsect.io@gmail.com"><i className="fa fa-envelope f-20"/>{helpers.$t('EMAIL')}</a>
            <a href="https://t.me/coinsect" target="_blank" rel="noreferrer"><i className="fab fa-telegram c-brand-primary f-20"/>{helpers.$t('TELEGRAM')}</a>
          </div>
        </div>
        <div className="category">
          <div className="category-title">{helpers.$t('ANOTHER_SITES')}</div>
          <div className="grid">
            <a href="https://coinsect.io" target="_blank" rel="noreferrer"><i className="fal fa-link f-12"/>코인충</a>
            <a href="https://btc.coinsect.io" target="_blank" rel="noreferrer"><i className="fal fa-link f-12"/>비트코인 블로그</a>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="flex-fill">{helpers.$t('SHORT_ABOUT')}</div>
        <div className="text-right">
          <em>Since 2025.01</em>
        </div>
      </div>
    </div>
  </div>
}

export default AppFooter