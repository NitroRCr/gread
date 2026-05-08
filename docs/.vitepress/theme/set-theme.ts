import { CorePalette, Hct, hexFromArgb, rgbaFromArgb } from '@material/material-color-utilities'
import { inBrowser, useData } from 'vitepress'
import type { MaybeRef } from 'vue'
import { unref, watchEffect } from 'vue'

function hexFromHct(h: number, c: number, t: number) {
  return hexFromArgb(Hct.from(h, c, t).toInt())
}

export function useSetTheme(hue: MaybeRef<number>) {
  if (!inBrowser) return
  const { isDark } = useData()
  watchEffect(() => {
    const h = unref(hue)
    const palette = CorePalette.contentOf(Hct.from(h, 48, 40).toInt())
    const primary = palette.a1
    const neutral = palette.n1
    const colors = isDark.value
      ? {
          'c-brand-1': primary.tone(80),
          'c-brand-2': primary.tone(80),
          'c-brand-3': primary.tone(75),
          'c-brand-soft': hexFromArgb(primary.tone(80)) + '24',
          'c-gray-1': neutral.tone(24),
          'c-gray-2': neutral.tone(17),
          'c-gray-3': neutral.tone(12),
          'c-gray-soft': hexFromArgb(neutral.tone(50)) + '24',
          'c-text-1': neutral.tone(90),
          'c-text-2': neutral.tone(75),
          'c-text-3': neutral.tone(50),
          'c-bg': neutral.tone(6),
          'c-bg-alt': neutral.tone(12),
          'c-bg-elv': neutral.tone(10),
          'c-bg-soft': neutral.tone(12),
          'button-brand-text': primary.tone(20),
          'button-brand-hover-text': primary.tone(20),
          'button-brand-active-text': primary.tone(20),
          'home-hero-name-background': `linear-gradient(120deg, ${hexFromHct(h - 45, 48, 75)} 30%, ${hexFromHct(h + 45, 48, 75)})`,
        }
      : {
          'c-brand-1': primary.tone(40),
          'c-brand-2': primary.tone(40),
          'c-brand-3': primary.tone(45),
          'c-brand-soft': hexFromArgb(primary.tone(40)) + '24',
          'c-gray-1': neutral.tone(90),
          'c-gray-2': neutral.tone(92),
          'c-gray-3': neutral.tone(94),
          'c-gray-soft': hexFromArgb(neutral.tone(50)) + '24',
          'c-text-1': neutral.tone(20),
          'c-text-2': neutral.tone(35),
          'c-text-3': neutral.tone(50),
          'c-bg': neutral.tone(98),
          'c-bg-alt': neutral.tone(94),
          'c-bg-elv': neutral.tone(96),
          'c-bg-soft': neutral.tone(94),
          'button-brand-text': primary.tone(98),
          'button-brand-hover-text': primary.tone(98),
          'button-brand-active-text': primary.tone(98),
          'home-hero-name-background': `linear-gradient(120deg, ${hexFromHct(h - 45, 48, 45)} 30%, ${hexFromHct(h + 45, 48, 45)})`,
        }
    rgbaFromArgb
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--vp-${key}`, typeof value === 'number' ? hexFromArgb(value) : value)
    })
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', hexFromArgb(colors['c-bg-soft']))
  })
}
