import { CharacterInfo } from '~/types'
import { AbilityInfo, CharacterAbility } from '~/types/ability'
import { useEffect, useMemo, useState } from 'react'
import helpers from '~/helpers'
import './panel-ability.scss'

const CAbility = ({ abilityInfos }: { abilityInfos: AbilityInfo[] }) => {
  return <div className="c-ability">
    {abilityInfos.map((ability, idx) => <div
      key={idx}
      className={`ability-row lines-1 bg-${helpers.logic.gradeClass([ability.ability_grade])}`}>
      {ability.ability_value}
    </div>)}
  </div>
}

const PanelAbility = ({
  character,
  className,
}: {
  character: CharacterInfo,
  className?: string,
}) => {
  const characterAbility = character.ability
  const [presetNo, setPresetNo] = useState(characterAbility.preset_no)

  const abilityInfo = useMemo(() => {
    return ((characterAbility[`ability_preset_${presetNo}` as keyof CharacterAbility]) as { ability_info: AbilityInfo[] }).ability_info
  }, [characterAbility, presetNo])

  useEffect(() => {
    setPresetNo(characterAbility.preset_no)
  }, [characterAbility.preset_no])

  return <div className={`panel-ability f-dotum ${className || ''}`}>
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

export default PanelAbility