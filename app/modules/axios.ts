import axios from 'axios'
import helpers from '~/helpers'

const createHttpClient = () => {
  const httpClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    timeout: 10000,
  })

  httpClient.interceptors.response.use(
    res => res.data,
    err => {
      if (err.code === 'ECONNABORTED') {
        helpers.toast.error('서버로부터의 응답에 너무 오랜 시간이 걸리네요 😢<br>일시적 문제인 것 같으니 다시 시도해주세요!')
        throw { data: {} }
      }

      throw err.response || err
    },
  )

  return httpClient
}

export const $http = createHttpClient()

// 다른 사이트들의 API를 호출할 때 사용할 클라이언트
export const $httpNoAuth = axios.create()