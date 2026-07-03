import { useCallback, useEffect, useRef, useState } from 'react'
import { useMatches, useNavigate, useSearchParams } from '@remix-run/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { $http } from '~/modules/http-client'
import useAppStore from '~/store/app'
import helpers from '~/helpers'
import { CharacterInfo, DefaultError } from '~/types'

export const useSearchCharacter = () => {
  const [searchParams] = useSearchParams()
  const [characterName, setCharacterName] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const navigate = useNavigate()
  const matches = useMatches()
  const ssrMode = useRef(true)
  const refInput = useRef<HTMLInputElement>(null)
  
  const queryName = searchParams.get('name')
  const preparedCharacter = (matches.find(m => m.id === 'routes/info')?.data as { preparedCharacter?: CharacterInfo })?.preparedCharacter
  const queryClient = useQueryClient()

  const getCharacterInfo = useCallback(async (name: string) => {
    if (refInput.current) refInput.current.blur()

    if (!helpers.logic.isValidNickname(name)) {
      helpers.toast.error(helpers.$t('ERROR_INVALID_NICKNAME'))
      throw new Error('Invalid nickname')
    }

    try {
      useAppStore.getState().setLoading('global', true)
      const data = await queryClient.fetchQuery({
        queryKey: ['character', name],
        queryFn: () => $http.get('maple/info', { params: { character_name: name } }) as Promise<CharacterInfo>,
        staleTime: 1000 * 60,
      })
      setCharacterName(name)
      return data
    } finally {
      useAppStore.getState().setLoading('global', false)
    }
  }, [queryClient])

  const onSearch = useCallback(async () => {
    if (isComposing) return

    if (!characterName || characterName === queryName) return

    try {
      await getCharacterInfo(characterName)
      navigate({ pathname: '/info', search: `?name=${characterName}` })
    } catch (e) {
      const error = e as DefaultError
      helpers.toast.error(error.data?.statusCode ? helpers.$t('ERROR_FAILED') : error.data?.message)
    }
  }, [isComposing, characterName, queryName, getCharacterInfo, navigate])

  useEffect(() => {
    // SSR 모드 처리
    if (preparedCharacter?.basic.character_name === queryName && ssrMode.current) {
      ssrMode.current = false
      setCharacterName(queryName || '')
      return
    }

    // 뒤로가기나 쿼리 파라미터 변경 시 처리
    if (queryName && queryName !== characterName) {
      getCharacterInfo(queryName).catch(() => {
        navigate('/', { replace: true })
      })
    } else if (!queryName) {
      setCharacterName('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryName, preparedCharacter, getCharacterInfo, navigate])

  return {
    characterName,
    setCharacterName,
    setIsComposing,
    onSearch,
    refInput,
  }
}

export const useCharacterQuery = (name: string, initialData?: CharacterInfo) => {
  return useQuery({
    queryKey: ['character', name],
    queryFn: () => $http.get('maple/info', { params: { character_name: name } }) as Promise<CharacterInfo>,
    staleTime: 1000 * 60,
    initialData: (initialData && initialData.basic?.character_name === name) ? initialData : undefined,
    enabled: !!name,
  })
}
