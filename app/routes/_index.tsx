import { useMemo, useRef, useState } from 'react'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { $http, DefaultError } from '~/modules/axios'
import { CardCharacterInfo } from '~/components/maplestory/card-character-info/CardCharacterInfo'
import { CardCharacterItemEquipment } from '~/components/maplestory/card-character-item-equipment/CardCharacterItemEquipment'
import { CardCharacterContentsExp } from '~/components/maplestory/card-character-contents-exp/CardCharacterContentsExp'
import helpers from '~/helpers'
import useMapleStore, { CharacterInfo } from '~/store/maple'
import useAppStore from '~/store/app'

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

const Index = () => {
  const [characterName, setCharacterName] = useState('')

  const { characters, loadCharacter } = useMapleStore()

  const [, setSearchParams] = useSearchParams()

  const { preparedCharacter } = useLoaderData<typeof loader>()

  const refInput = useRef<HTMLInputElement>(null)

  const selectedCharacter = useMemo(() => {
    return characters[characterName] || preparedCharacter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preparedCharacter, characters])

  const getCharacterInfo = async (name: string) => {
    try {
      await loadCharacter(name)
      setSearchParams({ name })
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
          ref={refInput}
          type="text"
          placeholder={helpers.$t('PLACEHOLDER_SEARCH_CHARACTER')}
          value={characterName}
          maxLength={12}
          onChange={(e) => setCharacterName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') getCharacterInfo(characterName)
          }}
        />
        {characterName && <i
          className="far fa-times cursor-pointer"
          onClick={() => {
            setCharacterName('')
            if (refInput.current) refInput.current.focus()
          }}
        />}
      </div>
      {selectedCharacter && <div className="flex g-24 m-t-16">
        <CardCharacterInfo character={selectedCharacter} />
        <CardCharacterContentsExp character={selectedCharacter} />
        <div className="section-bottom">
          <CardCharacterItemEquipment character={selectedCharacter} />
        </div>
      </div>}
    </div>
  )
}

export default Index