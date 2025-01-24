import { translate, useTranslate } from './translate'
import dayjs from 'dayjs'
import dom from './dom'
import image from './image'
import localStorage from './local-storage'
import logic from './logic'
import modal from './modal'
import template from './template'
import toast from './toast'
import util from './util'

const helpers = {
  dayjs,
  dom,
  image,
  localStorage,
  logic,
  modal,
  template,
  toast,
  util,
  randomString: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  /**
   * i18n: Hook. This will be used generally, other than helpers.translate.
   */
  $t: useTranslate,
  /**
   * i18n: Pure function. In case you need to use it in a non-React context.
   */
  translate,
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

    const codePoints = countryCode.toUpperCase().split('').map(char =>  127397 + char.charCodeAt())
    return String.fromCodePoint(...codePoints)
  },
}

export default helpers