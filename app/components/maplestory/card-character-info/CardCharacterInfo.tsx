import { CharacterInfo } from '~/types'
import { PanelBasic } from './PanelBasic'
import './card-character-info.scss'

export const CardCharacterInfo = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  return <div className="card-character-info card">
    <PanelBasic character={character} />
  </div>
}