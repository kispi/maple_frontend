import { CharacterInfo } from '~/types'
import { useEffect, useMemo, useState } from 'react'
import { dailyContents, weeklyContents } from '~/assets/constants/exp'
import helpers from '~/helpers'
import BadgeGlass from '~/components/common/badge-glass/BadgeGlass'
import './card-character-contents-exp.scss'

type ExpBoyak = {
  arcaneRiver: number,
  grandis: number,
  monsterPark: number,
}

const ContentRow = ({
  $$key,
  img,
  value,
  boyak,
}: {
  $$key: string,
  img: string,
  value: number,
  boyak?: number,
}) => {
  return <div className="content-row">
    <div className="key">
      <img src={helpers.withCdn(`images/${img}`)} alt={$$key} />
      {helpers.$t($$key)}{['angler_company', 'high_mountain'].includes($$key) && <span>[보상 Lv.2]</span>}
    </div>
    <div className="value">
      {value}%{(boyak && boyak > 0) ? <BadgeGlass className="m-l-8">{`보약 +${boyak}%`}</BadgeGlass> : null}
    </div>
  </div>
}

export const CardCharacterContentsExp = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  const [folded, setFolded] = useState({ daily: false, weekly: false })

  const expBoyak = useMemo(() => {
    const zeroth = ((character.skills.find(o => o.character_skill_grade === '0') || {}).character_skill || []).find(o => o.skill_name === '특제 문어요리')
    if (!zeroth) return

    const expBonus = {
      arcaneRiver: 0,
      grandis: 0,
      monsterPark: 0,
    } as ExpBoyak

    const patterns = [
      { key: 'arcaneRiver', regex: /아케인리버 일일퀘스트 완료 시 획득 경험치 (\d+\.?\d*)%/g },
      { key: 'grandis', regex: /그란디스 일일퀘스트 완료 시 획득 경험치 (\d+\.?\d*)%/g },
      { key: 'monsterPark', regex: /몬스터파크 퇴장 시 획득하는 경험치 (\d+\.?\d*)%/g }
    ]
    
    patterns.forEach(({ key, regex }) => {
      const matches = [...zeroth.skill_effect.matchAll(regex)] // 모든 매칭 값을 배열로 변환
      expBonus[key as keyof typeof expBonus] = matches.reduce((sum, match) => sum + parseFloat(match[1]), 0)
    })

    return expBonus
  }, [character])

  useEffect(() => {
    setFolded({ daily: false, weekly: false })
  }, [character.basic.character_level])

  const playable = useMemo(() => ({
    daily: [
      dailyContents.dailyQuestsExp.arcaneRiver({ lev: character.basic.character_level, additionalPercentage: expBoyak?.arcaneRiver }),
      dailyContents.dailyQuestsExp.tenebris({ lev: character.basic.character_level, additionalPercentage: expBoyak?.arcaneRiver }),
      dailyContents.dailyQuestsExp.grandis({ lev: character.basic.character_level, additionalPercentage: expBoyak?.grandis }),
    ].filter(o => o.length > 0),
    weekly: [
      weeklyContents.extremeMonsterPark({ lev: character.basic.character_level, additionalPercentage: expBoyak?.monsterPark }),
      weeklyContents.vipAfk({ lev: character.basic.character_level }),
      weeklyContents.highMountain({ lev: character.basic.character_level, rewardLev: 2 }),
      weeklyContents.anglerCompany({ lev: character.basic.character_level, rewardLev: 2 }),
    ].filter(o => o.$$expPercent)
  }), [character, expBoyak])

  return <div className="card-character-contents-exp flex g-16 card">
    {playable.daily.length > 0 && <div className="contents">
      <div
        className="foldable"
        onClick={() => setFolded({ ...folded, daily: !folded.daily })}>
        <span className="title">{helpers.$t('DAILY_CONTENTS')}</span>
        <i className={`fa fa-chevron-${folded.daily ? 'down' : 'up'}`} onClick={() => setFolded({ ...folded, daily: !folded.daily })} />
      </div>
      {!folded.daily && <div className="flex g-8 m-t-8">
        {playable.daily.map((o, i) => <div className="content" key={i}>
          <div className="content-body">
            {o.map(o => {
              const boyakKey = () => {
                if (['arcane_river', 'tenebris'].includes(o.region)) return 'arcaneRiver'
                if (o.region === 'grandis') return 'grandis'
              }

              return <ContentRow
                key={o.key}
                $$key={o.key}
                img={o.img}
                value={o.$$expPercent}
                boyak={(expBoyak || {})[boyakKey() as keyof ExpBoyak]}
              />
            })}
          </div>
        </div>
        )}
      </div>}
    </div>}
    {playable.weekly.length > 0 && <div className="contents">
      <div
        className="foldable"
        onClick={() => setFolded({ ...folded, weekly: !folded.weekly })}>
        <span className="title">{helpers.$t('WEEKLY_CONTENTS')}</span>
        <i className={`fa fa-chevron-${folded.weekly ? 'down' : 'up'}`} onClick={() => setFolded({ ...folded, weekly: !folded.weekly })} />
      </div>
      {!folded.weekly && <div className="flex g-8 m-t-8">
        <div className="content">
          <div className="content-body">
            {playable.weekly.map(o =>
              <ContentRow
                key={o.key}
                $$key={o.key}
                img={o.img}
                value={o.$$expPercent}
                boyak={o.key === 'extreme_monster_park' ? expBoyak?.monsterPark : undefined}
              />)}
          </div>
        </div>
      </div>}
    </div>}
  </div>
}