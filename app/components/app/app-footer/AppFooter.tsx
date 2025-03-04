import helpers from '~/helpers'
import './app-footer.scss'

const AppFooter = ({ className }: { className?: string }) => {
  return <div className={`app-footer ${className || ''}`}>
    <div className="layout-centered">
      <div dangerouslySetInnerHTML={{ __html: helpers.$t('SHORT_ABOUT')}} />
      <div className="contacts">
        <a href="mailto:admin@everymaple.com">
          이메일
        </a>
        <a
          href="https://open.kakao.com/o/gMaGYujh"
          target="_blank"
          rel="noreferrer"
        >
          오픈채팅
        </a>
      </div>
      <div className="flex-shrink text-right f-12">
        © 2025 EVERYMAPLE, All rights reserved.
      </div>
    </div>
  </div>
}

export default AppFooter