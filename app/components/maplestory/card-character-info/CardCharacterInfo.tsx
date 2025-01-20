import { CharacterBasic } from '~/types/basic'
import { CharacterDojang } from '~/types/dojang'
import { Union } from '~/types/union'
import helpers from '~/helpers'
import './card-character-info.scss'

export const CardCharacterInfo = ({
  characterBasic,
  characterDojang,
  characterUnion,
}: {
  characterBasic: CharacterBasic,
  characterDojang: CharacterDojang,
  characterUnion: Union,
}) => {
  return <div className="card-character-basic card">
    <div className="f-12">
      {helpers.$t('INFO_DATE')}: {characterBasic.date ? helpers.dayjs(characterBasic.date).format('YYYY-MM-DD') : helpers.$t('REALTIME')}
    </div>
    <div className="flex-row align-center g-16">
      <div className="image-container">
        <img
          src={characterBasic.character_image}
          alt={characterBasic.character_name}
        />
      </div>
      <div className="basic-info">
        <div className="badges">
          <span className="f-16 f-700">{characterBasic.character_name}</span>
          <span className="badge-bordered">{characterBasic.world_name}{characterBasic.character_guild_name && `@${characterBasic.character_guild_name}`}</span>
        </div>
        <div>
          <span>{characterBasic.character_class}</span> | <span>{characterBasic.character_level} <small>({characterBasic.character_exp_rate}%)</small></span>
        </div>
        <div className="badges">
          <span className="badge-fill bg-danger c-white">{helpers.$t('DOJANG')} {characterDojang.dojang_best_floor}층</span>
          <span className="badge-fill bg-danger c-white">{helpers.$t('UNION')} {characterUnion.union_level}</span>
          <span className="badge-fill bg-danger c-white">{helpers.$t('ARTIFACT')} {characterUnion.union_artifact_level}</span>
        </div>
      </div>
    </div>
  </div>
}