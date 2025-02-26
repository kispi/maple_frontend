import { CharacterInfo } from '~/store/maple'
import helpers from '~/helpers'

const estimatedMinutesToLevelUp = ({
  currentLevel,
  currentExpPercent,
}: {
  currentLevel: number,
  currentExpPercent: number,
}) => {
  // 200 미만은 무시
  let baseCase = null
  
  if (currentLevel < 205) baseCase = { min: 23, max: 30 }
  else if (currentLevel < 210) baseCase = { min: 23, max: 39 }
  else if (currentLevel < 215) baseCase = { min: 23, max: 33 }
  else if (currentLevel < 220) baseCase = { min: 42, max: 63 }
  else if (currentLevel < 225) baseCase = { min: 53, max: 70 }
  else if (currentLevel < 230) baseCase = { min: 1.8 * 60, max: 2.1 * 60 }
  else if (currentLevel < 235) baseCase = { min: 2.1 * 60, max: 2.3 * 60 }
  else if (currentLevel < 240) baseCase = { min: 2.7 * 60, max: 3.1 * 60 }
  else if (currentLevel < 245) baseCase = { min: 3.7 * 60, max: 4.3 * 60 }
  else if (currentLevel < 250) baseCase = { min: 5.4 * 60, max: 6 * 60 }
  else if (currentLevel < 255) baseCase = { min: 8.6 * 60, max: 11.3 * 60 }
  else if (currentLevel < 260) baseCase = { min: 8.6 * 60, max: 9.6 * 60 }
  else if (currentLevel < 265) baseCase = { min: 8.2 * 60, max: 8.2 * 60 }
  else if (currentLevel < 270) baseCase = { min: 9.1 * 60, max: 9.1 * 60 }
  else if (currentLevel < 275) baseCase = { min: 17.8 * 60, max: 17.8 * 60 }
  else if (currentLevel < 280) baseCase = { min: 32 * 60, max: 32 * 60 }
  else if (currentLevel < 285) baseCase = { min: 70 * 60, max: 99 * 60 }
  else if (currentLevel < 290) baseCase = { min: 160 * 60, max: 242 * 60 }
  else if (currentLevel < 295) baseCase = { min: 380 * 60, max: 579 * 60 }
  else if (currentLevel < 300) baseCase = { min: 1441 * 60, max: 3450 * 60 }

  return baseCase ? {
    min: (baseCase.min * (100 - currentExpPercent)) / 100,
    max: (baseCase.max * (100 - currentExpPercent)) / 100,
  } : null
}

const minToHour = (min: number) => {
  const hour = Math.floor(min / 60)
  const remain = min % 60
  return hour + Math.round(remain / 60 * 100) / 100
}

export const HuntGuestimation = ({ character }: { character: CharacterInfo }) => {
  const requiredHuntTimes = estimatedMinutesToLevelUp({
    currentExpPercent: parseFloat(character.basic.character_exp_rate),
    currentLevel: character.basic.character_level,
  })

  if (!requiredHuntTimes) return null

  const a = minToHour(requiredHuntTimes.min)
  const b = minToHour(requiredHuntTimes.max)
  return <span className="hunt-guestimation m-l-8">
    (렙업까지 {a === b ? a : `${a} ~ ${b}`}시간 사냥)
  </span>
}

export const PanelBasic = ({
  character,    
}: {
  character: CharacterInfo,
}) => {
  return <div className="panel-basic flex g-8">
    <div className="flex-row align-center g-16">
      <div className="image-container">
        <img
          src={character.basic.character_image}
          alt={character.basic.character_name}
        />
      </div>
      <div className="basic-info">
        <div className="badges">
          <span className="f-16 f-700">{character.basic.character_name}</span>
          <span className="badge-bordered">{character.basic.world_name}{character.basic.character_guild_name && `@${character.basic.character_guild_name}`}</span>
        </div>
        <div>
          <span>{character.basic.character_class} | {character.basic.character_level}</span>
        </div>
        <div className="badges">
          <span className="badge-fill bg-danger c-white">{helpers.$t('DOJANG')} {character.dojang.dojang_best_floor}층</span>
          <span className="badge-fill bg-danger c-white">{helpers.$t('UNION')} {character.union.union_level}</span>
          <span className="badge-fill bg-danger c-white">{helpers.$t('ARTIFACT')} {character.union.union_artifact_level}</span>
        </div>
      </div>
    </div>
    <a
      href="https://namu.wiki/w/%EB%A9%94%EC%9D%B4%ED%94%8C%EC%8A%A4%ED%86%A0%EB%A6%AC/%EB%A0%88%EB%B2%A8#s-9.1.2"
      target="_blank"
      rel="noreferrer"
      className="exp-bar">
      <div
        className="exp-fill overlay"
        style={{ width: `${character.basic.character_exp_rate}%` }}
      >
      </div>
      <div className="exp-text overlay">
        <b>{character.basic.character_exp_rate}%</b>
        <HuntGuestimation character={character} />
      </div>
    </a>
  </div>
}