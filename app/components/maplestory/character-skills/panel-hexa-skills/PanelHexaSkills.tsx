import { useMemo, useRef } from 'react'
import { CharacterInfo } from '~/types'
import { CharacterSkill, TypeSkill } from '~/types/skill'
import helpers from '~/helpers'
import './panel-hexa-skills.scss'

const keywordsToFilter = ['새벽']

const onMouseEnter = (skill: TypeSkill, showAbove: HTMLDivElement) => {
  helpers.tooltip.show({
    id: 'tooltip-hexa-skill',
    showAbove: showAbove,
    text: `${skill.skill_name}\n\n${skill.skill_description}`,
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
    ).sort((a, b) => {
      if (a.skill_name.includes('솔 야누스')) return 1;
      if (b.skill_name.includes('솔 야누스')) return -1;
      if (a.skill_name.includes('스탯')) return 1;
      if (b.skill_name.includes('스탯')) return -1;
      return 0; // 기본 순서 유지
    })

    return filtered
  }, [character.skills]) as CharacterSkill

  return hexaSkills && <a
    href={`https://maplescouter.com/hexa?name=${character.basic.character_name}`}
    target="_blank"
    rel="noreferrer"
    className={`panel-hexa-skills ${className || ''}`}>
    {hexaSkills.character_skill.map((skill, idx) => <div
      ref={el => refs.current[idx] = el as HTMLDivElement}
      onMouseEnter={() => onMouseEnter(skill, refs.current[idx])}
      onMouseLeave={() => onMouseLeave()}
      key={skill.skill_name}
      className="hexa-skill">
      <img className="hexa-skill-icon" src={skill.skill_icon} alt={skill.skill_name} />
      <div className="hexa-skill-level">{skill.skill_level}</div>
    </div>)}
  </a>
}

export default PanelHexaSkills