import { useMemo, useState } from 'react'
import { CardCharacterInfo } from '~/components/maplestory/card-character-info/CardCharacterInfo'
import { CardCharacterItemEquipment } from '~/components/maplestory/card-character-item-equipment/CardCharacterItemEquipment'
import { ItemEquipmentDetail } from '~/components/maplestory/card-character-item-equipment/ItemEquipmentDetail'
import { ItemEquipment } from '~/types/item-equipment'
import { DefaultError } from '~/modules/axios'
import helpers from '~/helpers'
import useMapleStore from '~/store/maple'
import useAppStore from '~/store/app'

const Index = () => {
  const [characterName, setCharacterName] = useState('')

  const [selectedItemEquipment, setSelectedItemEquipment] = useState<ItemEquipment | null>(null)

  const { characters, loadCharacter } = useMapleStore()

  const { isMobile } = useAppStore()

  const selectedCharacter = useMemo(() => characters[characterName], [characters, characterName])

  const getCharacterInfo = async (characterName: string) => {
    try {
      await loadCharacter(characterName)
    } catch (e) {
      helpers.toast.error((e as DefaultError).data.message)
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
        <div className={`g-24 ${isMobile ? 'flex' : 'flex-row align-start'}`}>
          <CardCharacterItemEquipment
            characterItemEquipment={selectedCharacter.itemEquipment}
            setSelectedItemEquipment={setSelectedItemEquipment}
          />
          {selectedItemEquipment && <ItemEquipmentDetail
            itemEquipment={selectedItemEquipment}
          />}
        </div>
      </div>}
    </div>
  )
}

export default Index