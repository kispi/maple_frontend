import { CharacterInfo } from '~/types'
import { TypeSymbol } from '~/types/symbol-equipment'
import { useMemo, useRef } from 'react'
import helpers from '~/helpers'

export const PanelSymbolEquipment = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  const refs = useRef<HTMLDivElement[]>([])

  const symbols = useMemo(() => {
    return character.symbolEquipment.symbol
  }, [character.symbolEquipment])

  const onMouseEnter = (symbol: TypeSymbol, showAbove: HTMLElement) => {
    helpers.tooltip.show({
      id: 'tooltip-symbol',
      text: `${symbol.symbol_name}\n\n${symbol.symbol_description}`,
      showAbove,
    })
  }

  const onMouseLeave = () => {
    helpers.tooltip.hide('tooltip-symbol')
  }

  return (symbols.length > 0) && <div className="panel-symbol-equipment">
    {symbols.map((symbol, idx) => <div
      ref={el => refs.current[idx] = el as HTMLDivElement}
      onMouseEnter={() => onMouseEnter(symbol, refs.current[idx])}
      onMouseLeave={() => onMouseLeave()}
      key={idx}
      className="symbol">
      <img className="symbol-icon" src={symbol.symbol_icon} alt={symbol.symbol_name} />
      <div className="symbol-level">Lv.{symbol.symbol_level}</div>
    </div>)}
  </div>
}