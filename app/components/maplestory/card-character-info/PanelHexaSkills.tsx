import { CharacterInfo } from '~/store/maple'
import { useMemo } from 'react'
import { CharacterSkill } from '~/types/skill'

const keywordsToFilter = ['새벽', '스탯']

export const PanelHexaSkills = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  const hexaSkills = useMemo(() => {
    const filtered = (character.skills || []).find(skill => skill.character_skill_grade === '6')
    if (!filtered) return null

    filtered.character_skill = filtered.character_skill.filter(skill =>
      keywordsToFilter.every(keyword => !skill.skill_name.includes(keyword))
    )

    return filtered
  }, [character.skills]) as CharacterSkill

  return hexaSkills && <div className="panel-hexa-skills">
    {hexaSkills.character_skill.map((skill, idx) => <div key={idx} className="hexa-skill">
      <img className="hexa-skill-icon" src={skill.skill_icon} alt={skill.skill_name} />
      <div className="hexa-skill-level">{skill.skill_level}</div>
    </div>)}
  </div>
}