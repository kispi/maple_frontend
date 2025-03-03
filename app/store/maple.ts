import { CharacterInfo } from '~/types'
import { create } from 'zustand'
import { $http } from '~/modules/axios'
import useAppStore from './app'
import helpers from '~/helpers'

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
  setSelectedCharacter: (character?: CharacterInfo) => void

  characters: Record<string, CharacterInfo>
  loadCharacter: (characterName: string) => Promise<unknown>
}

const useMapleStore = create<MapleState>((set, get) => ({
  selectedCharacter: undefined,
  setSelectedCharacter: (character?: CharacterInfo) => {
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

    try {
      setLoading('global', true)
      const data = await $http.get('maple/info', { params: { character_name: characterName }}) as CharacterInfo
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