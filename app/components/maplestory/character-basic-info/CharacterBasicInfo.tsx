import { CharacterInfo } from '~/types'
import { PanelBasic } from './PanelBasic'
import { useMemo, useRef } from 'react'
import helpers from '~/helpers'
import './character-basic-info.scss'

const IconEventSkill = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  const refIconEventSkill = useRef<HTMLDivElement | null>(null)

  const eventSkill = useMemo(() => {
    return (character.skills || [])
      .find(skill => skill.character_skill_grade === '0')?.character_skill
      .find(skill => skill.skill_name.includes('문어'))
  }, [character.skills])

  const onMouseEnter = (showAbove: HTMLDivElement) => {
    if (!refIconEventSkill.current || !eventSkill) return

    helpers.tooltip.show({
      id: 'tooltip-event-skill',
      text: `${eventSkill.skill_name} - ${eventSkill.skill_effect}`,
      showAbove,
    })
  }

  const onMouseLeave = () => {
    helpers.tooltip.hide('tooltip-event-skill')
  }

  return eventSkill ? <div
    ref={refIconEventSkill}
    onMouseEnter={() => onMouseEnter(refIconEventSkill.current as HTMLDivElement)}
    onMouseLeave={() => onMouseLeave()}
    className="icon-event-skill m-a">
    <img src={eventSkill.skill_icon} alt={eventSkill.skill_name} />
  </div> : null
}

const CharacterBasicInfo = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  return <div className="character-basic-info card">
    <PanelBasic character={character} />
    <IconEventSkill character={character} />
  </div>
}

export default CharacterBasicInfo