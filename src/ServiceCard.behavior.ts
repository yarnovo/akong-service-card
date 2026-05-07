/**
 * 跨端行为契约 · Web + RN 都遵循
 *
 * 写法是"给定 props · 期望 · 该发生 / 不该发生"的纯描述
 * 各端测试 import 这份 spec 跑 · 行为强一致
 */

export type Outcome = 'callback-fired' | 'callback-skipped'

export interface PressScenario {
  name: string
  /** 模拟一次"按下" · 期望结果 */
  onPressOutcome: Outcome
  /** 是否传 onPress · false = 不传 callback (按下也不该崩) */
  hasHandler: boolean
}

/** 共享场景 · Web + RN 都跑 */
export const pressScenarios: PressScenario[] = [
  {
    name: 'default · 按下触发 onPress',
    hasHandler: true,
    onPressOutcome: 'callback-fired',
  },
  {
    name: '没传 onPress · 按下不崩 (no-op)',
    hasHandler: false,
    onPressOutcome: 'callback-skipped',
  },
]

/** 价格千分位格式化 · zh-CN locale · 单位分 */
export function formatPriceCents(cents: number): string {
  const yuan = cents / 100
  // Intl 不会带 ¥ 前缀本身 (currency 形式) · 我们手动拼以保证简洁
  const formatted = new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(yuan)
  return `¥${formatted}`
}
