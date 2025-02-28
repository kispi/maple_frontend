import { ReactElement } from 'react'
import './badge-glass.scss'

const BadgeGlass = ({ children, className }: { children: ReactElement | string, className?: string }) => {
  return <div className={`badge-glass ${className || ''}`}>
    <div className="badge-glass-overlay" />
    {children}
  </div>
}

export default BadgeGlass