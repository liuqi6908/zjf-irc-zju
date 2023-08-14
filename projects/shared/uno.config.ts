import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['full', 'w-full h-full'],
    ['flex-center', 'flex items-center justify-center'],
    ['hTitle-4', 'font-600 text-5'],
    ['subTitle-1', 'font-600 text-4 text-grey-8']
  ],
  rules: [
    // [/^h-([\.\d]+)$/, ([_, num]) => ({ height: `${num+1}rem` })],
    // [/^text-h(\d+)$/, ([_, size]) => ({
    //   fontSize: `${32 - (size - 1) * 4}px`
    // })],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      autoInstall: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose m-auto text-left'.split(' '),
  theme: {
    colors: {
      primary: { 1: '#025CB9', 2: '#0057B2', 3: '#D1E8FD' },
      grey: { 1: '#FFFFFF', 2: '#F5F7FA', 3: '#D4DDEA', 4: '#A6B1C2', 5: '#6E7686', 6: '#575E6A', 7: '#373C48', 8: '#292D36' },
      alert: { success: '#22B07D', error: '#F44336', warning: '#FFBA2F' },
      opacity: { primary: 'rgba(48, 123, 246, 0.12)' }
    },
    breakpoints: {
      'xs': '320px',
      'sm': '640px',
      'lg': '1024px',
      'xl': '1280px',
    },
    round:{
      btn:'8px',
      card:'12px'
    }
  },
})
