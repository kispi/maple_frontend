import { useMemo } from 'react'
import { CharacterInfo } from '~/types'
import { CharacterSkill } from '~/types/skill'
import './panel-hexa-skills.scss'

const keywordsToFilter = ['새벽', '스탯']

const PanelHexaSkills = ({
  character,
  className,
}: {
  character: CharacterInfo,
  className?: string,
}) => {
  const hexaSkills = useMemo(() => {
    const filtered = (character.skills || []).find(skill => skill.character_skill_grade === '6')
    if (!filtered) return null

    filtered.character_skill = filtered.character_skill.filter(skill =>
      keywordsToFilter.every(keyword => !skill.skill_name.includes(keyword))
    )

    return filtered
  }, [character.skills]) as CharacterSkill

  return hexaSkills && <div className={`panel-hexa-skills ${className || ''}`}>
    {hexaSkills.character_skill.map((skill, idx) => <div key={idx} className="hexa-skill">
      <img className="hexa-skill-icon" src={skill.skill_icon} alt={skill.skill_name} />
      <div className="hexa-skill-level">{skill.skill_level}</div>
    </div>)}
  </div>
}

export default PanelHexaSkills