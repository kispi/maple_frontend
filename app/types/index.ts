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
  ranking: {
    overall: { ranking: number }
    overall_world: { ranking: number }
    class: { ranking: number }
    class_world: { ranking: number }
    union: { ranking: number }
    union_world: { ranking: number }
  }
  setEffect: CharacterSetEffect
  skills: CharacterSkill[]
  stat: CharacterStat
  symbolEquipment: CharacterSymbolEquipment
  union: Union
  unionRaider: UnionRaider
}

export type SimpleCharacter = {
  class: string,
  level: number,
  name: string,
  img: string,
  world: string,
  guild: string,
  expRate: string,
  lastUpdated: string,
}

export type Modal = {
  id: string
  options: object
  // @ts-expect-error 모달 컴포넌트에서 어떤 옵션을 넘겨줄지 사전에 다 명시하는 것은 불가능함.
  component: (...args) => React.ReactNode
  resolve: (e?: Event) => void
}

export type ToastType = 'success' | 'warning' | 'error'

export type Toast = {
  id: string
  html: string
  show: boolean
  duration: number
  type: ToastType
}

export type Tooltip = {
  id: string
  text: string
  showAbove: HTMLElement
  below?: boolean
  useCloser?: boolean
  width?: number
}