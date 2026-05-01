import { useMemo, useState } from 'react'
import { CharacterInfo } from '~/types'
import { PresetSelector } from '../../common/preset-selector/PresetSelector'

const CharacterHyperStat = ({
  character,
}: {
  character: CharacterInfo
}) => {
  const [presetNo, setPresetNo] = useState<string>(character.hyperStat.use_preset_no)

  const hyperStat = useMemo(() => {
    if (String(presetNo) === '1') return character.hyperStat.hyper_stat_preset_1
    if (String(presetNo) === '2') return character.hyperStat.hyper_stat_preset_2
    if (String(presetNo) === '3') return character.hyperStat.hyper_stat_preset_3
    return []
  }, [presetNo, character.hyperStat])

  return <div className="character-hyper-stat card">
    {hyperStat.map(stat => {
      return <div key={stat.stat_type} className="attr">
        <div className="key">{stat.stat_type}</div>
        <div className="value">Lv.{stat.stat_level}</div>
      </div>
    })}
    <PresetSelector
      currentPreset={presetNo}
      onSelect={setPresetNo}
      showLabel={false}
      className="m-t-16"
    />
  </div>
}

export default CharacterHyperStat