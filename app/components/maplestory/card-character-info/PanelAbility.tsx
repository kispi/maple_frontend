import { AbilityInfo, CharacterAbility } from '~/types/ability'
import { CharacterInfo } from '~/store/maple'
import { useEffect, useMemo, useState } from 'react'
import helpers from '~/helpers'

const CAbility = ({ abilityInfos }: { abilityInfos: AbilityInfo[] }) => {
  return <div className="c-ability">
    {abilityInfos.map((ability, idx) => <div
      key={idx}
      className={`ability-row bg-${helpers.logic.gradeClass([ability.ability_grade])}`}>
      {ability.ability_value}
    </div>)}
  </div>
}

export const PanelAbility = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  const characterAbility = character.ability
  const [presetNo, setPresetNo] = useState(characterAbility.preset_no)

  const abilityInfo = useMemo(() => {
    return ((characterAbility[`ability_preset_${presetNo}` as keyof CharacterAbility]) as { ability_info: AbilityInfo[] }).ability_info
  }, [characterAbility, presetNo])

  useEffect(() => {
    setPresetNo(characterAbility.preset_no)
  }, [characterAbility.preset_no])

  return <div className="panel-ability default-font-family">
    <CAbility abilityInfos={abilityInfo} />
    <div className="preset-selector">
      <div
        onClick={() => setPresetNo(1)}
        className={`no ${presetNo === 1 ? 'selected' : ''}`}>
        1
      </div>
      <div
        onClick={() => setPresetNo(2)}
        className={`no ${presetNo === 2 ? 'selected' : ''}`}>
        2
      </div>
      <div
        onClick={() => setPresetNo(3)}
        className={`no ${presetNo === 3 ? 'selected' : ''}`}>
        3
      </div>
    </div>
  </div>
}