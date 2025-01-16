export const lazyLoadedScriptUrls = {} as Record<string, boolean>

type ScriptAttributes = {
  key: string
  value: string
}

// DOM을 직접 건드리는 함수들을 이쪽으로 분리
const dom = {
  scroll: (top: number) => {
    if (import.meta.env.SSR) return

    const el = document.documentElement
    if (el) el.scroll({
      top,
      behavior: 'smooth',
    })
  },
  scrollToTop: () => {
    document.documentElement.scrollTop = 0
  },
  // HTMLElement.scrollIntoView보다 이 메소드를 쓰는 것을 추천 (offset을 더해줄 수 있음)
  scrollIntoView: (target: HTMLElement, offset = 0) => {
    dom.scroll(target.offsetTop - 60 - offset) // 60은 var(--app-header-height)
  },
  isElementInViewport: (el: HTMLElement, percentVisible = 100) => {
    if (!el || !el.getBoundingClientRect) return

    const rect = el.getBoundingClientRect()
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight)

    return !(
      Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-(rect.height / 1)) * 100)) < percentVisible ||
      Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible
    )
  },
  loadScript: ({ url, attributes }: { url: string, attributes?: Array<ScriptAttributes> }) => new Promise(resolve => {
    if (lazyLoadedScriptUrls[url]) return resolve(null)

    const scriptTag = document.createElement('script')
    if (attributes) attributes.forEach(attr => scriptTag.setAttribute(attr.key, attr.value))
    scriptTag.src = url
    scriptTag.async = true
    scriptTag.defer = true
    scriptTag.onload = resolve
    document.head.appendChild(scriptTag)
    lazyLoadedScriptUrls[url] = true
  }),
  loadLink: ({ url, attributes }: { url: string, attributes?: Array<ScriptAttributes> }) => new Promise(resolve => {
    if (lazyLoadedScriptUrls[url]) return resolve(null)

    const linkTag = document.createElement('link')
    if (attributes) attributes.forEach(attr => linkTag.setAttribute(attr.key, attr.value))
    linkTag.href = url
    linkTag.onload = resolve
    document.head.appendChild(linkTag)
    lazyLoadedScriptUrls[url] = true
  }),
  copyToClipboard: (link: string) => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return Promise.reject('Clipboard API is not supported in this browser.')
    }

    return navigator.clipboard.writeText(link)
  },
}

export default dom