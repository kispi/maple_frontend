import { ItemEquipment } from '~/types/item-equipment'
import { TypeSymbol } from '~/types/symbol-equipment'

const logic = {
  isMaxForce: {
    region: ({ symbols, region }: { symbols: TypeSymbol[], region: string }) => {
      const found = symbols.find(s => s.symbol_name.includes(region))
      if (!found) return false

      if (found.symbol_name.includes('아케인')) return found.symbol_level === 20
      if (found.symbol_name.includes('어센틱')) return found.symbol_level === 11
      return false
    },
    arcane: (symbols: TypeSymbol[]) => symbols.filter(s => s.symbol_name.startsWith('아케인')).every(s => s.symbol_level === 20),
    grandis: (symbols: TypeSymbol[]) => symbols.filter(s => s.symbol_name.startsWith('어센틱')).every(s => s.symbol_level === 11),
  },
  gradeClass: (grades: string[]) => {
    if (grades.includes('익셉셔널')) return 'danger'
    if (grades.includes('레전드리')) return 'legendary'
    if (grades.includes('유니크')) return 'unique'
    if (grades.includes('에픽')) return 'epic'
    if (grades.includes('레어')) return 'rare'
    return ''
  },
  upgradeable: (itemEquipment: ItemEquipment) => parseInt(itemEquipment.scroll_upgradeable_count) +
    parseInt(itemEquipment.scroll_resilience_count) +
    parseInt(itemEquipment.scroll_upgrade) > 0,
  getWorld: (kr: string) => {
    if (!kr) return

    if (kr.startsWith('챌린저스')) return { key: 'challengers', img: 'challengers.png' }

    const map = {
      '스카니아': { key: 'scania', img: 'scania.webp' },
      '베라': { key: 'bera', img: 'bera.webp' },
      '루나': { key: 'luna', img: 'luna.png' },
      '제니스': { key: 'zenith', img: 'zenith.png' },
      '크로아': { key: 'croa', img: 'croa.png' },
      '유니온': { key: 'union', img: 'union.png' },
      '엘리시움': { key: 'elysium', img: 'elysium.png' },
      '이노시스': { key: 'enosis', img: 'enosis.png' },
      '레드': { key: 'red', img: 'red.png' },
      '오로라': { key: 'aurora', img: 'aurora.webp' },
      '아케인': { key: 'arcane', img: 'arcane.png' },
      '노바': { key: 'nova', img: 'nova.png' },
      '에오스': { key: 'eos', img: 'eos.png' },
      '헬리오스': { key: 'helios', img: 'helios.png' },
    }

    return map[kr as keyof typeof map]
  },
}

export default logic