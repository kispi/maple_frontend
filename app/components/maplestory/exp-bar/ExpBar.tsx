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

  if (currentLevel < 205) baseCase = { min: 23, max: 30 }
  else if (currentLevel < 210) baseCase = { min: 23, max: 39 }
  else if (currentLevel < 215) baseCase = { min: 23, max: 33 }
  else if (currentLevel < 220) baseCase = { min: 42, max: 63 }
  else if (currentLevel < 225) baseCase = { min: 53, max: 70 }
  else if (currentLevel < 230) baseCase = { min: 1.8 * 60, max: 2.1 * 60 }
  else if (currentLevel < 235) baseCase = { min: 2.1 * 60, max: 2.3 * 60 }
  else if (currentLevel < 240) baseCase = { min: 2.7 * 60, max: 3.1 * 60 }
  else if (currentLevel < 245) baseCase = { min: 3.7 * 60, max: 4.3 * 60 }
  else if (currentLevel < 250) baseCase = { min: 5.4 * 60, max: 6 * 60 }
  else if (currentLevel < 255) baseCase = { min: 8.6 * 60, max: 11.3 * 60 }
  else if (currentLevel < 260) baseCase = { min: 8.6 * 60, max: 9.6 * 60 }
  else if (currentLevel < 265) baseCase = { min: 8.2 * 60, max: 8.2 * 60 }
  else if (currentLevel < 270) baseCase = { min: 9.1 * 60, max: 9.1 * 60 }
  else if (currentLevel < 275) baseCase = { min: 17.8 * 60, max: 17.8 * 60 }
  else if (currentLevel < 280) baseCase = { min: 32 * 60, max: 32 * 60 }
  else if (currentLevel < 285) baseCase = { min: 70 * 60, max: 99 * 60 }
  else if (currentLevel < 290) baseCase = { min: 160 * 60, max: 242 * 60 }
  else if (currentLevel < 295) baseCase = { min: 380 * 60, max: 579 * 60 }
  else if (currentLevel < 300) baseCase = { min: 1441 * 60, max: 3450 * 60 }

  return baseCase ? {
    min: (baseCase.min * (100 - currentExpPercent)) / 100,
    max: (baseCase.max * (100 - currentExpPercent)) / 100,
  } : null
}

const minToHour = (min: number) => {
  const hour = Math.floor(min / 60)
  const remain = min % 60
  const result = hour + remain / 60
  return Math.round((result < 5 ? result : Math.round(result)) * 100) / 100
}

const HuntGuestimation = ({ expRate, level } : { expRate: string, level: number }) => {
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

const ExpBar = ({ expRate, level, simple } : { expRate: string, level: number, simple?: boolean }) => {
  const onMouseOver = () => {
    if (simple) return

    helpers.tooltip.show({
      id: 'tooltip-exp-bar',
      showAbove: document.querySelector('.exp-bar') as HTMLElement,
      text: '레벨업까지 필요한 예상 사냥시간입니다.',
    })
  }

  const onMouseOut = () => {
    if (simple) return

    helpers.tooltip.hide('tooltip-exp-bar')
  }

  return <a
    onMouseOver={() => onMouseOver()}
    onMouseOut={() => onMouseOut()}
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