import { CharacterInfo } from '~/types'
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react'
import { MetaFunction } from '@remix-run/node'
import { useEffect, useMemo } from 'react'
import { $http } from '~/modules/axios'
import useMapleStore, { zustandCacheMaple } from '~/store/maple'
import useAppStore from '~/store/app'
import helpers from '~/helpers'
import CharacterBasicInfo from '~/components/maplestory/character-basic-info/CharacterBasicInfo'
import SearchCharacter from '~/components/maplestory/search-character/SearchCharacter'
import StoredCharacters from '~/components/maplestory/stored-characters/StoredCharacters'
import SubPages from './SubPages'

const createMetaTitle = (c: CharacterInfo) => {
  if (!c) return '에브리메이플'

  let title = `${c.basic.character_name}`
  if (c.basic.character_level && c.basic.character_exp_rate) title += ` (${c.basic.character_level}, ${c.basic.character_exp_rate}%)`

  if (!c.basic.character_guild_name) title += ` (${c.basic.world_name})`
  else title += ` (${c.basic.world_name}@${c.basic.character_guild_name})`
  title += ' - 에브리메이플'

  return title
}

export const shouldRevalidate = () => false

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)

  if (!helpers.seo.isDirectAccess(request) && !helpers.seo.isBot(request)) return { preparedCharacter: null }

  const name = url.searchParams.get('name')
  if (!name) return { preparedCharacter: null }

  const preparedCharacter = zustandCacheMaple().get(name)
  if (preparedCharacter) return { preparedCharacter }

  try {
    const data = await $http.get('maple/info', { params: { character_name: name }}) as CharacterInfo
    const preparedCharacter = data
    return { preparedCharacter }
  } catch (e) {
    return { preparedCharacter: null }
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const c = data?.preparedCharacter
  if (!c) return []

  const title = createMetaTitle(c)
  const desc = `Lv.${c.basic.character_level} ${c.basic.character_class}`

  return [
    { title },
    { property: 'og:title', content: title },
    { name: 'description', content: desc },
    { property: 'og:description', content: desc },
    { property: 'og:image', content: c.basic.character_image },
  ]
}

const Index = () => {
  const { isMobile } = useAppStore()

  const [searchParams] = useSearchParams()

  const { selectedCharacter } = useMapleStore()

  const { preparedCharacter } = useLoaderData<{ preparedCharacter: CharacterInfo | undefined }>()

  const navigate = useNavigate()

  const currentCharacter = useMemo<CharacterInfo | undefined>(() => {
    return selectedCharacter || preparedCharacter
  }, [selectedCharacter, preparedCharacter])

  useEffect(() => {
    if (!searchParams.get('name')) {
      helpers.toast.error('잘못된 접근입니다.')
      navigate('/', { replace: true })
    }
  }, [])

  useEffect(() => {
    if (!currentCharacter) return

    document.title = createMetaTitle(currentCharacter)
  }, [currentCharacter])

  // SearchCharacter에서 따로 $http 요청하지 말고, url이 바뀌면 loader가 자동 호출되는 것을 이용해서 그냥 그 데이터를 쓰는 형태로 바꿔야 할 듯
  return (
    <div className={`view-info flex g-${isMobile ? 16 : 24} mobile-negative-margin`}>
      <SearchCharacter />
      <StoredCharacters selectedCharacter={currentCharacter} className="fixed" />
      {currentCharacter && <div className="flex g-24">
        <CharacterBasicInfo character={currentCharacter} />
        <SubPages character={currentCharacter} />
      </div>}
    </div>
  )
}

export default Index