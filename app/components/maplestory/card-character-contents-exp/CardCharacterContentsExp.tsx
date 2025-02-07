import { dailyContents, weeklyContents } from '~/assets/constants/exp'
import { CharacterInfo } from '~/store/maple'
import helpers from '~/helpers'
import './card-character-contents-exp.scss'

export const CardCharacterContentsExp = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  return <div className="card-character-contents-exp flex g-16 card">
    <div className="daily-contents contents-section">
      <h3>{helpers.$t('DAILY_CONTENTS')}</h3>
      <div className="contents">
        <div className="content">
          <h4>{helpers.$t('ARCANE_RIVER')}</h4>
          <div className="content-body">
            {dailyContents.dailyQuestsExp.arcaneRiver({ lev: character.basic.character_level, rewardLev: 0 }).map(o => (
              <div
                key={o.key}
                className="content-row">
                <div className="key">
                  <img src={`images/${o.key}.webp`} alt={o.key} />
                  {helpers.$t(o.key)}</div>
                <div className="value">{o.$$expPercent}%</div>
              </div>
            ))}
          </div>
        </div>
        <div className="content">
          <h4>{helpers.$t('TENEBRIS')}</h4>
          <div className="content-body">
            {dailyContents.dailyQuestsExp.tenebris({ lev: character.basic.character_level, rewardLev: 0 }).map(o => (
              <div
                key={o.key}
                className="content-row">
                <div className="key">
                  <img src={`images/tenebris.png`} alt={o.key} />
                  {helpers.$t(o.key)}
                </div>
                <div className="value">{o.$$expPercent}%</div>
              </div>
            ))}
          </div>
        </div>
        <div className="content">
          <h4>{helpers.$t('GRANDIS')}</h4>
          <div className="content-body">
            {dailyContents.dailyQuestsExp.grandis({ lev: character.basic.character_level, rewardLev: 0 }).map(o => (
              <div
                key={o.key}
                className="content-row">
                <div className="key">
                  <img src={`images/${o.key}.webp`} alt={o.key} />
                  {helpers.$t(o.key)}
                </div>
                <div className="value">{o.$$expPercent}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="weekly-contents contents-section">
      <h3>{helpers.$t('WEEKLY_CONTENTS')}</h3>
      <div className="contents">
        <div className="content">
          <h4>{helpers.$t('EXTREME_MONSTER_PARK')}</h4>
          <div className="content-body">
            <div className="content-row">
              <div className="key">
                <img src="images/bigfoot.png" alt="bigfoot" />
                <span>{helpers.$t('EXTREME_MONSTER_PARK')}</span>
              </div>
              <div className="value">
                {weeklyContents.extremeMonsterPark({ lev: character.basic.character_level, rewardLev: 0 })}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}