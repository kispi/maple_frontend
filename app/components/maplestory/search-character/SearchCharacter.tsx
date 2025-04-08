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

  const ssrMode = useRef(true)

  const preparedCharacter = (matches.find(m => m.id === 'routes/info')?.data as { preparedCharacter?: CharacterInfo })?.preparedCharacter

  const refInput = useRef<HTMLInputElement>(null)

  const name = searchParams.get('name')

  const getCharacterInfo = useCallback(async (name: string) => {
    if (refInput.current) refInput.current.blur()

    try {
      await loadCharacter(name)
      setCharacterName(name) // 성공 시 입력값 업데이트
    } catch (e) {
      return Promise.reject(e)
    }
  }, [loadCharacter, refInput])

  const onSearch = async () => {
    if (isComposing) return // 컴포지션 중에는 실행 안 함

    if (!characterName || characterName === name) return // 빈 값이거나 동일하면 중단

    try {
      await getCharacterInfo(characterName) // 먼저 fetch 시도
      navigate({ pathname: '/info', search: `?name=${characterName}` }) // 성공 시 라우트 변경
    } catch (e) {
      // 에러 시 라우트 변경 안 함
      const error = e as DefaultError
      helpers.toast.error(error.data.statusCode ? helpers.$t('ERROR_FAILED') : error.data.message)
    }
  }

  useEffect(() => {
    // SSR 모드 처리
    if (preparedCharacter?.basic.character_name === name && ssrMode.current) {
      ssrMode.current = false
      setCharacterName(name || '') // SSR에서 초기값 설정
      return
    }

    // 뒤로가기나 쿼리 파라미터 변경 시 처리
    if (name && name !== characterName) {
      getCharacterInfo(name).catch(() => {
        // 에러 시 초기화
        setSelectedCharacter()
        navigate('/', { replace: true })
      })
    } else if (!name) {
      setSelectedCharacter()
      setCharacterName('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, preparedCharacter, getCharacterInfo, setSelectedCharacter])

  return (
    <div className="search-character input-wrapper">
      <i onClick={onSearch} className="far fa-search cursor-pointer" />
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
      {characterName && (
        <i
          className="far fa-times cursor-pointer"
          onClick={() => {
            setCharacterName('')
            if (refInput.current) refInput.current.focus()
          }}
        />
      )}
    </div>
  )
}

export default SearchCharacter