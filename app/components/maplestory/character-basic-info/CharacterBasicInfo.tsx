import { CharacterInfo } from '~/types'
import { PanelBasic } from './PanelBasic'
import './character-basic-info.scss'

const CharacterBasicInfo = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  return <div className="character-basic-info card">
    <PanelBasic character={character} />
  </div>
}

export default CharacterBasicInfo