import { describe, expect, it } from 'vitest'

/**
 * The retro theme lives in exactly one place: `src/styles/theme.css`.
 *
 * Components carry semantic classes (`.card`, `.btn`, `.stat`, `.table` …) plus
 * layout utilities, and never a raw colour or typography utility. Without this
 * guard the palette leaks back into every component and a theme change turns into
 * a repo-wide hunt again — which is the thing this test exists to prevent.
 */
const RAW_COLOUR =
  /\b(?:bg|text|border|ring|fill|stroke|divide|shadow|outline|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(?:-\d{2,3})?\b/g
const RAW_SHAPE =
  /\b(?:rounded|tracking|leading)-(?:none|sm|md|lg|xl|2xl|3xl|full|tight|normal|wide|wider|tighter)\b/g
const RAW_TYPE =
  /\b(?:font|text)-(?:display|sans|serif|mono|bold|semibold|medium|black|light|thin|xs|sm|base|lg|xl|2xl|3xl|4xl)\b/g

/** Every file that renders UI: the app shell plus each component. */
const uiFiles = import.meta.glob('../{App.tsx,components/*.tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

describe('theme discipline', () => {
  it('has UI files to check', () => {
    expect(Object.keys(uiFiles).length).toBeGreaterThan(5)
  })

  it('keeps raw colour, shape and typography utilities out of the UI', () => {
    const offenders: string[] = []

    for (const [file, source] of Object.entries(uiFiles)) {
      for (const pattern of [RAW_COLOUR, RAW_SHAPE, RAW_TYPE]) {
        for (const match of source.matchAll(pattern)) {
          const line = source.slice(0, match.index).split('\n').length
          offenders.push(`${file.replace('../', 'src/')}:${line} → ${match[0]}`)
        }
      }
    }

    expect(offenders).toEqual([])
  })
})
