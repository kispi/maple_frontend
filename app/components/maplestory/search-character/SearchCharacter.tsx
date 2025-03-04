import { DefaultError } from '~/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from '@remix-run/react'
import helpers from '~/helpers'
import useMapleStore from '~/store/maple'
import './search-character.scss'

const SearchCharacter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [characterName, setCharacterName] = useState('')

  const { loadCharacter, setSelectedCharacter } = useMapleStore()

  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const refInput = useRef<HTMLInputElement>(null)

  const name = searchParams.get('name')

  const getCharacterInfo = useCallback(async (name: string) => {
    try {
      await loadCharacter(name)
      setSearchParams({ name })
    } catch (e) {
      const error = e as DefaultError
      helpers.toast.error(error.data.code === '0001' ? error.data.message : helpers.$t('ERROR_FAILED'))
    }
  }, [loadCharacter, setSearchParams])

  useEffect(() => {
    if (name && isInitialLoad) getCharacterInfo(name)
    if (!name) setSelectedCharacter()

    if (refInput.current) refInput.current.focus()

    setIsInitialLoad(false)
  }, [name, isInitialLoad, getCharacterInfo, setSelectedCharacter])

  return <div className="search-character input-wrapper">
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
}

export default SearchCharacter