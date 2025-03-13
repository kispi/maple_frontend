import { highMountainData, anglerCompanyData } from '~/assets/constants/data-epic-dungeon'
import { extremeMonsterPark, monsterPark } from '~/assets/constants/data-monster-park'
import { vipAfkData } from '~/assets/constants/data-afk'
import { expCoupons } from '~/assets/constants/exp'
import { levelExpTable } from '~/assets/constants/data-level-exp'
import { useEffect } from 'react'
import ModalHeader from '../ModalHeader'
import helpers from '~/helpers'
import useAppStore from '~/store/app'
import './modal-exp-tables.scss'

const createLevels = (from: number, count: number) => [...Array(count).keys()].map(idx => idx + from)

const useAutoFocus = () => {
  useEffect(() => {
    const dom = document.querySelector('.tr.selected')
    if (dom) dom.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [])
}

const modalTitle = (title: string, img: string) => `<div class="flex-row align-center g-8">
  <img
    src="${helpers.withCdn(`images/${img}`)}"
    style="width: 24px; height: 24px"
  ><div>${helpers.$t(title)}</div>
</div>`

export const ModalHighMountain = ({
  options,
  onClose,
}: {
  options?: { lev: number },
  onClose: () => void,
}) => {
  useAutoFocus()

  return <div className="modal-high-mountain modal-base-style modal-exp-table scrollable-body">
    <ModalHeader title={modalTitle('HIGH_MOUNTAIN', 'high_mountain.png')} onClose={() => onClose()} />
    <div className="modal-body pretty-scrollbar">
      <div className="table">
        <div className="thead">
          <div className="tr">
            <div className="th">{helpers.$t('LEVEL')}</div>
            <div className="th">{helpers.$t('DEFAULT')}</div>
            <div className="th">Lv.1</div>
            <div className="th">Lv.2</div>
          </div>
        </div>
        <div className="tbody">
          {Object.values(highMountainData).map((row, idx) => <div
            key={idx}
            className={`tr ${options?.lev === idx + 260 ? 'selected' : ''}`}>
            <div className="td">{idx + 260}</div>
            {row.map((exp, idx) => <div key={idx} className="td">{Math.floor(exp * 10000) / 100}%</div>)}
          </div>)}
        </div>
      </div>
    </div>
  </div>
}

export const ModalAnglerCompany = ({
  options,
  onClose,
}: {
  options?: { lev: number },
  onClose: () => void,
}) => {
  useAutoFocus()

  return <div className="modal-angler-company modal-base-style modal-exp-table scrollable-body">
    <ModalHeader title={modalTitle('ANGLER_COMPANY', 'angler_company.png')} onClose={() => onClose()} />
    <div className="modal-body pretty-scrollbar">
      <div className="table">
        <div className="thead">
          <div className="tr">
            <div className="th">{helpers.$t('LEVEL')}</div>
            <div className="th">{helpers.$t('DEFAULT')}</div>
            <div className="th">Lv.1</div>
            <div className="th">Lv.2</div>
          </div>
        </div>
        <div className="tbody">
          {Object.values(anglerCompanyData).map((row, idx) => <div
            key={idx}
            className={`tr ${options?.lev === idx + 270 ? 'selected' : ''}`}>
            <div className="td">{idx + 270}</div>
            {row.map((exp, idx) => <div key={idx} className="td">{Math.floor(exp * 10000) / 100}%</div>)}
          </div>)}
        </div>
      </div>
    </div>
  </div>
}

export const ModalExtremeMonsterPark = ({
  options,
  onClose,
}: {
  options?: { lev: number },
  onClose: () => void,
}) => {
  const { isMobile } = useAppStore()

  useAutoFocus()

  return <div className="modal-extreme-monster-park modal-base-style modal-exp-table scrollable-body">
    <ModalHeader title={modalTitle('EXTREME_MONSTER_PARK', 'bigfoot.png')} onClose={() => onClose()} />
    <div className="modal-body pretty-scrollbar">
      <div className="table">
        <div className="thead">
          <div className="tr">
            <div className="th">{helpers.$t('LEVEL')}</div>
            <div className="th">{helpers.$t('DEFAULT')}</div>
            {isMobile ? null : <>
              <div className="th">+5%</div>
              <div className="th">+10%</div>
              <div className="th">+20%</div>
              <div className="th">+30%</div>
              <div className="th">+40%</div>
            </>}
            <div className="th">+50%</div>
          </div>
        </div>
        <div className="tbody">
          {extremeMonsterPark.map((val, idx) => <div
            key={idx}
            className={`tr ${options?.lev === idx + 260 ? 'selected' : ''}`}>
            <div className="td">{idx + 260}</div>
            <div className="td">{helpers.asPercent(val * Math.pow(10, 8) / levelExpTable[idx + 260 - 1], 2)}%</div>
            {isMobile ? null : <>
              <div className="td">{helpers.asPercent(val * Math.pow(10, 8) / levelExpTable[idx + 260 - 1] * (100 + 5) / 100, 2)}%</div>
              <div className="td">{helpers.asPercent(val * Math.pow(10, 8) / levelExpTable[idx + 260 - 1] * (100 + 10) / 100, 2)}%</div>
              <div className="td">{helpers.asPercent(val * Math.pow(10, 8) / levelExpTable[idx + 260 - 1] * (100 + 20) / 100, 2)}%</div>
              <div className="td">{helpers.asPercent(val * Math.pow(10, 8) / levelExpTable[idx + 260 - 1] * (100 + 30) / 100, 2)}%</div>
              <div className="td">{helpers.asPercent(val * Math.pow(10, 8) / levelExpTable[idx + 260 - 1] * (100 + 40) / 100, 2)}%</div>
            </>}
            <div className="td">{helpers.asPercent(val * Math.pow(10, 8) / levelExpTable[idx + 260 - 1] * (100 + 50) / 100, 2)}%</div>
          </div>)}
        </div>
      </div>
    </div>
  </div>
}

export const ModalMonsterPark = ({
  options,
  onClose,
}: {
  options?: { lev: number },
  onClose: () => void,
}) => {
  const highestExpDungeon = (lev: number) => monsterPark.filter(o => o.reqLev <= lev).sort((a, b) => b.exp - a.exp)[0]

  useAutoFocus()

  return <div className="modal-monster-park modal-base-style modal-exp-table scrollable-body">
    <ModalHeader title={`${helpers.$t('MONSTER_PARK')} (1판당 / 보약 미적용)`} onClose={() => onClose()} />
    <div className="modal-body pretty-scrollbar">
      <div className="table">
        <div className="thead">
          <div className="tr">
            <div className="th">{helpers.$t('DUNGEON')}</div>
            <div className="th">{helpers.$t('LEVEL')}</div>
            <div className="th">{helpers.$t('DEFAULT')}</div>
            <div className="th">{helpers.$t('SUNDAY')} (150%)</div>
            <div className="th">{helpers.$t('SPECIAL_SUNDAY')} (400%)</div>
          </div>
        </div>
        <div className="tbody">
          {createLevels(200, 100).map((lev, idx) => <div
            key={idx}
            className={`tr ${options?.lev === lev ? 'selected' : ''}`}>
            <div className="td">
              <img src={helpers.withCdn(`images/${highestExpDungeon(lev).img}`)} alt={highestExpDungeon(lev).key} />
            </div>
            <div className="td">{lev}</div>
            <div className="td">{helpers.asPercent(highestExpDungeon(lev).exp / levelExpTable[lev - 1])}%</div>
            <div className="td">{helpers.asPercent(highestExpDungeon(lev).exp / levelExpTable[lev - 1] * 1.5)}%</div>
            <div className="td">{helpers.asPercent(highestExpDungeon(lev).exp / levelExpTable[lev - 1] * 4)}%</div>
          </div>)}
        </div>
      </div>
    </div>
  </div>
}

export const ModalVipAfk = ({
  options,
  onClose,
}: {
  options?: { lev: number },
  onClose: () => void,
}) => {
  useAutoFocus()

  const displayValue = (lev: number) => {
    const ticksPerHour = 720 // 1시간 = 5초 * 720틱
    let currentLevel = lev // 현재 레벨
    let totalExp = 0 // 누적 경험치
    let remainingTicks = ticksPerHour // 남은 틱 수

    while (remainingTicks > 0) {
      const requiredExp = levelExpTable[currentLevel - 1] // 현재 레벨 필요 경험치 (1레벨부터)
      const expPerTick = vipAfkData[currentLevel - 200] // 현재 레벨 틱당 경험치 (200레벨부터)
      const expThisLevel = expPerTick * remainingTicks // 남은 틱으로 얻을 수 있는 경험치

      if (expThisLevel < requiredExp) {
        // 레벨업 못하면 현재 레벨에서 % 계산
        totalExp += expThisLevel
        const percentage = (totalExp / requiredExp) * 100
        return `${currentLevel !== lev ? `(Lv.${currentLevel + 1})` : ''} ${percentage.toFixed(3)}%`
      } else {
        // 레벨업 가능한 경우
        const ticksToLevelUp = Math.ceil(requiredExp / expPerTick) // 레벨업까지 틱 수
        totalExp = requiredExp // 현재 레벨 필요 경험치까지만 추가
        remainingTicks -= ticksToLevelUp // 남은 틱 갱신
        currentLevel++ // 다음 레벨로 이동
        totalExp = 0 // 다음 레벨로 넘어가며 경험치 초기화
      }
    }
  }

  return <div className="modal-vip-afk modal-base-style modal-exp-table scrollable-body">
    <ModalHeader title={modalTitle('VIP_AFK', 'vip_afk.png')} onClose={() => onClose()} />
    <div className="modal-body pretty-scrollbar">
      <div className="table">
        <div className="thead">
          <div className="tr">
            <div className="th">{helpers.$t('LEVEL')}</div>
            <div className="th">경험치/1틱(5초)</div>
            <div className="th">1시간</div>
          </div>
        </div>
        <div className="tbody">
          {vipAfkData.map((exp, idx) => <div
            key={idx}
            className={`tr ${options?.lev === idx + 200 ? 'selected' : ''}`}>
            <div className="td">{idx + 200}</div>
            <div className="td">{exp.toLocaleString()}</div>
            <div className="td">{displayValue(idx + 200)}</div>
          </div>)}
        </div>
      </div>
    </div>
  </div>
}

export const ModalExpCouponBasic = ({
  options,
  onClose,
}: {
  options?: { lev: number },
  onClose: () => void,
}) => {
  useAutoFocus()

  return <div className="modal-exp-coupon-basic modal-base-style modal-exp-table scrollable-body">
    <ModalHeader title={modalTitle('EXP_COUPON_BASIC', 'exp_coupon_basic.png')} onClose={() => onClose()} />
    <div className="modal-body pretty-scrollbar">
      <div className="table">
        <div className="thead">
          <div className="tr">
            <div className="th">{helpers.$t('LEVEL')}</div>
            <div className="th">1000개당</div>
          </div>
        </div>
        <div className="tbody">
        {createLevels(200, 60).map((lev, idx) => <div
            key={idx}
            className={`tr ${options?.lev === lev ? 'selected' : ''}`}>
            <div className="td">{lev}</div>
            <div className="td">{expCoupons.basic({ lev }).$$expPercent}%</div>
          </div>)}
        </div>
      </div>
    </div>
  </div>
}

export const ModalExpCouponAdvanced = ({
  options,
  onClose,
}: {
  options?: { lev: number },
  onClose: () => void,
}) => {
  useAutoFocus()

  return <div className="modal-exp-coupon-basic modal-base-style modal-exp-table scrollable-body">
    <ModalHeader title={modalTitle('EXP_COUPON_ADVANCED', 'exp_coupon_advanced.png')} onClose={() => onClose()} />
    <div className="modal-body pretty-scrollbar">
      <div className="table">
        <div className="thead">
          <div className="tr">
            <div className="th">{helpers.$t('LEVEL')}</div>
            <div className="th">1000개당</div>
          </div>
        </div>
        <div className="tbody">
        {createLevels(260, 40).map((lev, idx) => <div
            key={idx}
            className={`tr ${options?.lev === lev ? 'selected' : ''}`}>
            <div className="td">{lev}</div>
            <div className="td">{expCoupons.advanced({ lev }).$$expPercent}%</div>
          </div>)}
        </div>
      </div>
    </div>
  </div>
}