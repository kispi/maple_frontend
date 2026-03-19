import { CharacterSkill, TypeSkill } from '~/types/skill'
import { CharacterInfo } from '~/types'
import { useMemo, useRef } from 'react'
import helpers from '~/helpers'
import './character-skills.scss'

const keywordsToFilter = ['새벽']

const onMouseEnter = ({
  skill,
  showAbove,
  withEffect,
}: {
  skill: TypeSkill,
  showAbove: HTMLDivElement,
  withEffect?: boolean,
}) => {
  helpers.tooltip.show({
    id: 'tooltip-skill',
    showAbove: showAbove,
    text: `<div class="flex g-8">
      <div>${skill.skill_name}</div>
      ${withEffect ? `<div class="skill-effect">${skill.skill_effect}</div>` : ''}
      <div class="skill-description">${skill.skill_description}</div>
    </div>`,
  })
}

const onMouseLeave = () => {
  helpers.tooltip.hide('tooltip-skill')
}

export const IconSkill = ({
  skill,
  className,
  withEffect,
}: {
  skill: TypeSkill,
  className?: string,
  withEffect?: boolean,
}) => {
  const refIcon = useRef<HTMLDivElement | null>(null)

  return <div
    ref={refIcon}
    onMouseEnter={() => onMouseEnter({
      skill,
      showAbove: refIcon.current as HTMLDivElement,
      withEffect,
    })}
    onMouseLeave={() => onMouseLeave()}
    className={`icon-skill ${className || ''}`}>
    <img src={skill.skill_icon} alt={skill.skill_name} className="skill-img" />
    <div className="skill-level">Lv.{skill.skill_level}</div>
  </div>
}

export const CharacterSkills = ({ character }: { character: CharacterInfo }) => {
  const eventSkills = useMemo(() => {
    return ((character.skills || [])
      .find(skill => skill.character_skill_grade === '0')?.character_skill || [])
      .filter(skill => (skill.skill_name || '').includes(import.meta.env.VITE_EVENT_SKILL_NAME) && skill.skill_effect !== '(Unknown)')
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
    {eventSkills.length > 0 && <div className="skills-group">
      {eventSkills.map((eventSkill, idx) => {
        return <IconSkill key={idx} skill={eventSkill} className="event-skill" withEffect={true} />
      })}
    </div>}
    {hexaSkills && <div className="skills-group">
      {hexaSkills.character_skill.map((skill, idx) => <IconSkill key={idx} skill={skill} />)}
    </div>}
  </div>
}

export default CharacterSkills