import { CharacterInfo } from '~/types'
import { create } from 'zustand'
import { $http } from '~/modules/axios'

type MapleState = {
  currentCharacter?: CharacterInfo
  characters: Record<string, CharacterInfo>
  loadCharacter: (characterName: string) => Promise<unknown>
  resetCharacters: () => void
}

const useMapleStore = create<MapleState>((set, get) => ({
  currentCharacter: undefined,
  characters: {},
  loadCharacter: async (characterName: string) => {
    try {
      const data = await $http.get('maple/info', { params: { character_name: characterName }}) as CharacterInfo
      const newCharacters = { ...get().characters, [characterName]: data }
      set({ characters: newCharacters, currentCharacter: data })
      return data
    } catch (e) {
      return Promise.reject(e)
    }
  },
  resetCharacters: () => set(() => ({ characters: {} })),
}))

export default useMapleStore