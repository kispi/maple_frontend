import { CharacterInfo } from '~/types'
import PanelAbility from '../panel-ability/PanelAbility'

export const CharacterStat = ({ character }: { character: CharacterInfo }) => {
  return <div className="character-stat">
    <PanelAbility character={character} />
  </div>
}

export default CharacterStat