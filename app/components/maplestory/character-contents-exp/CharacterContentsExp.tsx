import { CharacterInfo } from '~/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { dailyContents, elixirs, etc, expCoupons, ExpRow, treasureHunter, weeklyContents } from '~/assets/constants/exp'
import {
  ModalHighMountain, ModalAnglerCompany, ModalNightmareParadise, ModalExtremeMonsterPark, ModalMvpAfk, ModalVipAfk,
  ModalMonsterPark, ModalExpCouponBasic, ModalExpCouponAdvanced, ModalTreasureHunterGold, ModalTreasureHunterDiamond,
  ModalElixir210, ModalElixir220, ModalElixir230,
  ModalElixir240, ModalElixir250, ModalElixir260,
  ModalElixir270, ModalElixir280,
  ModalEtcMechaberry, ModalEtcBlueberry,
  ModalElixirRandom260, ModalElixir285,
} from '~/components/modals/modal-exp-tables/ModalExpTables'
import helpers from '~/helpers'
import BadgeGlass from '~/components/common/badge-glass/BadgeGlass'
import './character-contents-exp.scss'

type ExpBoyak = { arcaneRiver: number, grandis: number, monsterPark: number }
type FoldedState = Record<string, boolean>

const MODAL_MAP = {
  high_mountain: ModalHighMountain,
  angler_company: ModalAnglerCompany,
  nightmare_paradise: ModalNightmareParadise,
  extreme_monster_park: ModalExtremeMonsterPark,
  mvp_afk: ModalMvpAfk,
  vip_afk: ModalVipAfk,
  monsterPark: ModalMonsterPark,
  exp_coupon_basic: ModalExpCouponBasic,
  exp_coupon_advanced: ModalExpCouponAdvanced,
  treasure_hunter_gold_rare: ModalTreasureHunterGold,
  treasure_hunter_gold_epic: ModalTreasureHunterGold,
  treasure_hunter_gold_unique: ModalTreasureHunterGold,
  treasure_hunter_gold_legendary: ModalTreasureHunterGold,
  treasure_hunter_diamond_rare: ModalTreasureHunterDiamond,
  treasure_hunter_diamond_epic: ModalTreasureHunterDiamond,
  treasure_hunter_diamond_unique: ModalTreasureHunterDiamond,
  treasure_hunter_diamond_legendary: ModalTreasureHunterDiamond,
  elixir_random: null,
  blue_berry: ModalEtcBlueberry,
  mecha_berry: ModalEtcMechaberry,
  elixir_210: ModalElixir210,
  elixir_220: ModalElixir220,
  elixir_230: ModalElixir230,
  elixir_240: ModalElixir240,
  elixir_250: ModalElixir250,
  elixir_260: ModalElixir260,
  elixir_270: ModalElixir270,
  elixir_280: ModalElixir280,
  elixir_random_260: ModalElixirRandom260,
  elixir_285: ModalElixir285,
}

const gradeClass = (key: string) => {
  if (key.includes('rare')) return 'c-rare'
  if (key.includes('epic')) return 'c-epic'
  if (key.includes('unique')) return 'c-unique'
  if (key.includes('legendary')) return 'c-legendary'
  return ''
}

const ContentRow = ({ row, lev, boyak }: { row: ExpRow, lev?: number, boyak?: number }) => {
  const modal = MODAL_MAP[row.key as keyof typeof MODAL_MAP] || (row.boyakRegion === 'monsterPark' ? ModalMonsterPark : null)

  return (
    <div
      onClick={() => modal && helpers.modal.open({ component: modal, options: { lev } })}
      className={`content-row ${modal ? 'cursor-pointer' : ''}`}
    >
      <div className={`key ${gradeClass(row.key || '')}`}>
        <img src={helpers.withCdn(`images/${row.img}`)} alt={row.key} />
        {helpers.$t(row.$$title || row.key)}
        {['angler_company', 'high_mountain', 'nightmare_paradise'].includes(row.key) && <span>({helpers.$t('REWARD')} Lv.2)</span>}
        {row.key.includes('exp_coupon') && <span>(1000개당)</span>}
      </div>
      <div className="value">
        {row.$$expPercent}%
        {(boyak || 0) > 0 && <BadgeGlass className="m-l-8">{`보약 +${boyak}%`}</BadgeGlass>}
      </div>
    </div>
  )
}

const FoldableSection = ({ title, items, folded, toggleFold, lev, boyak }: {
  title: string, items: ExpRow[], folded: boolean, toggleFold: () => void, lev: number, boyak?: ExpBoyak
}) => {
  const expSum = useMemo(() => {
    return items.reduce((sum, item) => {
      if (Array.isArray(item)) {
        return sum + item.reduce((subSum, row: ExpRow) => subSum + (row.$$expPercent || 0), 0)
      }
      return Math.round((sum + (item.$$expPercent || 0)) * 10000) / 10000
    }, 0)
  }, [items])

  return items.length > 0 && (
    <div className="contents">
      <div className="foldable" onClick={toggleFold}>
        <span className="title">
          {helpers.$t(title)} {['ARCANE_RIVER', 'TENEBRIS', 'GRANDIS'].includes(title) && (
            <span>({helpers.$t('SUM')}: {expSum}%)</span>
          )}
        </span>
        <i className={`fa fa-chevron-${folded ? 'down' : 'up'}`} />
      </div>
      {!folded && (
        <div className="content m-t-4 m-b-8">
          <div className="content-body">
            {items.map((item: ExpRow) => (
              Array.isArray(item) ? item.map(row => (
                <ContentRow key={row.key} row={row} lev={lev} boyak={boyak?.[row.boyakRegion as keyof ExpBoyak]} />
              )) : (
                <ContentRow
                  key={item.key}
                  row={item}
                  lev={lev}
                  boyak={item.boyakRegion ? boyak?.[item.boyakRegion as keyof ExpBoyak] : undefined}
                />
              )
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const CharacterContentsExp = ({ character }: { character: CharacterInfo }) => {
  const lev = character.basic.character_level

  const expBoyak = useMemo(() => {
    const zeroth = (character.skills.find(o => o.character_skill_grade === '0')?.character_skill || [])
      .find(o => (o.skill_name || '').includes(import.meta.env.VITE_EVENT_SKILL_NAME) && o.skill_effect !== '(Unknown)')
    if (!zeroth) return { arcaneRiver: 0, grandis: 0, monsterPark: 0 }

    const patterns = [
      { key: 'arcaneRiver', regex: /아케인리버 일일퀘스트 완료 시 획득 경험치 (\d+\.?\d*)%/g },
      { key: 'grandis', regex: /그란디스 일일퀘스트 완료 시 획득 경험치 (\d+\.?\d*)%/g },
      { key: 'monsterPark', regex: /몬스터파크 퇴장 시 획득하는 경험치 (\d+\.?\d*)%/g },
    ]

    return patterns.reduce((bonus, { key, regex }) => {
      bonus[key as keyof ExpBoyak] = [...zeroth.skill_effect.matchAll(regex)]
        .reduce((sum, match) => sum + parseFloat(match[1]), 0)
      return bonus
    }, { arcaneRiver: 0, grandis: 0, monsterPark: 0 } as ExpBoyak)
  }, [character])

  const populatedFolded = useCallback(() => {
    const symbols = character.symbolEquipment?.symbol || []
    const arcaneSymbols = symbols.filter(s => s.symbol_name.includes('아케인'))
    const allArcaneMaxed = arcaneSymbols.length > 0 && arcaneSymbols.every(s => s.symbol_level >= 20)
    const authenticSymbols = symbols.filter(s => s.symbol_name.includes('어센틱'))
    const allAuthenticMaxed = authenticSymbols.length > 0 && authenticSymbols.every(s => s.symbol_level >= 11)

    return {
      arcaneRiver: allArcaneMaxed,
      tenebris: allArcaneMaxed,
      grandis: allAuthenticMaxed,
      monsterPark: false,
      weekly: false,
      expCoupons: false,
      treasureHunter: false,
      elixirs: false,
      etc: false,
    }
  }, [character])

  const [folded, setFolded] = useState<FoldedState>(populatedFolded())

  const playable = useMemo(() => ({
    arcaneRiver: dailyContents.dailyQuestsExp.arcaneRiver({ lev, additionalPercentage: expBoyak.arcaneRiver }).filter(o => o.$$expPercent > 0),
    tenebris: dailyContents.dailyQuestsExp.tenebris({ lev, additionalPercentage: expBoyak.arcaneRiver }).filter(o => o.$$expPercent > 0),
    grandis: dailyContents.dailyQuestsExp.grandis({ lev, additionalPercentage: expBoyak.grandis }).filter(o => o.$$expPercent > 0),
    monsterPark: dailyContents.monsterPark({ lev, additionalPercentage: expBoyak.monsterPark }).filter(o => o.$$expPercent > 0),
    weekly: [
      weeklyContents.extremeMonsterPark({ lev, additionalPercentage: expBoyak.monsterPark }),
      weeklyContents.vipAfk({ lev }),
      weeklyContents.mvpAfk({ lev }),
      weeklyContents.highMountain({ lev, rewardLev: 2 }),
      weeklyContents.anglerCompany({ lev, rewardLev: 2 }),
      weeklyContents.nightmareParadise({ lev, rewardLev: 2 }),
    ].filter(o => o.$$expPercent),
    expCoupons: [expCoupons.basic({ lev }), expCoupons.advanced({ lev })].filter(o => o.$$expPercent),
    etc: [
      etc.blueBerry({ lev }),
      etc.mechaBerry({ lev }),
    ].filter(o => o.$$expPercent),
    treasureHunter: [
      treasureHunter.gold.rare({ lev }),
      treasureHunter.gold.epic({ lev }),
      treasureHunter.gold.unique({ lev }),
      treasureHunter.gold.legendary({ lev }),
      treasureHunter.diamond.rare({ lev }),
      treasureHunter.diamond.epic({ lev }),
      treasureHunter.diamond.unique({ lev }),
      treasureHunter.diamond.legendary({ lev }),
    ].filter(o => o.$$expPercent),
    elixirs: [
      elixirs._random({ lev }),
      elixirs._random_260({ lev }),
      elixirs._210({ lev }),
      elixirs._220({ lev }),
      elixirs._230({ lev }),
      elixirs._240({ lev }),
      elixirs._250({ lev }),
      elixirs._260({ lev }),
      elixirs._270({ lev }),
      elixirs._280({ lev }),
      elixirs._285({ lev }),
    ].filter(o => o.$$expPercent),
  }), [lev, expBoyak])

  useEffect(() => {
    setFolded(populatedFolded())
  }, [character, populatedFolded])

  return (
    <div className="character-contents-exp flex g-4">
      {lev < 200 && (
        <div className="level-too-low">
          캐릭터의 레벨이 200 미만이어서 이용가능한 일일 퀘스트와 주간 컨텐츠가 없습니다. 더 강해져서 돌아오세요!
        </div>
      )}
      {lev < 300 && <>
        <FoldableSection
          title='ARCANE_RIVER'
          items={playable.arcaneRiver}
          folded={folded.arcaneRiver}
          toggleFold={() => setFolded(f => ({ ...f, arcaneRiver: !f.arcaneRiver }))}
          lev={lev}
          boyak={expBoyak}
        />
        <FoldableSection
          title='TENEBRIS'
          items={playable.tenebris}
          folded={folded.tenebris}
          toggleFold={() => setFolded(f => ({ ...f, tenebris: !f.tenebris }))}
          lev={lev}
          boyak={expBoyak}
        />
        <FoldableSection
          title='GRANDIS'
          items={playable.grandis}
          folded={folded.grandis}
          toggleFold={() => setFolded(f => ({ ...f, grandis: !f.grandis }))}
          lev={lev}
          boyak={expBoyak}
        />
        <FoldableSection
          title='MONSTER_PARK'
          items={playable.monsterPark}
          folded={folded.monsterPark}
          toggleFold={() => setFolded(f => ({ ...f, monsterPark: !f.monsterPark }))}
          lev={lev}
          boyak={expBoyak}
        />
        <FoldableSection
          title='WEEKLY_CONTENTS'
          items={playable.weekly}
          folded={folded.weekly}
          toggleFold={() => setFolded(f => ({ ...f, weekly: !f.weekly }))}
          lev={lev}
          boyak={expBoyak}
        />
        <FoldableSection
          title='EXP_COUPONS'
          items={playable.expCoupons}
          folded={folded.expCoupons}
          toggleFold={() => setFolded(f => ({ ...f, expCoupons: !f.expCoupons }))}
          lev={lev}
        />
        {lev >= 260 && <FoldableSection
          title='ETC'
          items={playable.etc}
          folded={folded.etc}
          toggleFold={() => setFolded(f => ({ ...f, etc: !f.etc }))}
          lev={lev}
        />}
        <FoldableSection
          title='ELIXIRS'
          items={playable.elixirs}
          folded={folded.elixirs}
          toggleFold={() => setFolded(f => ({ ...f, elixirs: !f.elixirs }))}
          lev={lev}
        />
        <FoldableSection
          title='TREASURE_HUNTER'
          items={playable.treasureHunter}
          folded={folded.treasureHunter}
          toggleFold={() => setFolded(f => ({ ...f, treasureHunter: !f.treasureHunter }))}
          lev={lev}
        />
      </>}
      {lev === 300 && (
        <div className="level-too-high">
          <strong>{character.basic.character_name}</strong>님의 만렙을 축하합니다. 리스펙 🫡
        </div>
      )}
    </div>
  )
}