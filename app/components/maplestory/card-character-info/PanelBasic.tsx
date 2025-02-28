import { CharacterInfo } from '~/types'
import ExpBar from './ExpBar'
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
  if (character.union.union_level) base.push({ key: 'UNION', value: `Lv. ${character.union.union_level.toLocaleString()}` })
  if (character.union.union_artifact_level) base.push({ key: 'ARTIFACT', value: `Lv. ${character.union.union_artifact_level.toLocaleString()}` })
  if (character.ranking?.overall) rankings.push({ key: 'RANKING_OVERALL', value: `${character.ranking.overall.ranking.toLocaleString()}위 (${character.ranking.overall_world.ranking.toLocaleString()}위)` })
  if (character.ranking?.class) rankings.push({ key: 'RANKING_CLASS', value: `${character.ranking.class.ranking.toLocaleString()}위 (${character.ranking.class_world.ranking.toLocaleString()}위)` })
  if (character.ranking?.union) rankings.push({ key: 'RANKING_UNION', value: `${character.ranking.union.ranking.toLocaleString()}위 (${character.ranking.union_world.ranking.toLocaleString()}위)` })
  
  return <div className="basic-details">
    <div>
      {base.map((pair, index) => <div key={index} className="flex-row align-center g-8">
        <div className="key">{helpers.$t(pair.key)}</div>
        <div className="value">{pair.value}</div>
      </div>)}
    </div>
    <div>
      {rankings.map((pair, index) => <div key={index} className="flex-row align-center g-8">
        <div className="key">{helpers.$t(pair.key)}</div>
        <div className="value">{pair.value}</div>
      </div>)}
    </div>
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
    <ExpBar character={character} />
    <div className="flex-row align-center g-8">
      <div className="image-container">
        <img
          src={character.basic.character_image}
          alt={character.basic.character_name}
        />
      </div>
      <BasicDetails character={character} />
    </div>
  </div>
}