import { CharacterInfo } from '~/types'
import { ItemEquipment } from '~/types/item-equipment'
import { ItemEquipmentDetail } from './ItemEquipmentDetail'
import { PanelSymbolEquipment } from './PanelSymbolEquipment'
import { useMemo, useState } from 'react'
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
  const sortedItems = useMemo(() => {
    const order: Record<string, number> = {
      '무기': 10,
      '보조무기': 20,
      '엠블렘': 30,
      '모자': 100,
      '상의': 110,
      '하의': 120,
      '신발': 130,
      '장갑': 140,
      '망토': 150,
      '어깨장식': 160,
      '얼굴장식': 200,
      '눈장식': 210,
      '귀고리': 220,
      '벨트': 230,
      '반지1': 300,
      '반지2': 310,
      '반지3': 320,
      '반지4': 330,
      '예비 특수 반지': 340,
      '펜던트': 400,
      '펜던트2': 410,
      '훈장': 500,
      '뱃지': 510,
      '포켓 아이템': 520,
      '기계 심장': 530,
    }
    const sorted = [...character.itemEquipment.item_equipment].sort((a, b) =>
      (order[a.item_equipment_slot] ?? 999) - (order[b.item_equipment_slot] ?? 999)
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