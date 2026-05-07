import type { ServiceCardProps } from './ServiceCard.types'
import { formatPriceCents } from './ServiceCard.behavior'
import './ServiceCard.css'

/** akong ServiceCard · Web · 整卡 click · `<div role="button">` */
export function ServiceCard(props: ServiceCardProps) {
  const { id, title, cover, priceCents, seller, slaHours, onPress } = props

  const handle = () => {
    onPress?.()
  }

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onPress?.()
    }
  }

  return (
    <div
      data-id={id}
      role="button"
      tabIndex={0}
      aria-label={title}
      onClick={handle}
      onKeyDown={handleKey}
      className="ak-service-card"
    >
      <div className="ak-service-card__cover">
        <img className="ak-service-card__cover-img" src={cover} alt={title} loading="lazy" />
      </div>
      <div className="ak-service-card__body">
        <h3 className="ak-service-card__title">{title}</h3>
        <p className="ak-service-card__price">{formatPriceCents(priceCents)}</p>
        <div className="ak-service-card__seller">
          <img
            className="ak-service-card__avatar"
            src={seller.avatar}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
          <span className="ak-service-card__seller-name">{seller.name}</span>
        </div>
        {typeof slaHours === 'number' && (
          <p className="ak-service-card__sla">{slaHours}h 内交付</p>
        )}
      </div>
    </div>
  )
}

export default ServiceCard
