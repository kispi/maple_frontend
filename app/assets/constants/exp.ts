import { levelExpTable } from './data-level-exp'
import { RewardLevEpicDungeon, highMountainData, anglerCompanyData } from './data-epic-dungeon'
import { vipAfkData } from './data-afk'
import { extremeMonsterPark } from './data-monster-park'
import { dailyQuestsData } from './data-daily-quests'
import { advanced, basic } from './data-exp-coupons'

const asPercent = (value: number) => Math.round(value * 100000) / 1000

// 경험치 절댓값이 아닌 %로 리턴함
export const dailyContents = {
  dailyQuestsExp: {
    arcaneRiver: ({ lev, additionalPercentage = 0 }: { lev: number, additionalPercentage?: number }) =>
      dailyQuestsData.arcaneRiver.filter(o => o.reqLev <= lev).map(o => ({
        ...o,
        boyakRegion: 'arcaneRiver',
        $$expPercent: asPercent(o.exp / levelExpTable[lev - 1] * (100 + additionalPercentage) / 100)
      })),
    tenebris: ({ lev, additionalPercentage = 0 }: { lev: number, additionalPercentage?: number }) =>
      dailyQuestsData.tenebris.filter(o => o.reqLev <= lev).map(o => ({
        ...o,
        boyakRegion: 'arcaneRiver',
        $$expPercent: asPercent(o.exp / levelExpTable[lev - 1] * (100 + additionalPercentage) / 100)
      })),
    grandis: ({ lev, additionalPercentage = 0 }: { lev: number, additionalPercentage?: number }) =>
      dailyQuestsData.grandis.filter(o => o.reqLev <= lev).map(o => ({
        ...o,
        boyakRegion: 'grandis',
        $$expPercent: asPercent(o.exp / levelExpTable[lev - 1] * (100 + additionalPercentage) / 100)
      })),
  },
}

// 경험치 절댓값이 아닌 %로 리턴함
export const weeklyContents = {
  extremeMonsterPark: ({ lev, additionalPercentage = 0 }: { lev: number, additionalPercentage?: number }) => {
    const base = { img: 'bigfoot.png', key: 'extreme_monster_park', $$expPercent: 0 }
    if (lev < 260) return base // 260 이상부터 가능

    base.$$expPercent = asPercent((extremeMonsterPark[lev - 260] * Math.pow(10, 8) / levelExpTable[lev - 1] * (100 + additionalPercentage) / 100))
    return base
  },
  highMountain: ({ lev, rewardLev }: { lev: number; rewardLev: RewardLevEpicDungeon }) => {
    const base = { img: 'high_mountain.png', key: 'high_mountain', $$expPercent: 0 }
    if (lev < 260) return base // 260 이상부터 가능

    base.$$expPercent = Math.floor(highMountainData[lev as keyof typeof highMountainData]?.[rewardLev] * 100000) / 1000 || 0
    return base
  },
  anglerCompany: ({ lev, rewardLev }: { lev: number; rewardLev: RewardLevEpicDungeon }) => {
    const base = { img: 'angler_company.png', key: 'angler_company', $$expPercent: 0 }
    if (lev < 270) return base // 270 이상부터 가능

    base.$$expPercent = Math.floor(anglerCompanyData[lev as keyof typeof anglerCompanyData]?.[rewardLev] * 100000) / 1000 || 0
    return base
  },
  vipAfk: ({ lev }: { lev: number }) => {
    const base = { img: 'vip_afk.png', key: 'vip_afk', $$expPercent: 0 }
    if (lev < 200) return base // 200 이하도 가능하긴 한데 효율 나쁨

    base.$$expPercent = asPercent(vipAfkData[lev - 200] * 720 / levelExpTable[lev - 1])
    return base
  },
}

export const expCoupons = {
  basic: ({ lev }: { lev: number }) => {
    const base = { img: 'exp_coupon_basic.png', key: 'exp_coupon_basic', $$expPercent: 0 }
    if (lev < 200) return base // 200 이하는 EXP 쿠폰 사용 불가능

    base.$$expPercent = asPercent(basic[lev - 200] * 1000 / levelExpTable[lev - 1])
    if (lev >= 261) base.$$expPercent = asPercent(basic[basic.length - 1] / levelExpTable[lev - 1])
    return base
  },
  advanced: ({ lev }: { lev: number }) => {
    const base = { img: 'exp_coupon_advanced.png', key: 'exp_coupon_advanced', $$expPercent: 0 }
    if (lev < 260) return base // 260 이하는 EXP 쿠폰 사용 불가능

    base.$$expPercent = asPercent(advanced[lev - 260] * 1000 / levelExpTable[lev - 1])
    return base
  },
}

// TODO: elixir_240.png elixir_250.webp elixir_270.webp