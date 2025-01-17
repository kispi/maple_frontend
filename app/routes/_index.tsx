import { useMemo, useState } from 'react'
import { CardCharacterInfo } from '~/components/maplestory/card-character-info/CardCharacterInfo'
import helpers from '~/helpers'
import useMapleStore from '~/store/maple'

const Index = () => {
  const [characterName, setCharacterName] = useState('')

  const { characters, loadCharacter } = useMapleStore()

  const selectedCharacter = useMemo(() => characters[characterName], [characters, characterName])

  const getCharacterInfo = async (characterName: string) => {
    loadCharacter(characterName)
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
      {selectedCharacter && <div>
        <CardCharacterInfo
          characterBasic={selectedCharacter.basic}
          characterDojang={selectedCharacter.dojang}
          characterUnion={selectedCharacter.union}
        />
        <div className="items">아이템 영역</div>
      </div>}
    </div>
  )
}

export default Index