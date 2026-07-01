import errors from './errors.json'
import translations from './translations.json'

const result = {} as Record<string, Record<string, string>>
const list = [
  errors,
  translations,
]
list.forEach(json => Object.keys(json).forEach(key => result[key] = (json as Record<string, any>)[key]))

export default result