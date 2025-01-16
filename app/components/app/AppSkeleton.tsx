const AppSkeleton = ({
  style,
  className,
}: {
  style?: React.CSSProperties,
  className?: string,
}) => <div className={`app-skeleton ${className}`} style={style}>
  <div className="container"><div className="bar"/></div>
</div>

export default AppSkeleton