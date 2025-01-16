const localStorage = {
  removeMeta: (key: string) => {
    if (import.meta.env.SSR) return

    const meta = JSON.parse((window.localStorage.getItem('meta') || '{}'))
    delete meta[key]
    window.localStorage.setItem('meta', JSON.stringify(meta))
  },
  setMeta: (key: string, value: unknown) => {
    if (import.meta.env.SSR) return

    const meta = JSON.parse((window.localStorage.getItem('meta') || '{}'))
    meta[key] = value
    window.localStorage.setItem('meta', JSON.stringify(meta))
  },
  getMeta: (key: string) => {
    if (import.meta.env.SSR) return

    return JSON.parse((window.localStorage.getItem('meta') || '{}'))[key]
  },
}

export default localStorage