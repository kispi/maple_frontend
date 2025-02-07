import { create } from 'zustand'
import { $http } from '~/modules/axios'
import { CharacterAndroidEquipment } from '~/types/android-equipment'
import { CharacterBasic } from '~/types/basic'
import { CharacterBeautyEquipment } from '~/types/beauty-equipment'
import { CharacterCashItemEquipment } from '~/types/cash-item-equipment'
import { CharacterDojang } from '~/types/dojang'
import { CharacterHexaMatrix, CharacterHexaMatrixStat } from '~/types/hexa-stat'
import { CharacterHyperStat } from '~/types/hyper-stat'
import { CharacterItemEquipment } from '~/types/item-equipment'
import { CharacterPetEquipment } from '~/types/pet-equipment'
import { CharacterPopularity } from '~/types/popularity'
import { CharacterPropensity } from '~/types/propensity'
import { CharacterSetEffect } from '~/types/set-effect'
import { CharacterStat } from '~/types/stat'
import { CharacterSymbolEquipment } from '~/types/symbol-equipment'
import { Union, UnionRaider } from '~/types/union'

export type CharacterInfo = {
  androidEquipment: CharacterAndroidEquipment
  basic: CharacterBasic
  beautyEquipment: CharacterBeautyEquipment
  cashItemEquipment: CharacterCashItemEquipment
  dojang: CharacterDojang
  hexaMatrix: CharacterHexaMatrix
  hexaMatrixStat: CharacterHexaMatrixStat
  hyperStat: CharacterHyperStat
  itemEquipment: CharacterItemEquipment
  petEquipment: CharacterPetEquipment
  popularity: CharacterPopularity
  propensity: CharacterPropensity
  setEffect: CharacterSetEffect
  stat: CharacterStat
  symbolEquipment: CharacterSymbolEquipment
  union: Union
  unionRaider: UnionRaider
}

type MapleState = {
  currentCharacter?: CharacterInfo
  characters: Record<string, CharacterInfo>
  loadCharacter: (characterName: string) => Promise<unknown>
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
}))

export default useMapleStore