import { ItemEquipment } from '~/types/item-equipment'
import './item-equipment-detail.scss'

const maxStars = (lev: number, isSuperial?: boolean) => {
  if (isSuperial) {
    if (lev >= 138) return 15
    if (lev >= 128) return 12
    if (lev >= 118) return 10
    if (lev >= 108) return 8
    if (lev >= 95) return 5
    return 3
  }

  if (lev >= 138) return 25
  if (lev >= 128) return 20
  if (lev >= 118) return 15
  if (lev >= 108) return 10
  if (lev >= 95) return 8
  return 5
}

const CStarforce = ({ numStars, reqLev }: { numStars: number, reqLev: number }) => {
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

export const ItemEquipmentDetail = ({
  itemEquipment,
}: {
  itemEquipment: ItemEquipment,
}) => {
  console.log(itemEquipment)
  return <div className="item-equipment-detail">
    <CStarforce numStars={parseInt(itemEquipment.starforce)} reqLev={itemEquipment.item_base_option.base_equipment_level} />
    <div className="item-basic">
      {itemEquipment.soul_name && <div className="soul-name">{itemEquipment.soul_name.split(' 소울 적용')[0]}</div>}
      <div className="item-name">{itemEquipment.item_name} {itemEquipment.scroll_upgrade && `(+${itemEquipment.scroll_upgrade})`}</div>
      {itemEquipment.potential_option_grade && <div className="potential-option-grade">({itemEquipment.potential_option_grade} 아이템)</div>}
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
  </div>
}