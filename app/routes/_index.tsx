import { CardCharacterInfo } from '~/components/maplestory/card-character-info/CardCharacterInfo'
import { CardCharacterItemEquipment } from '~/components/maplestory/card-character-item-equipment/CardCharacterItemEquipment'
import { CardCharacterContentsExp } from '~/components/maplestory/card-character-contents-exp/CardCharacterContentsExp'
import useMapleStore from '~/store/maple'
import useAppStore from '~/store/app'
import PanelAbility from '~/components/maplestory/panel-ability/PanelAbility'
import PanelHexaSkills from '~/components/maplestory/panel-hexa-skills/PanelHexaSkills'
import SearchCharacter from '~/components/maplestory/search-character/SearchCharacter'
import StoredCharacters from '~/components/maplestory/stored-characters/StoredCharacters'

export const shouldRevalidate = () => false

const Index = () => {
  const { selectedCharacter } = useMapleStore()

  const { isMobile } = useAppStore()

  // SearchCharacter에서 따로 $http 요청하지 말고, url이 바뀌면 loader가 자동 호출되는 것을 이용해서 그냥 그 데이터를 쓰는 형태로 바꿔야 할 듯
  return (
    <div className="view-main flex g-24">
      <SearchCharacter />
      <StoredCharacters selectedCharacter={selectedCharacter} />
      {selectedCharacter && <div className="flex g-24">
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