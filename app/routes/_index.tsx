import { useMemo, useState } from 'react'
import { CardCharacterInfo } from '~/components/maplestory/card-character-info/CardCharacterInfo'
import { CardCharacterItemEquipment } from '~/components/maplestory/card-character-item-equipment/CardCharacterItemEquipment'
import helpers from '~/helpers'
import useMapleStore from '~/store/maple'

const Index = () => {
  const [characterName, setCharacterName] = useState('')

  const { characters, loadCharacter } = useMapleStore()

  const selectedCharacter = useMemo(() => characters[characterName], [characters, characterName])

  const getCharacterInfo = async (characterName: string) => {
    try {
      await loadCharacter(characterName)
    } catch (e) {
      helpers.toast.error(e.data.message)
    }
  }

  return (
    <div className="view-main">
      <div className="input-wrapper">
        <i
          onClick={() => getCharacterInfo(characterName)}
          className="far fa-search cursor-pointer"
        />
        <input
          type="text"
          placeholder={helpers.$t('PLACEHOLDER_SEARCH_CHARACTER')}
          value={characterName}
          maxLength={12}
          onChange={(e) => setCharacterName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') getCharacterInfo(characterName)
          }}
        />
      </div>
      {selectedCharacter && <div className="flex g-24 m-t-16">
        <CardCharacterInfo
          characterBasic={selectedCharacter.basic}
          characterDojang={selectedCharacter.dojang}
          characterUnion={selectedCharacter.union}
        />
        <CardCharacterItemEquipment
          characterItemEquipment={selectedCharacter.itemEquipment}
        />
      </div>}
    </div>
  )
}

export default Index