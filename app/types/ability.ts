export type AbilityInfo = {
  ability_no: string
  ability_grade: string
  ability_value: string
}

export type CharacterAbility = {
  date: string
  ability_grade: string
  ability_info: AbilityInfo[]
  remain_fame: number
  preset_no: number
  ability_preset_1: {
    ability_preset_grade: string
    ability_info: AbilityInfo[]
  }
  ability_preset_2: {
    ability_preset_grade: string
    ability_info: AbilityInfo[]
  }
  ability_preset_3: {
    ability_preset_grade: string
    ability_info: AbilityInfo[]
  }
}