import { ItemEquipment } from '~/types/item-equipment'
import './item-equipment-detail.scss'
import helpers from '~/helpers'

const maxStars = (lev: number, isSuperial?: boolean) => {
  if (isSuperial) {
    if (lev >= 138) return 15
    if (lev >= 128) return 12
    if (lev >= 118) return 10
    if (lev >= 108) return 8
    if (lev >= 95) return 5
    return 3
  }

  if (lev >= 138) return 30
  if (lev >= 128) return 20
  if (lev >= 118) return 15
  if (lev >= 108) return 10
  if (lev >= 95) return 8
  return 5
}

const CStarforce = ({ numStars, reqLev }: { numStars: number, reqLev: number }) => {
  if (numStars === 0) return null

  const maxStarCount = maxStars(reqLev) // 레벨에 따른 최대 별 개수
  const filledStars = Math.min(numStars, maxStarCount) // 노란별 개수
  const emptyStars = maxStarCount - filledStars // 빈 별 개수

  const starsArray = [
    ...Array(filledStars).fill('fa fa-star c-bitcoin'), // 가득 찬 별
    ...Array(emptyStars).fill('fa fa-star c-text-light'), // 빈 별
  ]

  // 별을 5개씩 그룹화하여 행으로 배치
  const rows = []
  for (let i = 0; i < starsArray.length; i += 15) {
    rows.push(starsArray.slice(i, i + 15))
  }

  return (
    <div className="c-starforce">
      {rows.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="stars-row">
          {Array.from({ length: Math.ceil(row.length / 5) }, (_, groupIndex) => {
            const groupStart = groupIndex * 5
            const groupEnd = groupStart + 5
            const group = row.slice(groupStart, groupEnd)

            return <div key={`group-${rowIndex}-${groupIndex}`} className="stars-group">
              {group.map((starClass, starIndex) => (
                <i key={`star-${rowIndex}-${groupIndex}-${starIndex}`} className={starClass} />
              ))}
            </div>
          })}
        </div>
      ))}
    </div>
  )
}

const GradeBadge = ({ grade }: { grade: string }) => {
  const gradeColor = helpers.logic.gradeClass([grade])

  return <span className={`grade-badge bg-${gradeColor}`}>{gradeColor[0].toUpperCase()}</span>
}

const StatInline = ({ itemEquipment, statKey }: { itemEquipment: ItemEquipment, statKey: string }) => {
  const stat = itemEquipment.item_total_option[statKey as keyof typeof itemEquipment.item_total_option]
  const baseStat = itemEquipment.item_base_option[statKey as keyof typeof itemEquipment.item_base_option]
  const addStat = itemEquipment.item_add_option[statKey as keyof typeof itemEquipment.item_add_option]
  const etcStat = itemEquipment.item_etc_option[statKey as keyof typeof itemEquipment.item_etc_option]
  const starforceStat = itemEquipment.item_starforce_option[statKey as keyof typeof itemEquipment.item_starforce_option as keyof typeof itemEquipment.item_starforce_option]

  if (!stat || stat === '0') return null

  const enchanted = baseStat !== stat
  return <div className="stat-inline">
    <span className={`${enchanted ? 'c-rare' : ''}`}>{helpers.$t(statKey.toUpperCase())} : <span className="plus">+</span>{stat}{statKey === 'all_stat' ? '%' : ''}</span>
    {enchanted && <span>(
      {baseStat}{statKey === 'all_stat' ? '%' : ''}
      {addStat && parseInt(addStat) ? <span className="c-legendary"><span className="plus">+</span>{addStat}{statKey === 'all_stat' ? '%' : ''}</span> : ''}
      {etcStat && parseInt(etcStat) ? <span style={{ color: 'var(--gray-500)' }}><span className="plus">+</span>{etcStat}</span> : ''}
      {starforceStat && parseInt(starforceStat) ? <span className="c-unique"><span className="plus">+</span>{starforceStat}</span> : ''}
    )</span>}
  </div>
}

export const ItemEquipmentDetail = ({
  itemEquipment,
}: {
  itemEquipment: ItemEquipment,
}) => {
  return <div className="item-equipment-detail f-dotum">
    <CStarforce numStars={parseInt(itemEquipment.starforce)} reqLev={itemEquipment.item_base_option.base_equipment_level} />
    <div className="item-basic">
      {itemEquipment.soul_name && <div className="soul-name">{itemEquipment.soul_name.split(' 소울 적용')[0]}</div>}
      <div className="item-name">{itemEquipment.item_name} {helpers.logic.upgradeable(itemEquipment) && `(+${itemEquipment.scroll_upgrade})`}</div>
      {itemEquipment.potential_option_grade && <div className="potential-option-grade">({itemEquipment.potential_option_grade} 아이템)</div>}
      {itemEquipment.date_expire && <div className="expire-date">{helpers.dayjs(itemEquipment.date_expire).format('YYYY년 M월 D일 HH시 mm분')}까지 사용가능</div>}
    </div>
    <div className="hr" />
    <div className="flex-row m-t-16 m-b-16 g-8">
      <div className="item-image-container flex-shrink">
        <img src={itemEquipment.item_icon} alt={itemEquipment.item_name}/>
      </div>
      <div className="req-info">
        <div className="base-equipment-level">
          <i className="fa fa-square"/>
          REQ LEV: {itemEquipment.item_base_option.base_equipment_level}
        </div>
      </div>
    </div>
    <div className="hr" />
    <div className="item-options total">
      <div className="item-slot-part">
        {itemEquipment.item_equipment_slot === '무기' ? '무기' : '장비'}분류: {itemEquipment.item_equipment_part}
      </div>
      {['str', 'dex', 'int', 'luk', 'max_hp', 'max_mp', 'attack_power', 'magic_power', 'armor', 'speed', 'jump', 'all_stat']
        .map((key: string) => <StatInline key={key} itemEquipment={itemEquipment} statKey={key} />)}
      {itemEquipment.golden_hammer_flag === '적용' && <div className="golden-hammer-flag">황금 망치 재련 적용</div>}
      {helpers.logic.upgradeable(itemEquipment) ?
        <div className="scroll-upgradeable-count">업그레이드 가능 횟수 : {itemEquipment.scroll_upgradeable_count} <span className="c-unique">(복구 가능 횟수 : {itemEquipment.scroll_resilience_count})</span></div> :
        ''}
      {parseInt(itemEquipment.cuttable_count) <= 10 && <div className="cuttable-count c-unique">가위 사용 가능 횟수 : {itemEquipment.cuttable_count}회</div>}
    </div>
    {itemEquipment.item_description && <>
      <div className="hr" />
      {itemEquipment.item_description}
    </>}
    {itemEquipment.potential_option_1 && <>
      <div className="hr" />
      <div className="item-options potential">
        <div className="flex-row align-center g-4">
          <GradeBadge grade={itemEquipment.potential_option_grade} /><span className={`c-${helpers.logic.gradeClass([itemEquipment.potential_option_grade])}`}>잠재옵션</span>
        </div>
        {itemEquipment.potential_option_1 && <div className="potential-option">{itemEquipment.potential_option_1}</div>}
        {itemEquipment.potential_option_2 && <div className="potential-option">{itemEquipment.potential_option_2}</div>}
        {itemEquipment.potential_option_3 && <div className="potential-option">{itemEquipment.potential_option_3}</div>}
      </div>
    </>}
    {itemEquipment.additional_potential_option_1 && <>
      <div className="hr" />
      <div className="item-options additional-potential">
      <div className="flex-row align-center g-4">
          <GradeBadge grade={itemEquipment.additional_potential_option_grade} /><span className={`c-${helpers.logic.gradeClass([itemEquipment.additional_potential_option_grade])}`}>잠재옵션</span>
        </div>
        {itemEquipment.additional_potential_option_1 && <div className="additional-potential-option">+ {itemEquipment.additional_potential_option_1}</div>}
        {itemEquipment.additional_potential_option_2 && <div className="additional-potential-option">+ {itemEquipment.additional_potential_option_2}</div>}
        {itemEquipment.additional_potential_option_3 && <div className="additional-potential-option">+ {itemEquipment.additional_potential_option_3}</div>}
      </div>
    </>}
    {itemEquipment.soul_option && <>
      <div className="hr" />
      <div className="item-options soul">
        <div className="c-legendary">{itemEquipment.soul_name}</div>
        <div className="soul-option">{itemEquipment.soul_option}</div>
      </div>
    </>}
  </div>
}
