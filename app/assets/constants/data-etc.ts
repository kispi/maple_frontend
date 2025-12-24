import { monsters } from './data-monsters'

const getBiggestMonsterExp = (lev: number): number => {
  return (monsters.find(m => m.lev === lev)?.exp || getBiggestMonsterExp(lev - 1))
}

export const mechaBerry = (() => {
  const data: Record<string, number> = {}
  for (let lev = 280; lev < 300; lev++) {
    const monsterExp = getBiggestMonsterExp(lev)
    let factor = 99
    if (lev < 285) factor = 99
    else if (lev < 290) factor = 132
    else if (lev < 300) factor = 143
    data[lev] = monsterExp * factor * 9600
  }

  return data
})()