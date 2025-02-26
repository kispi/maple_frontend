import { useMemo, useState } from 'react'
import { dailyContents, weeklyContents } from '~/assets/constants/exp'
import { CharacterInfo } from '~/store/maple'
import helpers from '~/helpers'
import './card-character-contents-exp.scss'

export const CardCharacterContentsExp = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  const [folded, setFolded] = useState({ daily: character.basic.character_level >= 260, weekly: false })

  const playable = useMemo(() => ({
    daily: [
      dailyContents.dailyQuestsExp.arcaneRiver({ lev: character.basic.character_level, rewardLev: 0 }),
      dailyContents.dailyQuestsExp.tenebris({ lev: character.basic.character_level, rewardLev: 0 }),
      dailyContents.dailyQuestsExp.grandis({ lev: character.basic.character_level, rewardLev: 0 }),
    ].filter(o => o.length > 0),
    weekly: [
      weeklyContents.extremeMonsterPark({ lev: character.basic.character_level, rewardLev: 6 }),
      weeklyContents.highMountain({ lev: character.basic.character_level, rewardLev: 2 }),
      weeklyContents.anglerCompany({ lev: character.basic.character_level, rewardLev: 2 }),
    ].filter(o => o.$$expPercent)
  }), [character])

  return <div className="card-character-contents-exp flex g-16 card">
    <div className="daily-contents contents-section">
      <div className="contents">
        <h3
          className="foldable"
          onClick={() => setFolded({ ...folded, daily: !folded.daily })}>
          <span>{helpers.$t('DAILY_CONTENTS')}</span>
          <i className={`fa fa-chevron-${folded.daily ? 'down' : 'up'}`} onClick={() => setFolded({ ...folded, daily: !folded.daily })} />
        </h3>
        {!folded.daily && <div className="flex g-8 m-t-8">
          {playable.daily.map((o, i) => {
            return <div className="content" key={i}>
              <div className="content-body">
                {o.map(o => (
                  <div
                    key={o.key}
                    className="content-row">
                    <div className="key">
                      <img src={`images/${o.img}`} alt={o.key} />
                      {helpers.$t(o.key)}</div>
                    <div className="value">{o.$$expPercent}%</div>
                  </div>
                ))}
              </div>
            </div>
          })}
        </div>}
      </div>
    </div>
    <div className="weekly-contents contents-section">
      <div className="contents">
        <h3
          className="foldable"
          onClick={() => setFolded({ ...folded, weekly: !folded.weekly })}>
          <span>{helpers.$t('WEEKLY_CONTENTS')}</span>
          <i className={`fa fa-chevron-${folded.weekly ? 'down' : 'up'}`} onClick={() => setFolded({ ...folded, weekly: !folded.weekly })} />
        </h3>
        {!folded.weekly && <div className="flex g-8 m-t-8">
          {playable.weekly.map((o, i) => {
            return <div className="content" key={i}>
              <div className="content-body">
                <div className="content-row">
                  <div className="key">
                    <img src={`images/${o.img}`} alt={o.key} />
                    <span>{helpers.$t(o.key)}</span>
                  </div>
                  <div className="value">
                    {o.$$expPercent}%
                  </div>
                </div>
              </div>
            </div>
          })}
        </div>}
      </div>
    </div>
  </div>
}