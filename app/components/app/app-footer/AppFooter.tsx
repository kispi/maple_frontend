import helpers from '~/helpers'
import './app-footer.scss'

const AppFooter = ({ className }: { className?: string }) => {
  return <div className={`app-footer ${className || ''}`}>
    <div className="layout-centered">
      <div className="bottom">
        <div className="flex-fill" dangerouslySetInnerHTML={{ __html: helpers.$t('SHORT_ABOUT')}} />
        <div className="flex-shrink text-right">
          <em>Since 2025</em>
        </div>
      </div>
    </div>
  </div>
}

export default AppFooter