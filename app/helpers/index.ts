import { translate } from './translate'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import dom from './dom'
import image from './image'
import localStorage from './local-storage'
import logic from './logic'
import modal from './modal'
import seo from './seo'
import template from './template'
import toast from './toast'
import tooltip from './tooltip'
import util from './util'

dayjs.extend(utc)

const helpers = {
  dayjs,
  dom,
  image,
  localStorage,
  logic,
  modal,
  seo,
  template,
  toast,
  tooltip,
  util,
  asPercent: (value: number, toFixed: number = 3) => (Math.round(value * 100 * Math.pow(10, toFixed)) / Math.pow(10, toFixed)),
  randomString: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  $t: translate,
  withCdn: (key: string) => `${import.meta.env.VITE_CDN}/${key}`,
  /**
   * str: HTML or Markdown 형태의 입력 문자열에서 이미지 URL들을 추출합니다.
   */
  getImagesFromString: (str: string) => {
    // Regular expressions for finding images in HTML and Markdown
    const htmlImgRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/gi
    const markdownImgRegex = /!\[[^\]]*\]\(([^)]+(?:png|jpeg|jpg|webp))\)/gi
    const urlImgRegex = /(https?:\/\/[^\s]+(?:png|jpeg|jpg|webp))/gi
  
    const matches = []
    let match
  
    // Find all HTML <img> tags
    while ((match = htmlImgRegex.exec(str)) !== null) {
      matches.push(match[1])
    }
  
    // Find all Markdown image syntaxes
    while ((match = markdownImgRegex.exec(str)) !== null) {
      matches.push(match[1])
    }
  
    // Find all direct image URLs
    while ((match = urlImgRegex.exec(str)) !== null) {
      matches.push(match[0])
    }
  
    return matches
  },
  sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  onClickHTMLContent: (e: React.MouseEvent) => {
    e.preventDefault()
    const link = (e.target as HTMLImageElement).src || (e.target as HTMLAnchorElement).href
    if (link) window.open(link, '_blank', 'noreferrer')
  },
  flagEmoji: (countryCode: string) => {
    if (!countryCode) return

    const codePoints = countryCode.toUpperCase().split('').map(char =>  127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  },
}

export default helpers