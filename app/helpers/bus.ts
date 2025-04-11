type EventHandler = (payload?: any) => unknown

const createBus = () => {
  const events: { [eventName: string]: EventHandler[] } = {}

  const $on = (eventName: string, handler: EventHandler) => {
    if (!events[eventName]) {
      events[eventName] = [] as EventHandler[]
    }
    events[eventName].push(handler)
  }

  const $off = (eventName: string, handler?: EventHandler) => {
    if (!events[eventName]) return

    if (!handler) {
      delete events[eventName]
    } else {
      events[eventName] = events[eventName].filter(h => h !== handler)

      if (events[eventName].length === 0) {
        delete events[eventName]
      }
    }
  }

  const $emit = (eventName: string, payload?: any) => {
    if (!events[eventName]) return

    events[eventName].forEach(handler => handler(payload))
  }

  return { $on, $off, $emit }
}

export default createBus
