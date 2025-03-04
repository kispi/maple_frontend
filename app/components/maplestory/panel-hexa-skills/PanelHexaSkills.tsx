import { useMemo, useRef } from 'react'
import { CharacterInfo } from '~/types'
import { CharacterSkill, Skill } from '~/types/skill'
import './panel-hexa-skills.scss'
import helpers from '~/helpers'

const keywordsToFilter = ['새벽']

const onMouseEnter = (skill: Skill, showAbove: HTMLDivElement) => {
  helpers.tooltip.show({
    id: 'tooltip-hexa-skill',
    showAbove: showAbove,
    text: `${skill.skill_name}: ${skill.skill_description}`,
  })
}

const onMouseLeave = () => {
  helpers.tooltip.hide('tooltip-hexa-skill')
}

const PanelHexaSkills = ({
  character,
  className,
}: {
  character: CharacterInfo,
  className?: string,
}) => {
  const refs = useRef<HTMLDivElement[]>([])

  const hexaSkills = useMemo(() => {
    const filtered = (character.skills || []).find(skill => skill.character_skill_grade === '6')
    if (!filtered) return null

    // 새벽과 황혼은 맨 뒤로
    filtered.character_skill = filtered.character_skill.filter(skill =>
      keywordsToFilter.every(keyword => !skill.skill_name.includes(keyword))
    ).sort(a => {
      if (a.skill_name.includes('솔 야누스')) return 1
      if (a.skill_name.includes('스탯')) return 2
      return -1
    })

    return filtered
  }, [character.skills]) as CharacterSkill

  return hexaSkills && <div className={`panel-hexa-skills ${className || ''}`}>
    {hexaSkills.character_skill.map((skill, idx) => <div
      ref={el => refs.current[idx] = el as HTMLDivElement}
      onMouseEnter={() => onMouseEnter(skill, refs.current[idx])}
      onMouseLeave={() => onMouseLeave()}
      key={idx}
      className="hexa-skill">
      <img className="hexa-skill-icon" src={skill.skill_icon} alt={skill.skill_name} />
      <div className="hexa-skill-level">{skill.skill_level}</div>
    </div>)}
  </div>
}

export default PanelHexaSkills