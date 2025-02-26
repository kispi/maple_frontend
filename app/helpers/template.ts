import dayjs from 'dayjs'

const template = {
  prettyTime: (timestamp: string, simple?: boolean) => {
    if (simple) {
      const isToday = dayjs(timestamp).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
      return dayjs(timestamp).format(isToday ? 'HH:mm' : 'YYYY-MM-DD')
    }

    return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
  },
  case: {
    pluralize: (str: string) => {
      if (str.endsWith('day')) return `${str}s`
      if (str.endsWith('way')) return `${str}s`
      if (str.endsWith('y')) return `${str.slice(0, -1)}ies`
      if (str.endsWith('s') || str.endsWith('h')) return `${str}es`

      return `${str}s`
    },
    toCapital: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
    toSnake: (str: string, delim?: string) => (str || '').replace(/[A-Z]/g, letter => `${delim || '_'}${letter.toLowerCase()}`),
    toCamel: (str: string) => str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', '')),
  },
}

export default template