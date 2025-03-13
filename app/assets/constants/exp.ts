import { levelExpTable } from './data-level-exp'
import { RewardLevEpicDungeon, highMountainData, anglerCompanyData } from './data-epic-dungeon'
import { vipAfkData } from './data-afk'
import { extremeMonsterPark, monsterPark } from './data-monster-park'
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

// 경험치 절댓값이 아닌 %로 리턴함
export const dailyContents = {
  dailyQuestsExp: {
    arcaneRiver: ({ lev, additionalPercentage = 0 }: { lev: number, additionalPercentage?: number }): ExpRow[] => {
      if (lev >= 300) return []

      return dailyQuestsData.arcaneRiver.filter(o => o.reqLev <= lev).map(o => ({
        ...o,
        boyakRegion: 'arcaneRiver',
        $$expPercent: helpers.asPercent(o.exp / levelExpTable[lev - 1] * (100 + additionalPercentage) / 100)
      }))
    },
    tenebris: ({ lev, additionalPercentage = 0 }: { lev: number, additionalPercentage?: number }): ExpRow[] => {
      if (lev >= 300) return []

      return dailyQuestsData.tenebris.filter(o => o.reqLev <= lev).map(o => ({
        ...o,
        boyakRegion: 'arcaneRiver',
        $$expPercent: helpers.asPercent(o.exp / levelExpTable[lev - 1] * (100 + additionalPercentage) / 100)
      }))
    },
    grandis: ({ lev, additionalPercentage = 0 }: { lev: number, additionalPercentage?: number }): ExpRow[] => {
      if (lev >= 300) return []

      return dailyQuestsData.grandis.filter(o => o.reqLev <= lev).map(o => ({
        ...o,
        boyakRegion: 'grandis',
        $$expPercent: helpers.asPercent(o.exp / levelExpTable[lev - 1] * (100 + additionalPercentage) / 100)
      }))
    },
  },
  monsterPark: ({ lev, additionalPercentage = 0 }: { lev: number, additionalPercentage?: number }): ExpRow[] => {
    if (lev >= 300) return []

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
    const base = { img: 'bigfoot.png', key: 'extreme_monster_park', $$expPercent: 0 }
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
  vipAfk: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'vip_afk.png', key: 'vip_afk', $$expPercent: 0 }
    if (lev < 200) return base // 200 이하도 가능하긴 한데 효율 나쁨

    base.$$expPercent = helpers.asPercent(vipAfkData[lev - 200] * 720 / levelExpTable[lev - 1])
    return base
  },
}

export const expCoupons = {
  basic: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'exp_coupon_basic.png', key: 'exp_coupon_basic', $$expPercent: 0 }
    if (lev < 200 || lev >= 260) return base // 200 이하는 EXP 쿠폰 사용 불가능, 260 이상도 사용 가능하긴 한데 효율 나쁨

    base.$$expPercent = helpers.asPercent(basic[lev - 200] * 1000 / levelExpTable[lev - 1])
    return base
  },
  advanced: ({ lev }: { lev: number }): ExpRow => {
    const base = { img: 'exp_coupon_advanced.png', key: 'exp_coupon_advanced', $$expPercent: 0 }
    if (lev < 260) return base // 260 이하는 EXP 쿠폰 사용 불가능

    base.$$expPercent = helpers.asPercent(advanced[lev - 260] * 1000 / levelExpTable[lev - 1])
    return base
  },
}

// TODO: elixir_240.png elixir_250.webp elixir_270.webp