import { CharacterInfo } from '~/types'
import { ItemEquipment } from '~/types/item-equipment'
import { ItemEquipmentDetail } from './ItemEquipmentDetail'
import { PanelSymbolEquipment } from './PanelSymbolEquipment'
import { useEffect, useMemo, useState } from 'react'
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

  const setSelectedItemEquipmentAsNull = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('.item-equipment-detail-container')) return

    setSelectedItemEquipment(null)
  }

  useEffect(() => {
    document.addEventListener('click', setSelectedItemEquipmentAsNull)

    return () => {
      document.removeEventListener('click', setSelectedItemEquipmentAsNull)
    }
  })

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
      className="item-equipment-detail-container"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
      }}>
      <ItemEquipmentDetail itemEquipment={selectedItemEquipment}/>
    </div>}
  </>
}

export const CharacterItemEquipment = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  const sortedItems = useMemo(() => {
    const order = { '무기': -3, '보조무기': -2, '엠블렘': -1 } as Record<string, number>
    const sorted = [...character.itemEquipment.item_equipment].sort((a, b) =>
      (order[a.item_equipment_slot] || 0) - (order[b.item_equipment_slot] || 0)
    )
  
    return sorted
  }, [character])

  return <div className="character-item-equipment flex g-24">
    <div className="items-grid">
      {sortedItems.map((itemEquipment, index) => (
        <CharacterItemEquipmentSummary
          key={index}
          itemEquipment={itemEquipment}
        />
      ))}
    </div>
    <PanelSymbolEquipment character={character} />
  </div>
}