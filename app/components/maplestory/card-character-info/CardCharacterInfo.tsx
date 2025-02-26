import { CharacterInfo } from '~/types'
import { PanelAbility } from './PanelAbility'
import { PanelBasic } from './PanelBasic'
import { PanelHexaSkills } from './PanelHexaSkills'
import helpers from '~/helpers'
import './card-character-info.scss'

export const CardCharacterInfo = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  return <div className="card-character-info card">
    <div className="f-12">
      {helpers.$t('INFO_DATE')}: {character.basic.date ? helpers.dayjs(character.basic.date).format('YYYY-MM-DD') : helpers.$t('REALTIME')}
    </div>
    <PanelBasic character={character} />
    <PanelAbility character={character} />
    <PanelHexaSkills character={character} />
  </div>
}