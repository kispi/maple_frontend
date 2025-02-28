import { CharacterInfo } from '~/types'
import { useMemo, useState } from 'react'
import { useLoaderData } from '@remix-run/react'
import { $http } from '~/modules/axios'
import { CardCharacterInfo } from '~/components/maplestory/card-character-info/CardCharacterInfo'
import { CardCharacterItemEquipment } from '~/components/maplestory/card-character-item-equipment/CardCharacterItemEquipment'
import { CardCharacterContentsExp } from '~/components/maplestory/card-character-contents-exp/CardCharacterContentsExp'
import useMapleStore from '~/store/maple'
import useAppStore from '~/store/app'
import PanelAbility from '~/components/maplestory/panel-ability/PanelAbility'
import PanelHexaSkills from '~/components/maplestory/panel-hexa-skills/PanelHexaSkills'
import SearchCharacter from '~/components/common/search-character/SearchCharacter'

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const name = url.searchParams.get('name')
  if (!name) return { characters: {} }

  try {
    const data = await $http.get('maple/info', { params: { character_name: name }}) as CharacterInfo
    const preparedCharacter = data
    return { preparedCharacter }
  } catch (e) {
    return { preparedCharacter: null }
  }
}

export const shouldRevalidate = () => false

const Index = () => {
  const [characterName, setCharacterName] = useState('')

  const { characters } = useMapleStore()

  const { preparedCharacter } = useLoaderData<typeof loader>()

  const { isMobile } = useAppStore()

  const selectedCharacter = useMemo(() => {
    return characters[characterName] || preparedCharacter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preparedCharacter, characters])

  // SearchCharacter에서 따로 $http 요청하지 말고, url이 바뀌면 loader가 자동 호출되는 것을 이용해서 그냥 그 데이터를 쓰는 형태로 바꿔야 할 듯
  return (
    <div className="view-main">
      <SearchCharacter
        characterName={characterName}
        setCharacterName={setCharacterName}
      />
      {selectedCharacter && <div className="flex g-24 m-t-16">
        <CardCharacterInfo character={selectedCharacter} />
        <CardCharacterContentsExp character={selectedCharacter} />

        {/* 리액트는 v-if 같은거 없냐... */}
        {(selectedCharacter.ability.ability_info.length > 0 || selectedCharacter.skills.find(skill => skill.character_skill_grade === '6')) &&
          <div className={`card ${isMobile ? 'flex' : 'flex-row'} g-24`}>
            <PanelAbility character={selectedCharacter} className="flex-fill" />
            <PanelHexaSkills character={selectedCharacter} className="flex-fill" />
          </div>
        }
        <div className="section-bottom">
          <CardCharacterItemEquipment character={selectedCharacter} />
        </div>
      </div>}
    </div>
  )
}

export default Index