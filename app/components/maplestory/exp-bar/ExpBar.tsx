import { useRef } from 'react'
import helpers from '~/helpers'
import './exp-bar.scss'

const estimatedMinutesToLevelUp = ({
  currentLevel,
  currentExpPercent,
}: {
  currentLevel: number,
  currentExpPercent: number,
}) => {
  // 200 미만은 무시
  let baseCase = null

  if (currentLevel < 205) baseCase = { min: 18, max: 30 }
  else if (currentLevel < 210) baseCase = { min: 20, max: 31 }
  else if (currentLevel < 215) baseCase = { min: 21, max: 31 }
  else if (currentLevel < 220) baseCase = { min: 39, max: 55 }
  else if (currentLevel < 225) baseCase = { min: 45, max: 60 }
  else if (currentLevel < 230) baseCase = { min: 1.2 * 60, max: 1.6 * 60 }
  else if (currentLevel < 235) baseCase = { min: 1.6 * 60, max: 1.7 * 60 }
  else if (currentLevel < 240) baseCase = { min: 1.7 * 60, max: 2 * 60 }
  else if (currentLevel < 245) baseCase = { min: 2.2 * 60, max: 2.5 * 60 }
  else if (currentLevel < 250) baseCase = { min: 2.8 * 60, max: 3.2 * 60 }
  else if (currentLevel < 255) baseCase = { min: 3.8 * 60, max: 4.3 * 60 }
  else if (currentLevel < 260) baseCase = { min: 3.8 * 60, max: 4.3 * 60 }
  else if (currentLevel < 265) baseCase = { min: 8.2 * 60, max: 8.2 * 60 }
  else if (currentLevel < 270) baseCase = { min: 9.1 * 60, max: 9.1 * 60 }
  else if (currentLevel < 275) baseCase = { min: 17.8 * 60, max: 17.8 * 60 }
  else if (currentLevel < 280) baseCase = { min: 32 * 60, max: 41 * 60 }
  else if (currentLevel < 285) baseCase = { min: 70 * 60, max: 99 * 60 }
  else if (currentLevel < 290) baseCase = { min: 160 * 60, max: 242 * 60 }
  else if (currentLevel < 295) baseCase = { min: 342 * 60, max: 521 * 60 }
  else if (currentLevel < 300) baseCase = { min: 700 * 60, max: 1340 * 60 }

  return baseCase ? {
    min: (baseCase.min * (100 - currentExpPercent)) / 100,
    max: (baseCase.max * (100 - currentExpPercent)) / 100,
  } : null
}

const minToHour = (min: number) => {
  const result = min / 60
  return Math.round(result * 10) / 10
}

const HuntGuestimation = ({ expRate, level }: { expRate: string, level: number }) => {
  const requiredHuntTimes = estimatedMinutesToLevelUp({
    currentExpPercent: parseFloat(expRate),
    currentLevel: level,
  })

  if (!requiredHuntTimes) return null

  const a = minToHour(requiredHuntTimes.min)
  const b = minToHour(requiredHuntTimes.max)
  return <span className="hunt-guestimation m-l-8">
    ({a === b ? a : `${a} ~ ${b}`}h left)
  </span>
}

const ExpBar = ({ expRate, level, simple }: { expRate: string, level: number, simple?: boolean }) => {
  const refExpBar = useRef<HTMLAnchorElement>(null)

  const onMouseEnter = () => {
    if (simple || !refExpBar.current) return

    helpers.tooltip.show({
      id: 'tooltip-exp-bar',
      showAbove: refExpBar.current,
      text: '레벨업까지 필요한 예상 사냥시간입니다.',
    })
  }

  const onMouseLeave = () => {
    if (simple) return

    helpers.tooltip.hide('tooltip-exp-bar')
  }

  return <a
    ref={refExpBar}
    onMouseEnter={() => onMouseEnter()}
    onMouseLeave={() => onMouseLeave()}
    onClick={e => simple ? e.preventDefault() : null}
    href="https://namu.wiki/w/%EB%A9%94%EC%9D%B4%ED%94%8C%EC%8A%A4%ED%86%A0%EB%A6%AC/%EB%A0%88%EB%B2%A8#s-9.1.2"
    target="_blank"
    rel="noreferrer"
    className="exp-bar">
    <div
      className="exp-fill overlay"
      style={{ width: `${expRate}%` }}
    >
    </div>
    <div className="exp-text overlay">
      <b>{expRate}%</b>
      {!simple && <HuntGuestimation expRate={expRate} level={level} />}
    </div>
  </a>
}

export default ExpBar