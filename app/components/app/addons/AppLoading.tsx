import { useEffect, useState } from 'react'
import helpers from '~/helpers'
import useAppStore from '~/store/app'

const AppLoading = () => {
  const { loading } = useAppStore()

  const [dots, setDots] = useState('.')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((dots) => {
        if (dots.length >= 3) return '.'
        return dots + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [setDots])

  return loading.global && <div className="global-loading">
    <img src={helpers.withCdn('images/bigfoot.png')} alt="로딩 중"/>
    <div className="text-loading">
      LOADING
      <div>{dots}</div>
    </div>
  </div>
}

export default AppLoading