import { CharacterInfo } from '~/types'
import { ItemEquipment } from '~/types/item-equipment'
import { ItemEquipmentDetail } from './ItemEquipmentDetail'
import { PanelSymbolEquipment } from './PanelSymbolEquipment'
import { useMemo, useState } from 'react'
import { PresetSelector } from '../../common/preset-selector/PresetSelector'
import { specialRingNames } from '~/assets/constants/data-item-equipment'
import helpers from '~/helpers'
import './character-item-equipment.scss'

const GradeBadge = ({ grade }: { grade: string }) => {
  return <span className={`badge-fill c-white f-400 f-10 bg-${helpers.logic.gradeClass([grade])}`}>{grade}</span>
}

export const CharacterItemEquipmentSummary = ({
  itemEquipment,
}: {
  itemEquipment: ItemEquipment,
}) => {
  const [selectedItemEquipment, setSelectedItemEquipment] = useState<ItemEquipment | null>(null)

  const setSelectedItemEquipmentAsNull = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.item-equipment-detail')) return

    setSelectedItemEquipment(null)
  }

  return <>
    <div
      onClick={() => setSelectedItemEquipment(itemEquipment)}
      className="character-item-equipment-summary">
      <div
        className={`image-container ${helpers.logic.gradeClass([itemEquipment.potential_option_grade, itemEquipment.additional_potential_option_grade])}`}>
        <img src={itemEquipment.item_icon} alt={itemEquipment.item_name} />
      </div>
      <div className="item-info">
        <div>
          {itemEquipment.item_name && <span className="item-name">{itemEquipment.item_name}</span>}
          {itemEquipment.starforce > "0" && <span className="starforce"><i className="fa fa-star c-bitcoin m-r-4" />{itemEquipment.starforce}</span>}
        </div>
        <div>
          {itemEquipment.potential_option_grade && <GradeBadge grade={itemEquipment.potential_option_grade} />}
          {itemEquipment.additional_potential_option_grade && <GradeBadge grade={itemEquipment.additional_potential_option_grade} />}
          {itemEquipment.special_ring_level > 0 && <span className="badge-fill bg-text-base c-border-base c-white f-400 f-10">Lv.{itemEquipment.special_ring_level}</span>}
          {itemEquipment.item_exceptional_option.exceptional_upgrade > 0 && <GradeBadge grade="익셉셔널" />}
        </div>
      </div>
    </div>
    {selectedItemEquipment && <div
      onClick={setSelectedItemEquipmentAsNull}
      className="item-equipment-detail-container"
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
      }}>
      <ItemEquipmentDetail itemEquipment={selectedItemEquipment} />
    </div>}
  </>
}

export const CharacterItemEquipment = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  const [activePreset, setActivePreset] = useState<number>(character.itemEquipment.preset_no || 1)

  const items = useMemo(() => {
    if (activePreset === 1) return character.itemEquipment.item_equipment_preset_1 || []
    if (activePreset === 2) return character.itemEquipment.item_equipment_preset_2 || []
    if (activePreset === 3) return character.itemEquipment.item_equipment_preset_3 || []
    return character.itemEquipment.item_equipment
  }, [character, activePreset])

  const itemGroups = useMemo(() => {
    const slotGroups = [
      ['무기', '보조무기', '엠블렘'],
      ['모자', '상의', '하의', '신발', '장갑', '망토'],
      ['어깨장식', '얼굴장식', '눈장식', '귀고리', '벨트', '펜던트', '펜던트2'],
      ['반지1', '반지2', '반지3', '반지4', '예비 특수 반지'],
      ['훈장', '뱃지', '포켓 아이템', '기계 심장'],
    ]

    const allDefinedSlots = slotGroups.flat()

    const groups = slotGroups.map(slots => {
      const groupItems = items.filter(item => slots.includes(item.item_equipment_slot))

      groupItems.sort((a, b) => {
        // 반지 그룹 특수 정렬: 특수 반지 -> 예비 특수 반지 -> 나머지
        if (slots.includes('반지1')) {
          const aIsSpecial = specialRingNames[a.item_name] ?? false
          const bIsSpecial = specialRingNames[b.item_name] ?? false

          const aScore = aIsSpecial ? 0 : (a.item_equipment_slot === '예비 특수 반지' ? 1 : 2)
          const bScore = bIsSpecial ? 0 : (b.item_equipment_slot === '예비 특수 반지' ? 1 : 2)

          if (aScore !== bScore) return aScore - bScore
        }

        return slots.indexOf(a.item_equipment_slot) - slots.indexOf(b.item_equipment_slot)
      })

      return groupItems
    })

    // 정의되지 않은 슬롯의 아이템들도 하단에 추가
    const otherItems = items.filter(item => !allDefinedSlots.includes(item.item_equipment_slot))
    if (otherItems.length > 0) {
      groups.push(otherItems)
    }

    return groups
  }, [items])

  return <div className="character-item-equipment flex g-24">
    <div className="items-sections flex-column g-24 flex-1">
      <PresetSelector
        currentPreset={activePreset}
        onSelect={setActivePreset}
        className="m-b-8"
      />
      {itemGroups.map((group, groupIndex) => (
        group.length > 0 && (
          <div key={groupIndex} className="items-grid">
            {group.map((itemEquipment, index) => (
              <CharacterItemEquipmentSummary
                key={`${groupIndex}-${index}`}
                itemEquipment={itemEquipment}
              />
            ))}
          </div>
        )
      ))}
    </div>
    <PanelSymbolEquipment character={character} />
  </div>
}