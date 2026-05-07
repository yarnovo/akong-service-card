import type { ServiceCardProps } from './ServiceCard.types'
import './ServiceCard.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** akong ServiceCard · Web · DOM `<button>` */
export function ServiceCard(props: ServiceCardProps) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    children,
    onClick,
    onPress,
    type = 'button',
    ariaLabel,
  } = props

  const handle = () => {
    if (disabled || loading) return
    onClick?.()
    onPress?.()
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handle}
      className={cls(
        'ak-service-card',
        `ak-service-card--${variant}`,
        `ak-service-card--${size}`,
        fullWidth && 'ak-service-card--full-width',
        loading && 'ak-service-card--loading',
      )}
    >
      {iconLeft && <span className="ak-service-card__icon">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {iconRight && <span className="ak-service-card__icon">{iconRight}</span>}
    </button>
  )
}

export default ServiceCard
