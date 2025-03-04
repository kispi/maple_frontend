import { Tooltip } from '~/types'
import { useEffect, useRef, useState } from 'react'
import helpers from '~/helpers'

const AppTooltip = ({ tooltip }: { tooltip: Tooltip }) => {
  const [finalStyle, setFinalStyle] = useState({})

  const [trianglePosition, setTrianglePosition] = useState({})

  const refAppTooltip = useRef(null)

  const init = () => {
    const dom = tooltip.showAbove
    if (!dom || !refAppTooltip.current) return
  
    const rectShowAbove = dom.getBoundingClientRect()
    const rectAppTooltip = (refAppTooltip.current as HTMLElement).getBoundingClientRect()

    const tooltipStyle = {} as Record<string, string>
    const triangleStyle = {} as Record<string, string>
  
    if (tooltip.below) {
      tooltipStyle.top = `calc(${rectShowAbove.top + rectShowAbove.height + 8}px)` // trianglge height 8px
    } else {
      tooltipStyle.top = `calc(${rectShowAbove.top - rectAppTooltip.height - 8}px)` // trianglge height 8px
    }
  
    const distanceHor = window.innerWidth - rectShowAbove.left
    if (window.innerWidth < rectShowAbove.left + rectAppTooltip.width) {
      tooltipStyle.left = `${window.innerWidth - rectAppTooltip.width}px`
      triangleStyle.left = 'initial'
      triangleStyle.transform = 'initial'
      triangleStyle.right = `${distanceHor - rectShowAbove.width / 2 - (tooltip.below ? 16 : 8)}px`
    } else {
      const left = rectShowAbove.left - rectAppTooltip.width / 2 + rectShowAbove.width / 2
      tooltipStyle.left = left < 0 ? '0' : `${left}px`
      if (left < 0) {
        triangleStyle.left = `${rectShowAbove.left + rectShowAbove.width / 2}px`
      }
    }

    setFinalStyle(tooltipStyle)
    setTrianglePosition(triangleStyle)
  }

  useEffect(init, [])

  return <div
    ref={refAppTooltip}
    className={`app-tooltip ${tooltip.below ? 'below' : ''} ${tooltip.useCloser ? 'use-closer' : ''} ${tooltip.fit ? 'fit' : ''}`}
    style={finalStyle}>
    <div
      dangerouslySetInnerHTML={{ __html: helpers.$t(tooltip.text) }}
      className="tooltip-body"
    />
    <div className="triangle" style={trianglePosition} />
  </div>
}

export default AppTooltip