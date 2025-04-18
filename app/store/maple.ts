import { CharacterInfo } from '~/types'
import { create } from 'zustand'
import { $http } from '~/modules/axios'
import useAppStore from './app'
import helpers from '~/helpers'

const cache = {} as Record<string, any>

export const zustandCacheMaple = () => {
  return {
    set: (key: string, value: any, ttl: number = 1000 * 60) => {
      cache[key] = value
      if (ttl) {
        setTimeout(() => {
          delete cache[key]
        }, ttl)
      }
    },
    get: (key: string) => cache[key],
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

type MapleState = {
  selectedCharacter?: CharacterInfo
  setSelectedCharacter: (character?: CharacterInfo | undefined) => void

  characters: Record<string, CharacterInfo>
  loadCharacter: (characterName: string) => Promise<unknown>
}

const useMapleStore = create<MapleState>((set, get) => ({
  selectedCharacter: undefined,
  setSelectedCharacter: (character?: CharacterInfo | undefined) => {
    set({ selectedCharacter: character })
  },

  characters: {},
  loadCharacter: async (characterName: string) => {
    const { loading, setLoading } = useAppStore.getState()

    if (loading.global) return

    if (!isValidNickname(characterName)) {
      helpers.toast.error(helpers.$t('ERROR_INVALID_NICKNAME'))
      return
    }

    const cachedCharacter = zustandCacheMaple().get(characterName)
    if (cachedCharacter) {
      set({ selectedCharacter: cachedCharacter })
      return cachedCharacter
    }

    try {
      setLoading('global', true)
      const data = await $http.get('maple/info', { params: { character_name: characterName }}) as CharacterInfo
      zustandCacheMaple().set(characterName, data)
      const newCharacters = { ...get().characters, [characterName]: data }
      set({ characters: newCharacters, selectedCharacter: data })
      return data
    } catch (e) {
      return Promise.reject(e)
    } finally {
      setLoading('global', false)
    }
  },
}))

export default useMapleStore