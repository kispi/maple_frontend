import { CharacterInfo, DefaultError } from '~/types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { $http } from '~/modules/axios'
import { CardCharacterInfo } from '~/components/maplestory/card-character-info/CardCharacterInfo'
import { CardCharacterItemEquipment } from '~/components/maplestory/card-character-item-equipment/CardCharacterItemEquipment'
import { CardCharacterContentsExp } from '~/components/maplestory/card-character-contents-exp/CardCharacterContentsExp'
import helpers from '~/helpers'
import useMapleStore from '~/store/maple'
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

const isValidNickname = (nickname: string): boolean => {
  if (!(nickname || '').trim()) return false

  if (nickname.includes(' ')) return false

  const byteLength = [...(nickname || '').trim()].reduce((acc, char) => {
    return acc + (char.charCodeAt(0) > 127 ? 2 : 1);
  }, 0)

  return byteLength >= 4 && byteLength <= 12
}

const Index = () => {
  const [characterName, setCharacterName] = useState('')

  const { characters, loadCharacter } = useMapleStore()

  const [searchParams, setSearchParams] = useSearchParams()

  const name = searchParams.get('name') || ''

  const { preparedCharacter } = useLoaderData<typeof loader>()

  useAppStore() // 이걸 써줘야 로케일 바꿀 때 실시간으로 반영되네

  const refInput = useRef<HTMLInputElement>(null)

  const selectedCharacter = useMemo(() => {
    return characters[characterName] || preparedCharacter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preparedCharacter, characters])

  const getCharacterInfo = async (name: string) => {
    if (!isValidNickname(name)) {
      helpers.toast.error(helpers.$t('ERROR_INVALID_NICKNAME'))
      return
    }

    try {
      await loadCharacter(name)
    } catch (e) {
      helpers.toast.error((e as DefaultError).data.message)
    }
  }

  useEffect(() => {
    if (name) {
      setCharacterName(name) // 검색창에도 반영
      getCharacterInfo(name) // 캐릭터 정보 다시 불러오기
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  return (
    <div className="view-main">
      <div className="input-wrapper">
        <i
          onClick={() => setSearchParams({ name: characterName })}
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
            if (e.key === 'Enter') setSearchParams({ name: characterName })
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