import { levelExpTable } from './data-level-exp'
import { RewardLevEpicDungeon, highMountainData, anglerCompanyData, nightmareParadiseData } from './data-epic-dungeon'
import { vipAfkData } from './data-afk'
import { extremeMonsterPark, monsterPark } from './data-monster-park'
import { monsters } from './data-monsters'
import { dailyQuestsData } from './data-daily-quests'
import { advanced, basic } from './data-exp-coupons'
import helpers from '~/helpers'

export type ExpRow = {
  key: string
  img: string
  exp?: number
  reqLev?: number
  $$title?: string
  $$expPercent: number
  boyakRegion?: string
}

const expSumRequiredTo200 = levelExpTable.slice(0, 199).reduce((sum, exp) => sum + exp, 0)

// 경험치 절댓값이 아닌 %로 리턴함
export const dailyContents = {
  dailyQuestsExp: {
    arcaneRiver: ({ lev, additionalPercentage = 0 }: { lev: number, additionalPercentage?: number }): ExpRow[] => {
      return dailyQuestsData.arcaneRiver.filter(o => o.reqLev <= lev).map(o => ({
        ...o,
        boyakRegion: 'arcaneRiver',
        $$expPercent: helpers.asPercent(o.exp / levelExpTable[lev - 1] * (100 + additionalPercentage) / 100)
      }))
    },
    tenebris: ({ lev, additionalPercentage = 0 }: { lev: number, additionalPercentage?: number }): ExpRow[] => {
      return dailyQuestsData.tenebris.filter(o => o.reqLev <= lev).map(o => ({
        ...o,
        boyakRegion: 'arcaneRiver',
        $$expPercent: helpers.asPercent(o.exp / levelExpTable[lev - 1] * (100 + additionalPercentage) / 100)
      }))
    },
    grandis: ({ lev, additionalPercentage = 0 }: { lev: number, additionalPercentage?: number }): ExpRow[] => {
      return dailyQuestsData.grandis.filter(o => o.reqLev <= lev).map(o => ({
        ...o,
        boyakRegion: 'grandis',
        $$expPercent: helpers.asPercent(o.exp / levelExpTable[lev - 1] * (100 + additionalPercentage) / 100)
      }))
    },
  },
  monsterPark: ({ lev, additionalPercentage = 0 }: { lev: number, additionalPercentage?: number }): ExpRow[] => {
    const highestExpDungeon = monsterPark.filter(o => o.reqLev <= lev).sort((a, b) => b.exp - a.exp)[0]
    if (!highestExpDungeon) return []

    const result = [{
      ...highestExpDungeon,
      $$title: `${helpers.$t('MONSTER_PARK')} (${helpers.$t(highestExpDungeon.key)})`,
      boyakRegion: 'monsterPark',
      $$expPercent: helpers.asPercent(highestExpDungeon.exp / levelExpTable[lev - 1] * (100 + additionalPercentage) / 100)
    }]

    return result
  },
}

// 경험치 절댓값이 아닌 %로 리턴함
export const weeklyContents = {
  extremeMonsterPark: ({ lev, additionalPercentage = 0 }: { lev: number, additionalPercentage?: number }): ExpRow => {
    const base = { img: 'bigfoot.png', key: 'extreme_monster_park', $$expPercent: 0, boyakRegion: 'monsterPark' }
    if (lev < 260) return base // 260 이상부터 가능

    base.$$expPercent = helpers.asPercent((extremeMonsterPark[lev - 260] * Math.pow(10, 8) / levelExpTable[lev - 1] * (100 + additionalPercentage) / 100))
    return base
  },
  highMountain: ({ lev, rewardLev }: { lev: number; rewardLev: RewardLevEpicDungeon }): ExpRow => {
    const base = { img: 'high_mountain.png', key: 'high_mountain', $$expPercent: 0 }
    if (lev < 260) return base // 260 이상부터 가능

    base.$$expPercent = Math.floor(highMountainData[lev as keyof typeof highMountainData]?.[rewardLev] * 100000) / 1000 || 0
    return base
  },
  anglerCompany: ({ lev, rewardLev }: { lev: number; rewardLev: RewardLevEpicDungeon }): ExpRow => {
    const base = { img: 'angler_company.png', key: 'angler_company', $$expPercent: 0 }
    if (lev < 270) return base // 270 이상부터 가능

    base.$$expPercent = Math.floor(anglerCompanyData[lev as keyof typeof anglerCompanyData]?.[rewardLev] * 100000) / 1000 || 0
    return base
  },
  nightmareParadise: ({ lev, rewardLev }: { lev: number, rewardLev: RewardLevEpicDungeon }): ExpRow => {
    const base = { img: 'nightmare_paradise.webp', key: 'nightmare_paradise', $$expPercent: 0 }
    if (lev < 280) return base // 280 이상부터 가능

    base.$$expPercent = Math.floor(nightmareParadiseData[lev as keyof typeof nightmareParadiseData]?.[rewardLev] * 100000) / 1000 || 0
    return base
  },
  vipAfk: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'vip_afk.png', key: 'vip_afk', $$expPercent: 0 }
    if (lev < 200) return base // 200 미만도 가능하긴 한데 효율 나쁨

    base.$$expPercent = helpers.asPercent(vipAfkData[lev - 200] * 720 / levelExpTable[lev - 1])
    return base
  },
  mvpAfk: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'mvp_afk.png', key: 'mvp_afk', $$expPercent: 0 }
    if (lev < 200) return base // 200 미만도 가능하긴 한데 효율 나쁨

    base.$$expPercent = helpers.asPercent(vipAfkData[lev - 200] * 720 / levelExpTable[lev - 1])
    return base
  },
}

export const expCoupons = {
  basic: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'exp_coupon_basic.png', key: 'exp_coupon_basic', $$expPercent: 0 }
    if (lev < 200 || lev >= 260) return base // 200 미만은 EXP 쿠폰 사용 불가능, 260 이상도 사용 가능하긴 한데 효율 나쁨

    base.$$expPercent = helpers.asPercent(basic[lev - 200] * 1000 / levelExpTable[lev - 1])
    return base
  },
  advanced: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'exp_coupon_advanced.png', key: 'exp_coupon_advanced', $$expPercent: 0 }
    if (lev < 260) return base // 260 미만은 EXP 쿠폰 사용 불가능

    base.$$expPercent = helpers.asPercent(advanced[lev - 260] * 1000 / levelExpTable[lev - 1])
    return base
  },
}

const createTreasureHunterExpPercent = (lev: number, multiple: number): number => {
  if (lev < 200) return 0 // 200 미만은 제공하지 않음 (실제로는 사용 가능하긴 함)

  const exp = monsters.find(m => m.lev === lev)?.exp
  if (!exp) return createTreasureHunterExpPercent(lev - 1, multiple)

  return helpers.asPercent((exp || 0) * multiple / levelExpTable[lev - 1])
}

export const treasureHunter = {
  gold: {
    rare: ({ lev }: { lev: number }): ExpRow => {
      return { img: 'treasure_hunter_gold.webp', key: 'treasure_hunter_gold_rare', $$expPercent: createTreasureHunterExpPercent(lev, 3000) }
    },
    epic: ({ lev }: { lev: number }): ExpRow => {
      return { img: 'treasure_hunter_gold.webp', key: 'treasure_hunter_gold_epic', $$expPercent: createTreasureHunterExpPercent(lev, 6000) }
    },
    unique: ({ lev }: { lev: number }): ExpRow => {
      const base = { img: 'treasure_hunter_gold.webp', key: 'treasure_hunter_gold_unique', $$expPercent: 0 }
      if (lev < 170) return base // 170 미만은 유니크 등급 등장 불가능

      base.$$expPercent = createTreasureHunterExpPercent(lev, 12000)
      return base
    },
    legendary: ({ lev }: { lev: number }): ExpRow => {
      const base = { img: 'treasure_hunter_gold.webp', key: 'treasure_hunter_gold_legendary', $$expPercent: 0 }
      if (lev < 200) return base // 200 미만은 레전드리 등급 등장 불가능

      base.$$expPercent = createTreasureHunterExpPercent(lev, 24000)
      return base
    },
  },
  diamond: {
    rare: ({ lev }: { lev: number }): ExpRow => {
      const base = { img: 'treasure_hunter_diamond.webp', key: 'treasure_hunter_diamond_rare', $$expPercent: 0 }
      if (lev < 230) return base // 230 미만은 다이아몬드 보물상자 사용 불가능

      base.$$expPercent = createTreasureHunterExpPercent(lev, 30000)
      return base
    },
    epic: ({ lev }: { lev: number }): ExpRow => {
      const base = { img: 'treasure_hunter_diamond.webp', key: 'treasure_hunter_diamond_epic', $$expPercent: 0 }
      if (lev < 230) return base // 230 미만은 다이아몬드 보물상자 사용 불가능

      base.$$expPercent = createTreasureHunterExpPercent(lev, 60000)
      return base
    },
    unique: ({ lev }: { lev: number }): ExpRow => {
      const base = { img: 'treasure_hunter_diamond.webp', key: 'treasure_hunter_diamond_unique', $$expPercent: 0 }
      if (lev < 230) return base // 230 미만은 다이아몬드 보물상자 사용 불가능

      base.$$expPercent = createTreasureHunterExpPercent(lev, 120000)
      return base
    },
    legendary: ({ lev }: { lev: number }): ExpRow => {
      const base = { img: 'treasure_hunter_diamond.webp', key: 'treasure_hunter_diamond_legendary', $$expPercent: 0 }
      if (lev < 230) return base // 230 미만은 다이아몬드 보물상자 사용 불가능

      base.$$expPercent = createTreasureHunterExpPercent(lev, 240000)
      return base
    },
  },
}

export const elixirs = {
  // 익성비
  _random: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'elixir_random.png', key: 'elixir_random', $$expPercent: 100 }
    if (lev < 200) return base // 200 미만은 100%

    base.$$expPercent = helpers.asPercent(levelExpTable[198] / levelExpTable[lev - 1])
    return base
  },
  // TODO: 궁성비 (이건 부정확해서 수정 필요)
  _ultimateUnion: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'elixir_ultimate_union.png', key: 'elixir_ultimate_union', $$expPercent: 0 }

    base.$$expPercent = helpers.asPercent(expSumRequiredTo200 / levelExpTable[lev - 1])
    return base
  },
  _210: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'elixir_210.png', key: 'elixir_210', $$expPercent: 100 }
    if (lev < 210) return base // 210 미만은 100%

    base.$$expPercent = helpers.asPercent(levelExpTable[208] / levelExpTable[lev - 1])
    return base
  },
  _220: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'elixir_220.png', key: 'elixir_220', $$expPercent: 100 }
    if (lev < 220) return base // 220 미만은 100%

    base.$$expPercent = helpers.asPercent(levelExpTable[218] / levelExpTable[lev - 1])
    return base
  },
  _230: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'elixir_230.png', key: 'elixir_230', $$expPercent: 100 }
    if (lev < 230) return base // 230 미만은 100%

    base.$$expPercent = helpers.asPercent(levelExpTable[228] / levelExpTable[lev - 1])
    return base
  },
  // 태성비
  _240: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'elixir_240.png', key: 'elixir_240', $$expPercent: 100 }
    if (lev < 240) return base // 240 미만은 100%

    base.$$expPercent = helpers.asPercent(levelExpTable[238] / levelExpTable[lev - 1])
    return base
  },
  // 극성비
  _250: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'elixir_250.webp', key: 'elixir_250', $$expPercent: 100 }
    if (lev < 250) return base // 250 미만은 100%

    base.$$expPercent = helpers.asPercent(levelExpTable[248] / levelExpTable[lev - 1])
    return base
  },
  // 초성비
  _270: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'elixir_270.webp', key: 'elixir_270', $$expPercent: 100 }
    if (lev < 270) return base // 270 미만은 100%

    base.$$expPercent = helpers.asPercent(levelExpTable[268] / levelExpTable[lev - 1])
    return base
  },
}