/**
 * akong ServiceCard · React Native 实现
 *
 * Metro bundler 默认按 `.native.tsx` 后缀解析 RN 端 · `.tsx` 解析 Web 端
 * 用方 `import { ServiceCard } from '@aily-ui/service-card'` 自动取对应平台
 */

import { Pressable, Text, View, Image, useColorScheme } from 'react-native'
import { tokens } from '@aily-ui/tokens'
import type { ServiceCardProps } from './ServiceCard.types'
import { formatPriceCents } from './ServiceCard.behavior'

export function ServiceCard(props: ServiceCardProps) {
  const { title, cover, priceCents, seller, slaHours, onPress } = props

  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark'
  const t = scheme === 'dark' ? tokens.dark : tokens.light

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={title}
      accessibilityRole="button"
      style={({ pressed }: { pressed: boolean }) => ({
        backgroundColor: t.bg,
        borderRadius: tokens.radius.lg,
        overflow: 'hidden' as const,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          width: '100%',
          aspectRatio: 1,
          backgroundColor: t.bgSubtle,
          borderRadius: tokens.radius.lg,
          overflow: 'hidden',
        }}
      >
        <Image
          source={{ uri: cover }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          accessibilityLabel={title}
        />
      </View>

      <View
        style={{
          paddingHorizontal: tokens.space[1],
          paddingTop: tokens.space[2],
          paddingBottom: tokens.space[1],
          gap: tokens.space[1],
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            color: t.fg,
            fontSize: tokens.text.sm,
            fontWeight: tokens.weight.medium,
            lineHeight: tokens.text.sm * tokens.leading.snug,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: t.fg,
            fontSize: tokens.text.lg,
            fontWeight: tokens.weight.semibold,
            // RN 没 letter-spacing token · 用 px (-0.2 视觉接近 tracking-tight)
            letterSpacing: -0.2,
          }}
        >
          {formatPriceCents(priceCents)}
        </Text>

        <View
          style={{
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            gap: tokens.space[2],
          }}
        >
          <Image
            source={{ uri: seller.avatar }}
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: t.bgSubtle,
            }}
            resizeMode="cover"
            accessibilityLabel=""
          />
          <Text
            numberOfLines={1}
            style={{
              color: t.fgSubtle,
              fontSize: tokens.text.xs,
              flexShrink: 1,
            }}
          >
            {seller.name}
          </Text>
        </View>

        {typeof slaHours === 'number' && (
          <Text
            style={{
              color: t.fgSubtle,
              fontSize: 10,
              lineHeight: 13,
            }}
          >
            {slaHours}h 内交付
          </Text>
        )}
      </View>
    </Pressable>
  )
}

export default ServiceCard
