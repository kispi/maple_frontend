import dayjs from 'dayjs'

const template = {
  prettyTime: (timestamp: string, simple?: boolean) => {
    if (simple) {
      const isToday = dayjs(timestamp).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
      return dayjs(timestamp).format(isToday ? 'HH:mm' : 'YYYY-MM-DD')
    }

    return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
  },
}

export default template