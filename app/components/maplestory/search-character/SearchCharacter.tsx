import { CharacterInfo, DefaultError } from '~/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMatches, useNavigate, useSearchParams } from '@remix-run/react'
import helpers from '~/helpers'
import useMapleStore from '~/store/maple'
import './search-character.scss'

const SearchCharacter = () => {
  const [searchParams] = useSearchParams()

  const [characterName, setCharacterName] = useState('')

  const [isComposing, setIsComposing] = useState(false)

  const { loadCharacter, setSelectedCharacter } = useMapleStore()

  const navigate = useNavigate()

  const matches = useMatches()

  const preparedCharacter = (matches.find(m => m.id === 'routes/info')?.data as { preparedCharacter?: CharacterInfo })?.preparedCharacter

  const refInput = useRef<HTMLInputElement>(null)

  const name = searchParams.get('name')

  const getCharacterInfo = useCallback(async (name: string) => {
    if (refInput.current) refInput.current.blur()

    try {
      await loadCharacter(name)
      setCharacterName(name)
    } catch (e) {
      const error = e as DefaultError
      helpers.toast.error(error.data.code ? error.data.message : helpers.$t('ERROR_FAILED'))
      navigate('/', { replace: true })
    }
  }, [loadCharacter, navigate, refInput])

  const onSearch = () => {
    // 아니 왜 컴포징 중에 navigate를 하면 404가 뜨냐고
    if (isComposing) return

    if (characterName === name) {
      // 브라우저 히스토리 스택에 같은 주소가 쌓이는 것을 방지
      return
    }

    navigate({ pathname: '/info', search: `?name=${characterName}` })
  }

  useEffect(() => {
    if (preparedCharacter?.basic.character_name === name) return

    if (name) getCharacterInfo(name)
    else setSelectedCharacter()
  }, [name, preparedCharacter, getCharacterInfo, setSelectedCharacter])

  return <div className="search-character input-wrapper">
    <i
      onClick={() => onSearch()}
      className="far fa-search cursor-pointer"
    />
    <input
      ref={refInput}
      type="text"
      placeholder={helpers.$t('PLACEHOLDER_SEARCH_CHARACTER')}
      value={characterName}
      maxLength={12}
      onChange={e => setCharacterName(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') onSearch()
      }}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => setIsComposing(false)}
    />
    {characterName && <i
      className="far fa-times cursor-pointer"
      onClick={() => {
        setCharacterName('')
        if (refInput.current) refInput.current.focus()
      }}
    />}
  </div>
}

export default SearchCharacter