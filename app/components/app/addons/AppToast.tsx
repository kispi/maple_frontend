import { useEffect, useState } from 'react'
import helpers from '~/helpers'
import useAppStore, { Toast } from '~/store/app'

const AppToast = ({ toast }: { toast: Toast }) => {
  const [show, setShow] = useState(false)

  const appStore = useAppStore()

  const removeToast = (duration: number) => {
    // 사라지는 애니메이션을 500ms 보여주고 토스트 삭제
    setTimeout(() => {
      setShow(false)

      setTimeout(() => {
        appStore.removeToast(toast)
      }, 200)
    }, duration)
  }

  useEffect(() => {
    setShow(true)
    if (toast.duration === -1) return

    removeToast(toast.duration)
  }, [])

  return <div className={`app-toast ${toast.type} ${show ? 'show' : ''}`}>
    <div
      className="html"
      dangerouslySetInnerHTML={{ __html: helpers.$t(toast.html) }}
    />
    <div
      className="button-close"
      onClick={() => removeToast(0)}>
      <i className="far fa-times"/>
    </div>
  </div>
}

export default AppToast