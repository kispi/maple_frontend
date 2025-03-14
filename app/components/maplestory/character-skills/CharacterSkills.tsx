import { CharacterInfo } from '~/types'
import PanelHexaSkills from './panel-hexa-skills/PanelHexaSkills'

export const CharacterSkills = ({ character }: { character: CharacterInfo }) => {
  return <div className="character-skills">
    <PanelHexaSkills character={character} />
  </div>
}

export default CharacterSkills