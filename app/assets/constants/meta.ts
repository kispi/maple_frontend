import helpers from '~/helpers'

export const defaultMeta = {
  title: '에브리메이플',
  description: '메이플스토리 경험치 컨텐츠 (일퀘, 몬파, 익몬, 하이마운틴, 앵글러 컴퍼니, VIP 사우나 등) 효율 / 캐릭터 정보를 확인할 수 있습니다.',
  image: helpers.withCdn('og-images/og-everymaple.png'),
}

type MetaTagArgs = {
  title?: string
  description?: string
  image?: string
}

const cut = (str: string, length: number) => (str || '').length > length ? str.slice(0, length) + '...' : str

export const createMetaTags = (metaTagArgs: MetaTagArgs = {}) => [
  { title: metaTagArgs.title || defaultMeta.title },
  { name: 'description', content: cut(metaTagArgs.description || defaultMeta.description, 160) },
  { property: 'og:title', content: cut(metaTagArgs.title || defaultMeta.title, 40) },
  { property: 'og:description', content: cut(metaTagArgs.description || defaultMeta.description, 160) },
  { property: 'og:image', content: metaTagArgs.image || defaultMeta.image },
]