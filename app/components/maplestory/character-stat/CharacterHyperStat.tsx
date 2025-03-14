import { useMemo, useState } from 'react'
import { CharacterInfo } from '~/types'

const CharacterHyperStat = ({
  character,
}: {
  character: CharacterInfo
}) => {
  const [presetNo, setPresetNo] = useState<string>(character.hyperStat.use_preset_no)

  const hyperStat = useMemo(() => {
    if (presetNo === '1') return character.hyperStat.hyper_stat_preset_1
    if (presetNo === '2') return character.hyperStat.hyper_stat_preset_2
    if (presetNo === '3') return character.hyperStat.hyper_stat_preset_3
    return []
  }, [presetNo, character.hyperStat])

  return <div className="character-hyper-stat card">
    {hyperStat.map(stat => {
      return <div key={stat.stat_type} className="attr">
        <div className="key">{stat.stat_type}</div>
        <div className="value">Lv.{stat.stat_level}</div>
      </div>
    })}
    <div className="preset-selector">
      <div
        onClick={() => setPresetNo('1')}
        className={`no ${presetNo === '1' ? 'selected' : ''}`}>
        1
      </div>
      <div
        onClick={() => setPresetNo('2')}
        className={`no ${presetNo === '2' ? 'selected' : ''}`}>
        2
      </div>
      <div
        onClick={() => setPresetNo('3')}
        className={`no ${presetNo === '3' ? 'selected' : ''}`}>
        3
      </div>
    </div>
  </div>
}

export default CharacterHyperStat