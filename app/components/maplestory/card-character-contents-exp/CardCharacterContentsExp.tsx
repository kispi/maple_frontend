import { useState } from 'react'
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

  return <div className="card-character-contents-exp flex g-16 card">
    <div className="daily-contents contents-section">
      <div className="contents">
        <h3
          className="foldable"
          onClick={() => setFolded({ ...folded, daily: !folded.daily })}>
          <span>{helpers.translate('DAILY_CONTENTS')}</span>
          <i className={`fa fa-chevron-${folded.daily ? 'down' : 'up'}`} onClick={() => setFolded({ ...folded, daily: !folded.daily })} />
        </h3>
        {!folded.daily && <div className="flex g-16 m-t-8">
          {[
            dailyContents.dailyQuestsExp.arcaneRiver({ lev: character.basic.character_level, rewardLev: 0 }),
            dailyContents.dailyQuestsExp.tenebris({ lev: character.basic.character_level, rewardLev: 0 }),
            dailyContents.dailyQuestsExp.grandis({ lev: character.basic.character_level, rewardLev: 0 }),
          ].filter(o => o.length > 0).map((o, i) => {
            return <div className="content" key={i}>
              <div className="content-body">
                {o.map(o => (
                  <div
                    key={o.key}
                    className="content-row">
                    <div className="key">
                      <img src={`images/${o.img}`} alt={o.key} />
                      {helpers.translate(o.key)}</div>
                    <div className="value">{o.$$expPercent}%</div>
                  </div>
                ))}
              </div>
            </div>
          })}
        </div>}
      </div>
    </div>
    {weeklyContents.extremeMonsterPark({ lev: character.basic.character_level, rewardLev: 0 }) > 0 &&
    <div className="weekly-contents contents-section">
      <div className="contents">
        <h3
          className="foldable"
          onClick={() => setFolded({ ...folded, weekly: !folded.weekly })}>
          <span>{helpers.translate('WEEKLY_CONTENTS')}</span>
          <i className={`fa fa-chevron-${folded.weekly ? 'down' : 'up'}`} onClick={() => setFolded({ ...folded, weekly: !folded.weekly })} />
        </h3>
        {!folded.weekly && <div className="flex g-16 m-t-8">
          {!folded.weekly && <div className="content">
            <div className="content-body">
              <div className="content-row">
                <div className="key">
                  <img src="images/bigfoot.png" alt="bigfoot" />
                  <span>{helpers.translate('EXTREME_MONSTER_PARK')}</span>
                </div>
                <div className="value">
                  {weeklyContents.extremeMonsterPark({ lev: character.basic.character_level, rewardLev: 0 })}%
                </div>
              </div>
            </div>
          </div>}
        </div>}
      </div>
    </div>}
  </div>
}