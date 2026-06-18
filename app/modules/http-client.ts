import helpers from '~/helpers'

type ResolveInterceptor<T> = (value: T) => T | Promise<T>
type RejectInterceptor = (error: any) => any

class InterceptorManager<T> {
  private handlers: Array<{
    fulfilled: ResolveInterceptor<T>
    rejected?: RejectInterceptor
  } | null> = []

  use(fulfilled: ResolveInterceptor<T>, rejected?: RejectInterceptor): number {
    this.handlers.push({ fulfilled, rejected })
    return this.handlers.length - 1
  }

  forEach(fn: (handler: { fulfilled: ResolveInterceptor<T>; rejected?: RejectInterceptor }) => void) {
    this.handlers.forEach((h) => {
      if (h) fn(h)
    })
  }
}

export interface FetchConfig {
  params?: Record<string, string>
  headers?: Record<string, string>
  timeout?: number
}

export interface InternalRequestConfig extends FetchConfig {
  url: string
  method?: string
  body?: any
}

class HttpClient {
  baseURL: string
  timeout: number
  interceptors = {
    request: new InterceptorManager<InternalRequestConfig>(),
    response: new InterceptorManager<any>(),
  }

  constructor(baseURL: string = '', timeout: number = 10000) {
    this.baseURL = baseURL
    this.timeout = timeout
  }

  async get<T = any>(url: string, config?: FetchConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: 'GET' })
  }

  async post<T = any>(url: string, data?: any, config?: FetchConfig): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(config?.headers || {}),
      },
    })
  }

  async put<T = any>(url: string, data?: any, config?: FetchConfig): Promise<T> {
    return this.request<T>({
      ...config,
      url,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(config?.headers || {}),
      },
    })
  }

  async delete<T = any>(url: string, config?: FetchConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: 'DELETE' })
  }

  async request<T = any>(config: InternalRequestConfig): Promise<T> {
    let promise: Promise<any> = Promise.resolve(config)

    const requestHandlers: any[] = []
    this.interceptors.request.forEach((interceptor) => {
      requestHandlers.push(interceptor.fulfilled, interceptor.rejected)
    })

    const responseHandlers: any[] = []
    this.interceptors.response.forEach((interceptor) => {
      responseHandlers.push(interceptor.fulfilled, interceptor.rejected)
    })

    while (requestHandlers.length) {
      const fulfilled = requestHandlers.shift()
      const rejected = requestHandlers.shift()
      promise = promise.then(fulfilled, rejected)
    }

    promise = promise.then(async (cfg: InternalRequestConfig) => {
      const timeoutMs = cfg.timeout ?? this.timeout
      let fullUrl = cfg.url.startsWith('http') ? cfg.url : `${this.baseURL}/${cfg.url.replace(/^\//, '')}`
      
      if (cfg.params) {
        const searchParams = new URLSearchParams()
        for (const [key, value] of Object.entries(cfg.params)) {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value)
          }
        }
        const separator = fullUrl.includes('?') ? '&' : '?'
        fullUrl = `${fullUrl}${separator}${searchParams.toString()}`
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

      try {
        const response = await fetch(fullUrl, {
          method: cfg.method || 'GET',
          headers: cfg.headers,
          body: cfg.body,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        let responseData: any
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json()
        } else {
          responseData = await response.text()
        }

        if (!response.ok) {
          const errResponse = {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
            headers: response.headers,
          }
          throw { response: errResponse }
        }

        return {
          data: responseData,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: cfg,
        }
      } catch (err: any) {
        clearTimeout(timeoutId)

        if (err.name === 'AbortError' || (err instanceof DOMException && err.name === 'AbortError')) {
          const abortError = new Error(`timeout of ${timeoutMs}ms exceeded`);
          (abortError as any).code = 'ECONNABORTED'
          throw abortError
        }

        throw err
      }
    })

    while (responseHandlers.length) {
      const fulfilled = responseHandlers.shift()
      const rejected = responseHandlers.shift()
      promise = promise.then(fulfilled, rejected)
    }

    return promise
  }
}

const createHttpClient = () => {
  const httpClient = new HttpClient(`${import.meta.env.VITE_API_URL}`, 10000)

  httpClient.interceptors.response.use(
    (res) => res.data,
    (err) => {
      if (err.code === 'ECONNABORTED') {
        helpers.toast.error(
          '서버로부터의 응답에 너무 오랜 시간이 걸리네요 😢<br>일시적 문제인 것 같으니 다시 시도해주세요!'
        )
        throw { data: {} }
      }

      throw err.response || err
    }
  )

  return httpClient
}

export const $http = createHttpClient()
export const $httpNoAuth = new HttpClient('', 10000)