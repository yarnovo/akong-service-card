/**
 * akong ServiceCard · 跨端 props (Web + React Native 共享)
 *
 * 用途: C2A2C 平台市集页商品卡 · 显示服务图 + 标题 + 价格 + 卖家
 */

export interface ServiceCardSeller {
  id: string
  name: string
  avatar: string
}

export interface ServiceCardProps {
  /** 服务唯一 id (路由 / 上报) */
  id: string
  /** 标题 (line-clamp-2) */
  title: string
  /** 封面图 url (aspect-square) */
  cover: string
  /** 价格 · 分单位 (99 元 = 9900) */
  priceCents: number
  /** 卖家信息 */
  seller: ServiceCardSeller
  /** 交付时间 (h) · 缺省不渲染 */
  slaHours?: number
  /** 整卡点击 · Web 用 onClick / RN 用 onPress · 都映射到这一回调 */
  onPress?: () => void
}
