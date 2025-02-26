import { CharacterAbility } from './ability'
import { CharacterAndroidEquipment } from './android-equipment'
import { CharacterBasic } from './basic'
import { CharacterBeautyEquipment } from './beauty-equipment'
import { CharacterCashItemEquipment } from './cash-item-equipment'
import { CharacterDojang } from './dojang'
import { CharacterHexaMatrix, CharacterHexaMatrixStat } from './hexa-stat'
import { CharacterHyperStat } from './hyper-stat'
import { CharacterItemEquipment } from './item-equipment'
import { CharacterPetEquipment } from './pet-equipment'
import { CharacterPopularity } from './popularity'
import { CharacterPropensity } from './propensity'
import { CharacterSetEffect } from './set-effect'
import { CharacterSkill } from './skill'
import { CharacterStat } from './stat'
import { CharacterSymbolEquipment } from './symbol-equipment'
import { Union, UnionRaider } from './union'

export type DefaultError = {
  code: string
  data: {
    message: string
  }
}

export type CharacterInfo = {
  ability: CharacterAbility
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
  skills: CharacterSkill[]
  stat: CharacterStat
  symbolEquipment: CharacterSymbolEquipment
  union: Union
  unionRaider: UnionRaider
}