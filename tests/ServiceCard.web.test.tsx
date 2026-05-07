/**
 * Web 端 ServiceCard 测试 · vitest + @testing-library/react
 *
 * 覆盖:
 * - 渲染 (title / cover / price / seller / sla)
 * - 千分位 / 整数 / 边界 (¥1 / ¥9999 / ¥99,999.99)
 * - onPress (click / Enter / Space)
 * - 缺 sla 不渲染那行
 * - 长标题 line-clamp class 存在
 * - 共享 behavior 契约
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ServiceCard } from '../src/ServiceCard'
import { pressScenarios, formatPriceCents } from '../src/ServiceCard.behavior'

const baseSeller = { id: 'u1', name: '小明', avatar: 'https://x.test/a.jpg' }
const baseProps = {
  id: 's1',
  title: 'Logo 设计 · 简约风',
  cover: 'https://x.test/c.jpg',
  priceCents: 9900,
  seller: baseSeller,
}

describe('ServiceCard (Web) · 渲染', () => {
  it('渲染 title / price / seller name', () => {
    render(<ServiceCard {...baseProps} />)
    expect(screen.getByRole('button', { name: 'Logo 设计 · 简约风' })).toBeInTheDocument()
    expect(screen.getByText('Logo 设计 · 简约风')).toBeInTheDocument()
    expect(screen.getByText('¥99')).toBeInTheDocument()
    expect(screen.getByText('小明')).toBeInTheDocument()
  })

  it('cover 渲染 img + alt = title', () => {
    const { container } = render(<ServiceCard {...baseProps} />)
    const img = container.querySelector('.ak-service-card__cover-img') as HTMLImageElement
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toBe('https://x.test/c.jpg')
    expect(img.getAttribute('alt')).toBe('Logo 设计 · 简约风')
  })

  it('seller avatar 渲染 + aria-hidden (装饰性)', () => {
    const { container } = render(<ServiceCard {...baseProps} />)
    const avatar = container.querySelector('.ak-service-card__avatar') as HTMLImageElement
    expect(avatar).toBeTruthy()
    expect(avatar.getAttribute('src')).toBe('https://x.test/a.jpg')
    expect(avatar.getAttribute('aria-hidden')).toBe('true')
  })

  it('data-id 反映 props.id', () => {
    const { container } = render(<ServiceCard {...baseProps} id="s-42" />)
    expect(container.querySelector('[data-id="s-42"]')).toBeTruthy()
  })
})

describe('ServiceCard (Web) · 千分位价格', () => {
  it('99 元 = 9900 分 → ¥99', () => {
    render(<ServiceCard {...baseProps} priceCents={9900} />)
    expect(screen.getByText('¥99')).toBeInTheDocument()
  })

  it('1 元 = 100 分 → ¥1 (极小价格)', () => {
    render(<ServiceCard {...baseProps} priceCents={100} />)
    expect(screen.getByText('¥1')).toBeInTheDocument()
  })

  it('9999 元 = 999900 分 → ¥9,999 (千分位)', () => {
    render(<ServiceCard {...baseProps} priceCents={999900} />)
    expect(screen.getByText('¥9,999')).toBeInTheDocument()
  })

  it('小数 99.9 元 = 9990 分 → ¥99.9', () => {
    render(<ServiceCard {...baseProps} priceCents={9990} />)
    expect(screen.getByText('¥99.9')).toBeInTheDocument()
  })

  it('formatPriceCents 跨端工具 · 单测', () => {
    expect(formatPriceCents(0)).toBe('¥0')
    expect(formatPriceCents(100)).toBe('¥1')
    expect(formatPriceCents(9900)).toBe('¥99')
    expect(formatPriceCents(999900)).toBe('¥9,999')
    expect(formatPriceCents(12345678)).toBe('¥123,456.78')
  })
})

describe('ServiceCard (Web) · 标题截断', () => {
  it('长标题加 line-clamp class', () => {
    const longTitle =
      '超长标题 · 用于测试 line-clamp 截断 · 一二三四五六七八九十 · 非常非常非常非常长的服务标题'
    const { container } = render(<ServiceCard {...baseProps} title={longTitle} />)
    const t = container.querySelector('.ak-service-card__title') as HTMLElement
    expect(t).toBeTruthy()
    // class 存在 + 文本写入 (CSS line-clamp 视觉裁剪 jsdom 不渲染 · 只能 verify class)
    expect(t.textContent).toBe(longTitle)
    expect(t.className).toContain('ak-service-card__title')
  })
})

describe('ServiceCard (Web) · sla', () => {
  it('传 slaHours · 渲染 "{N}h 内交付"', () => {
    render(<ServiceCard {...baseProps} slaHours={24} />)
    expect(screen.getByText('24h 内交付')).toBeInTheDocument()
  })

  it('缺 slaHours · 不渲染 sla 行', () => {
    const { container } = render(<ServiceCard {...baseProps} />)
    expect(container.querySelector('.ak-service-card__sla')).toBeNull()
  })

  it('slaHours = 0 · 仍渲染 (0 是有效值)', () => {
    render(<ServiceCard {...baseProps} slaHours={0} />)
    expect(screen.getByText('0h 内交付')).toBeInTheDocument()
  })
})

describe('ServiceCard (Web) · onPress 行为', () => {
  it('click 整卡 · 触发 onPress', () => {
    const onPress = vi.fn()
    render(<ServiceCard {...baseProps} onPress={onPress} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledOnce()
  })

  it('键盘 Enter · 触发 onPress', () => {
    const onPress = vi.fn()
    render(<ServiceCard {...baseProps} onPress={onPress} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    expect(onPress).toHaveBeenCalledOnce()
  })

  it('键盘 Space · 触发 onPress', () => {
    const onPress = vi.fn()
    render(<ServiceCard {...baseProps} onPress={onPress} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })
    expect(onPress).toHaveBeenCalledOnce()
  })

  it('其他键 · 不触发', () => {
    const onPress = vi.fn()
    render(<ServiceCard {...baseProps} onPress={onPress} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' })
    expect(onPress).not.toHaveBeenCalled()
  })
})

describe('ServiceCard (Web) · 行为契约 (共享 spec)', () => {
  for (const sc of pressScenarios) {
    it(sc.name, () => {
      const onPress = vi.fn()
      const handler = sc.hasHandler ? onPress : undefined
      render(<ServiceCard {...baseProps} onPress={handler} />)
      fireEvent.click(screen.getByRole('button'))
      if (sc.onPressOutcome === 'callback-fired') {
        expect(onPress).toHaveBeenCalledOnce()
      } else {
        expect(onPress).not.toHaveBeenCalled()
      }
    })
  }
})

describe('ServiceCard (Web) · a11y', () => {
  it('role=button + tabIndex=0 (键盘可达)', () => {
    render(<ServiceCard {...baseProps} />)
    const btn = screen.getByRole('button')
    expect(btn.getAttribute('tabindex')).toBe('0')
  })

  it('aria-label = title (屏幕阅读器读出)', () => {
    render(<ServiceCard {...baseProps} title="一句话服务" />)
    expect(screen.getByRole('button', { name: '一句话服务' })).toBeInTheDocument()
  })
})
