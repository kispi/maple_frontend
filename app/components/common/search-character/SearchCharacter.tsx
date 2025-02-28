import { DefaultError } from '~/types'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from '@remix-run/react'
import helpers from '~/helpers'
import useMapleStore from '~/store/maple'
import useAppStore from '~/store/app'
import './search-character.scss'

const isValidNickname = (nickname: string): boolean => {
  if (!(nickname || '').trim()) return false

  if (nickname.includes(' ')) return false

  const byteLength = [...(nickname || '').trim()].reduce((acc, char) => {
    return acc + (char.charCodeAt(0) > 127 ? 2 : 1);
  }, 0)

  return byteLength >= 4 && byteLength <= 12
}

const SearchCharacter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [characterName, setCharacterName] = useState('')

  const { loading, setLoading } = useAppStore()

  const { loadCharacter, resetCharacters } = useMapleStore()

  const refInput = useRef<HTMLInputElement>(null)

  const name = searchParams.get('name') || ''

  const getCharacterInfo = async (name: string) => {
    if (loading.global) return

    if (!isValidNickname(name)) {
      helpers.toast.error(helpers.$t('ERROR_INVALID_NICKNAME'))
      return
    }

    try {
      setLoading('global', true)
      await loadCharacter(name)
    } catch (e) {
      const error = e as DefaultError
      helpers.toast.error(error.code === '0001' ? error.data.message : helpers.$t('ERROR_FAILED'))
    } finally {
      setLoading('global', false)
    }
  }

  useEffect(() => {
    if (name) {
      setCharacterName(name) // 검색창에도 반영
      getCharacterInfo(name) // 캐릭터 정보 다시 불러오기
    } else {
      setCharacterName('')
      resetCharacters()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

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