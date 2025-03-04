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

  const refInput = useRef<HTMLInputElement>(null)

  const name = searchParams.get('name')

  const getCharacterInfo = useCallback(async (name: string) => {
    if (refInput.current) refInput.current.blur()

    try {
      await loadCharacter(name)
      setCharacterName(name)
    } catch (e) {
      const error = e as DefaultError
      helpers.toast.error(error.data.code === '0001' ? error.data.message : helpers.$t('ERROR_FAILED'))
    }
  }, [loadCharacter, refInput])

  useEffect(() => {
    if (name) getCharacterInfo(name)
    else setSelectedCharacter()

    if (refInput.current) refInput.current.focus()
  }, [name, getCharacterInfo, setSelectedCharacter])

  return <div className="search-character input-wrapper">
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
}

export default SearchCharacter