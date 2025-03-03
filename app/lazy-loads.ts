import helpers from './helpers'

export const loadGA = async () => {
  const h = window.location.host
  if (h.startsWith('localhost') || h.startsWith('127.0.0.1')) return

  await helpers.dom.loadScript({ url: 'https://www.googletagmanager.com/gtag/js?id=G-E93226DE3Y' })
  helpers.dom.loadScript({ url: '/scripts/gtm.js' })
}

const loadVendors = async () => {
  await Promise.all([
    loadGA(),
    // helpers.dom.loadScript({ url: '/scripts/image-resize.min.js' })
  ])
}

export default loadVendors