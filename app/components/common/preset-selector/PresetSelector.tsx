import React from 'react'
import './PresetSelector.scss'

interface PresetSelectorProps {
  currentPreset: number | string
  onSelect: (no: any) => void
  presets?: (number | string)[]
  className?: string
  showLabel?: boolean
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPreset,
  onSelect,
  presets = [1, 2, 3],
  className = '',
  showLabel = true,
}) => {
  return (
    <div className={`preset-selector ${className}`}>
      {showLabel && <span className="label">PRESETS</span>}
      {presets.map((no) => (
        <div
          key={no}
          onClick={() => onSelect(no)}
          className={`no ${String(currentPreset) === String(no) ? 'selected' : ''}`}
        >
          {no}
        </div>
      ))}
    </div>
  )
}
