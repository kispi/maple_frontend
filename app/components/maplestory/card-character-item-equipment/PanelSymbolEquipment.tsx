import { CharacterInfo } from '~/types'
import { useMemo } from 'react'

export const PanelSymbolEquipment = ({
  character,
}: {
  character: CharacterInfo,
}) => {
  const symbols = useMemo(() => {
    return character.symbolEquipment.symbol
  }, [character.symbolEquipment])

  return symbols && <div className="panel-symbol-equipment">
    {symbols.map((symbol, idx) => <div key={idx} className="symbol">
      <img className="symbol-icon" src={symbol.symbol_icon} alt={symbol.symbol_name} />
      <div className="symbol-level">{symbol.symbol_level}</div>
    </div>)}
  </div>
}