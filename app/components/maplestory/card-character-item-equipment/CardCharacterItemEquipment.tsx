import { CharacterItemEquipment, ItemEquipment } from '~/types/item-equipment'
import helpers from '~/helpers'
import './card-character-item-equipment.scss'

const GradeBadge = ({ grade }: { grade: string }) => {
  const gradeColor = () => {
    if (grade === '레전드리') return 'bg-legendary'
    if (grade === '유니크') return 'bg-unique'
    if (grade === '에픽') return 'bg-epic'
    if (grade === '레어') return 'bg-rare'
    return ''
  }
  return <span className={`badge-fill c-white f-400 f-10 ${gradeColor()}`}>{grade}</span>
}

export const CharacterItemEquipmentSummary = ({
  itemEquipment,
  setSelectedItemEquipment,
}: {
  itemEquipment: ItemEquipment,
  setSelectedItemEquipment: (itemEquipment: ItemEquipment) => void,
}) => {
  return <div
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
        {itemEquipment.special_ring_level > 0 && <span className="badge-fill bg-border-base c-black c-white f-400 f-10">Lv.{itemEquipment.special_ring_level}</span>}
      </div>
    </div>
  </div>
}

export const CardCharacterItemEquipment = ({
  characterItemEquipment,
  setSelectedItemEquipment,
}: {
  characterItemEquipment: CharacterItemEquipment,
  setSelectedItemEquipment: (itemEquipment: ItemEquipment) => void,
}) => {
  return <div className="card-character-item-equipment card">
    {characterItemEquipment.item_equipment.map((itemEquipment, index) => (
      <CharacterItemEquipmentSummary
        setSelectedItemEquipment={setSelectedItemEquipment}
        key={index}
        itemEquipment={itemEquipment}
      />
    ))}
  </div>
}