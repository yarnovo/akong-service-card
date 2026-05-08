# @akong/service-card

> ← 回 [akong design system](https://yarnovo.github.io/akong-core/) 总站

akong ServiceCard · C2A2C 平台市集页商品卡 · 跨端 (Web + React Native)

显示服务图 + 标题 + 价格 + 卖家 + (可选) 交付时间。

## Demo

[GitHub Pages 演示](https://yarnovo.github.io/akong-service-card/)

## 安装

```bash
npm i github:yarnovo/akong-service-card github:yarnovo/akong-tokens
```

## Web

```tsx
import { ServiceCard } from '@akong/service-card'
import '@akong/service-card/style.css'
import '@akong/tokens/style.css'  // 顶层引一次 token (整个 app 共用)

<ServiceCard
  id="s-1"
  title="Logo 设计 · 简约风"
  cover="https://example.com/cover.jpg"
  priceCents={9900}
  seller={{ id: 'u-1', name: '小明', avatar: 'https://example.com/a.jpg' }}
  slaHours={24}
  onPress={() => router.push('/service/s-1')}
/>
```

## React Native

```tsx
import { ServiceCard } from '@akong/service-card'

<ServiceCard
  id="s-1"
  title="Logo 设计 · 简约风"
  cover="https://example.com/cover.jpg"
  priceCents={9900}
  seller={{ id: 'u-1', name: '小明', avatar: 'https://example.com/a.jpg' }}
  slaHours={24}
  onPress={() => navigation.navigate('Service', { id: 's-1' })}
/>
```

Metro bundler 自动按 `.native.tsx` 后缀解析 · 同 `import` 路径两端通用。

## API

| Prop | Type | Required | 说明 |
|---|---|---|---|
| id | string | ✓ | 服务唯一 id (路由 / 上报) |
| title | string | ✓ | 标题 · 自动 line-clamp-2 |
| cover | string | ✓ | 封面图 url · aspect-square + object-cover |
| priceCents | number | ✓ | 价格 · 分单位 (99 元 = 9900) |
| seller | `{ id, name, avatar }` | ✓ | 卖家 |
| slaHours | number | — | 交付时间 (h) · 缺省不渲染 |
| onPress | `() => void` | — | 整卡点击 · Web 用 onClick / RN 用 onPress · 都映射到 onPress |

## 设计原则

- **一份 props**：Web 跟 RN 共享 `ServiceCard.types.ts` + `formatPriceCents` 工具
- **两端实现**：`ServiceCard.tsx` (Web · `<div role="button">` 整卡 click) + `ServiceCard.native.tsx` (RN · `<Pressable>` + `<Image>`)
- **无 border + 圆角 lg**：背景靠 token (`--ak-bg`) 跟容器区分
- **价格 tabular-nums**：千分位对齐 · 用 Intl.NumberFormat('zh-CN')
- **a11y**：role=button + tabIndex=0 + Enter/Space 可达 + aria-label = title · 头像 aria-hidden (装饰性)
- **token 100% 接 @akong/tokens**：改一处 token 自动 update

## 视觉规范

| 元素 | 规则 |
|---|---|
| 整卡 | `border-radius: --ak-radius-lg` · 无 border · `--ak-bg` |
| cover | `aspect-square` · `object-cover` · placeholder `--ak-bg-subtle` |
| 标题 | `text-sm` · `weight-medium` · `line-clamp-2` |
| 价格 | `text-lg` · `weight-semibold` · `tracking-tight` · `¥` 前缀 + 千分位 |
| 卖家头像 | 14×14 圆形 · `--ak-bg-subtle` placeholder |
| 卖家名字 | `text-xs` · `--ak-fg-subtle` · truncate |
| sla | 10px · `--ak-fg-subtle` · `{N}h 内交付` (缺 slaHours 不渲染) |
| 按下 | opacity 0.8 (Web `:active` / RN `pressed`) |

## 价格格式化

价格用分单位传 (`priceCents`) · 内部 `formatPriceCents` 统一处理:

```ts
formatPriceCents(0)        // '¥0'
formatPriceCents(100)      // '¥1'
formatPriceCents(9900)     // '¥99'
formatPriceCents(999900)   // '¥9,999'
formatPriceCents(12345678) // '¥123,456.78'
```
