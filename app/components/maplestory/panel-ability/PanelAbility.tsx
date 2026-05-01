import { CharacterInfo } from '~/types'
import { AbilityInfo, CharacterAbility } from '~/types/ability'
import { useEffect, useMemo, useState } from 'react'
import { PresetSelector } from '../../common/preset-selector/PresetSelector'
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
    <PresetSelector
      className="m-t-16"
      currentPreset={presetNo}
      onSelect={setPresetNo}
      showLabel={false}
    />
  </div>
}

export default PanelAbility