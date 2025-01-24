import { ItemEquipment } from '~/types/item-equipment'

const logic = {
  gradeClass: (grades: string[]) => {
    if (grades.includes('레전드리')) return 'legendary'
    if (grades.includes('유니크')) return 'unique'
    if (grades.includes('에픽')) return 'epic'
    if (grades.includes('레어')) return 'rare'
    return ''
  },
  upgradeable: (itemEquipment: ItemEquipment) => parseInt(itemEquipment.scroll_upgradeable_count) +
    parseInt(itemEquipment.scroll_resilience_count) +
    parseInt(itemEquipment.scroll_upgrade) > 0
}

export default logic