// design/tokens/colors.ts
// Two-layer color token system: primitive palette (internal) + semantic layer (exported)
// Semantic layer is what components import — never reference palette directly in components.

const palette = {
  slate50:  '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  purple300: '#a5a8f0',
  purple400: '#9198e5',
  purple500: '#7078df',
  purple600: '#5a62ca',
  purple700: '#4650b8',
  blue400:   '#60a5fa',
  violet400: '#a78bfa',
  amber400:  '#fbbf24',
  white:     '#ffffff',
  black:     '#000000',
} as const;

export const colors = {
  brand: {
    primary:      palette.purple500,
    primaryDark:  palette.purple600,
    primaryLight: palette.purple400,
  },
  surface: {
    default: palette.white,
    subtle:  palette.slate50,
    muted:   palette.slate100,
    border:  palette.slate200,
  },
  text: {
    primary:   palette.slate900,
    secondary: palette.slate600,
    tertiary:  palette.slate400,
    inverse:   palette.white,
  },
  macro: {
    carbs:   palette.blue400,
    protein: palette.violet400,
    fat:     palette.amber400,
  },
} as const;

export type Colors = typeof colors;
