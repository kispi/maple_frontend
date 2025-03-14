import { CharacterInfo } from '~/types'
import PanelAbility from '../panel-ability/PanelAbility'
import './character-stat.scss'

const statKeyGroups = [
  [{ key: 'STR' }, { key: 'DEX' }, { key: 'INT' }, { key: 'LUK' }],
  [{ key: 'HP' }, { key: 'MP' }],
  [
    { key: '최대 스탯공격력' },
    { key: '최종 데미지', suffix: '%' },
    { key: '방어율 무시', suffix: '%' },
    { key: '공격력' },
    { key: '마력' },
    { key: '재사용 대기시간 감소' },
    { key: '재사용 대기시간 미적용', suffix: '%' },
    { key: '상태이상 추가 데미지', suffix: '%' },
  ],
  [
    { key: '데미지', suffix: '%' },
    { key: '보스 몬스터 데미지', suffix: '%' },
    { key: '일반 몬스터 데미지', suffix: '%' },
    { key: '크리티컬 확률', suffix: '%' },
    { key: '크리티컬 데미지', suffix: '%' },
    { key: '버프 지속시간', suffix: '%' },
    { key: '속성 내성 무시', suffix: '%' },
    { key: '소환수 지속시간 증가', suffix: '%' },
  ],
  [
    { key: '메소 획득량', suffix: '%' },
    { key: '아이템 드롭률', suffix: '%' },
    { key: '추가 경험치 획득', suffix: '%' },
    { key: '방어력' },
    { key: '이동속도', suffix: '%' },
    { key: '스탠스', suffix: '%' },
  ],
  [
    { key: '스타포스' },
    { key: '아케인포스' },
    { key: '어센틱포스' },
    { key: '상태이상 내성', suffix: '%' },
    { key: '점프력', suffix: '%' },
    { key: '공격 속도', suffix: '단계' },
  ],
]

const displayStatValue = (
  statKey: { key: string, suffix?: string },
  stats: { stat_name: string, stat_value: string }[],
) => {
  if (statKey.key === '재사용 대기시간 감소') {
    const sec = stats.find(stat => stat.stat_name === '재사용 대기시간 감소 (초)')
    const percent = stats.find(stat => stat.stat_name === '재사용 대기시간 감소 (%)')
    return `${sec?.stat_value}초 / ${percent?.stat_value}%`
  }

  const target = stats.find(stat => stat.stat_name === statKey.key)
  if (!target) return '-'

  const val = parseFloat(target.stat_value) > 100 ? parseFloat(target.stat_value).toLocaleString() : target.stat_value

  return statKey.suffix ? `${val}${statKey.suffix}` : val
}

const SubPanel = ({
  keyGroup,
  stats,
}: {
  keyGroup: { key: string, suffix?: string }[],
  stats: { stat_name: string, stat_value: string }[],
}) => {
  return <div className="sub-panel">
    {keyGroup.map(item => {
      return <div key={item.key} className="attr">
        <div className="key">{item.key}</div>
        <div className="value">{displayStatValue(item, stats)}</div>
      </div>
    })}
  </div>
}

export const CharacterStat = ({ character }: { character: CharacterInfo }) => {
  return <div className="character-stat">
    <div className="basic-stats">
      <div className="grid">
        <SubPanel keyGroup={statKeyGroups[0]} stats={character.stat.final_stat} />
        <SubPanel keyGroup={statKeyGroups[1]} stats={character.stat.final_stat} />
      </div>
    </div>
    <div className="additional-stats">
      <div className="grid">
        <SubPanel keyGroup={statKeyGroups[2]} stats={character.stat.final_stat} />
        <SubPanel keyGroup={statKeyGroups[3]} stats={character.stat.final_stat} />
        <SubPanel keyGroup={statKeyGroups[4]} stats={character.stat.final_stat} />
        <SubPanel keyGroup={statKeyGroups[5]} stats={character.stat.final_stat} />
      </div>
    </div>
    <PanelAbility character={character} />
  </div>
}

export default CharacterStat