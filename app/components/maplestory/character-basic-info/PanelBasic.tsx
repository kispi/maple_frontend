import { CharacterInfo } from '~/types'
import { useMemo } from 'react'
import ExpBar from '../exp-bar/ExpBar'
import helpers from '~/helpers'
import BadgeGlass from '~/components/common/badge-glass/BadgeGlass'

const BasicDetails = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  if (!character) return null

  const base = []
  const rankings = []
  if (character.basic.character_guild_name) base.push({ key: 'GUILD', value: character.basic.character_guild_name })
  if (character.popularity) base.push({ key: 'POPULARITY', value: character.popularity.popularity.toLocaleString() })
  if (character.dojang.dojang_best_floor) base.push({ key: 'DOJANG', value: `${character.dojang.dojang_best_floor.toLocaleString()}층` })
  if (character.union.union_level) base.push({ key: 'UNION', value: `Lv. ${character.union.union_level.toLocaleString()}`, link: `https://maplestory.nexon.com/N23Ranking/World/Union?c=${character.basic.character_name}` })
  if (character.union.union_artifact_level) base.push({ key: 'ARTIFACT', value: `Lv. ${character.union.union_artifact_level.toLocaleString()}` })
  if (character.ranking?.overall) rankings.push({ key: 'RANKING_OVERALL', value: `${character.ranking.overall.ranking.toLocaleString()}위 (${character.ranking.overall_world.ranking.toLocaleString()}위)`, link: `https://maplestory.nexon.com/N23Ranking/World/Total?c=${character.basic.character_name}` })
  if (character.ranking?.class) rankings.push({ key: 'RANKING_CLASS', value: `${character.ranking.class.ranking.toLocaleString()}위 (${character.ranking.class_world.ranking.toLocaleString()}위)` })
  if (character.ranking?.union) rankings.push({ key: 'RANKING_UNION', value: `${character.ranking.union.ranking.toLocaleString()}위 (${character.ranking.union_world.ranking.toLocaleString()}위)`, link: `https://maplestory.nexon.com/N23Ranking/World/Union?c=${character.basic.character_name}` })
  
  return <div className="basic-details">
    <div>
      {base.map((pair, index) => <a
        key={index}
        className="flex-row align-center fit-content g-8"
        href={pair.link}
        target="_blank"
        rel="noreferrer">
        <div className="key">{helpers.$t(pair.key)}</div>
        <div className="value">{pair.value}</div>
      </a>)}
    </div>
    <div>
      {rankings.map((pair, index) => <a
        key={index}
        className="flex-row align-center fit-content g-8"
        href={pair.link}
        target="_blank"
        rel="noreferrer">
        <div className="key">{helpers.$t(pair.key)}</div>
        <div className="value">{pair.value}</div>
      </a>)}
    </div>
  </div>
}

const SimpleStats = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  const battlePower = useMemo(() => {
    const o = character.stat.final_stat.find(stat => stat.stat_name === '전투력')
    if (!o) return null

    return parseInt(o.stat_value).toLocaleString()
  }, [character.stat.final_stat])

  return <div className="simple-stats">
    <a
      href={`https://maplescouter.com/result?name=${character.basic.character_name}`}
      target="_blank"
      rel="noreferrer"
      className="flex-row align-center fit-content g-4">
      <div className="key"><i className="fal fa-link f-12 m-r-8" />{helpers.$t('전투력')}</div>
      <div className="value">{battlePower}</div>
    </a>
  </div>
}

export const PanelBasic = ({
  character,    
}: {
  character: CharacterInfo,
}) => {
  return <div className="panel-basic flex g-8">
    <div className="text-nowrap flex-row align-center g-8">
      <div className="f-16 f-700 c-unique">Lv. {character.basic.character_level}</div>
      <div className="f-16 f-700">{character.basic.character_name}</div>
      <BadgeGlass>
        <>
          <img
            src={helpers.withCdn(`images/${helpers.logic.getWorld(character.basic.world_name)?.img}`)}
            alt={character.basic.world_name}
            style={ { width: '16px', height: '16px' } }
          />
          {character.basic.world_name}
        </>
      </BadgeGlass>
      <BadgeGlass>{character.basic.character_class}</BadgeGlass>
    </div>
    <SimpleStats character={character} />
    <ExpBar expRate={character.basic.character_exp_rate} level={character.basic.character_level} />
    <div className="flex-row align-center g-16">
      <div className="image-container">
        <img
          src={character.basic.character_image}
          alt={character.basic.character_name}
        />
        <div className="created-at">{helpers.dayjs(character.basic.character_date_create).format('YYYY-MM-DD')}</div>
      </div>
      <BasicDetails character={character} />
    </div>
  </div>
}