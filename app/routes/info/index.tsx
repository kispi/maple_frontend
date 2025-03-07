import { CardCharacterInfo } from '~/components/maplestory/card-character-info/CardCharacterInfo'
import { CardCharacterItemEquipment } from '~/components/maplestory/card-character-item-equipment/CardCharacterItemEquipment'
import { CardCharacterContentsExp } from '~/components/maplestory/card-character-contents-exp/CardCharacterContentsExp'
import { CharacterInfo } from '~/types'
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react'
import { MetaFunction } from '@remix-run/node'
import { useEffect, useMemo } from 'react'
import { $http } from '~/modules/axios'
import useAppStore from '~/store/app'
import useMapleStore from '~/store/maple'
import helpers from '~/helpers'
import PanelAbility from '~/components/maplestory/panel-ability/PanelAbility'
import PanelHexaSkills from '~/components/maplestory/panel-hexa-skills/PanelHexaSkills'
import SearchCharacter from '~/components/maplestory/search-character/SearchCharacter'
import StoredCharacters from '~/components/maplestory/stored-characters/StoredCharacters'

export const shouldRevalidate = () => false

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)

  if (!helpers.seo.isDirectAccess(request) && helpers.seo.isBot(request)) return { preparedCharacter: null }

  const name = url.searchParams.get('name')
  if (!name) return { preparedCharacter: null }

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

  let title = `${c.basic.character_name}`
  if (!c.basic.character_guild_name) title += ` (${c.basic.world_name})`
  else title += ` (${c.basic.world_name}@${c.basic.character_guild_name})`
  title += ' - 에브리메이플'

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

  // SearchCharacter에서 따로 $http 요청하지 말고, url이 바뀌면 loader가 자동 호출되는 것을 이용해서 그냥 그 데이터를 쓰는 형태로 바꿔야 할 듯
  return (
    <div className={`view-info flex g-${isMobile ? 16 : 24}`}>
      <SearchCharacter />
      <StoredCharacters selectedCharacter={currentCharacter} className="fixed" />
      {currentCharacter && <div className="flex g-24">
        <CardCharacterInfo character={currentCharacter} />
        <CardCharacterContentsExp character={currentCharacter} />

        {/* 리액트는 v-if 같은거 없냐... */}
        {(currentCharacter.ability.ability_info.length > 0 || currentCharacter.skills.find(skill => skill.character_skill_grade === '6')) &&
          <div className={`card ${isMobile ? 'flex' : 'flex-row align-center'} g-24`}>
            <PanelAbility character={currentCharacter} className="flex-fill" />
            <PanelHexaSkills character={currentCharacter} className="flex-fill" />
          </div>
        }
        <div className="section-bottom">
          <CardCharacterItemEquipment character={currentCharacter} />
        </div>
      </div>}
    </div>
  )
}

export default Index