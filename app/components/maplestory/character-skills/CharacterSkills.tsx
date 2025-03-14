import { CharacterSkill, TypeSkill } from '~/types/skill'
import { CharacterInfo } from '~/types'
import { useMemo, useRef } from 'react'
import helpers from '~/helpers'
import './character-skills.scss'

const keywordsToFilter = ['새벽']

const onMouseEnter = (skill: TypeSkill, showAbove: HTMLDivElement) => {
  helpers.tooltip.show({
    id: 'tooltip-skill',
    showAbove: showAbove,
    text: `${skill.skill_name}\n\n${skill.skill_description}`,
  })
}

const onMouseLeave = () => {
  helpers.tooltip.hide('tooltip-skill')
}

export const IconSkill = ({
  skill,
  className,
}: {
  skill: TypeSkill,
  className?: string,
}) => {
  const refIcon = useRef<HTMLDivElement | null>(null)

  return <div
    ref={refIcon}
    onMouseEnter={() => onMouseEnter(skill, refIcon.current as HTMLDivElement)}
    onMouseLeave={() => onMouseLeave()}
    className={`icon-skill ${className || ''}`}>
    <img src={skill.skill_icon} alt={skill.skill_name} className="skill-img" />
    <div className="skill-level">{skill.skill_level}</div>
  </div>
}

export const CharacterSkills = ({ character }: { character: CharacterInfo }) => {
  const eventSkill = useMemo(() => {
    return (character.skills || [])
      .find(skill => skill.character_skill_grade === '0')?.character_skill
      .find(skill => skill.skill_name.includes('문어'))
  }, [character.skills])

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

  return <div className="character-skills">
    {eventSkill && <div className="skills-group">
      <IconSkill skill={eventSkill} />
    </div>}
    {hexaSkills && <div className="skills-group">
      {hexaSkills.character_skill.map((skill, idx) => <IconSkill key={idx} skill={skill} />)}
    </div>}
  </div>
}

export default CharacterSkills