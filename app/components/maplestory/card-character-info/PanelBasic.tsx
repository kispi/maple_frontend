import { CharacterInfo } from '~/store/maple'
import helpers from '~/helpers'

export const PanelBasic = ({
  character,    
}: {
  character: CharacterInfo,
}) => {
  return <div className="flex-row align-center g-16">
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
        <span>{character.basic.character_class}</span> | <span>{character.basic.character_level} <small>({character.basic.character_exp_rate}%)</small></span>
      </div>
      <div className="badges">
        <span className="badge-fill bg-danger c-white">{helpers.$t('DOJANG')} {character.dojang.dojang_best_floor}층</span>
        <span className="badge-fill bg-danger c-white">{helpers.$t('UNION')} {character.union.union_level}</span>
        <span className="badge-fill bg-danger c-white">{helpers.$t('ARTIFACT')} {character.union.union_artifact_level}</span>
      </div>
    </div>
  </div>
}