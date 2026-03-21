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
  mist:      '#edeef2',
  velasaru:  '#0bc7c7',
  dustyRose: '#bb51a9',
  teal:      '#044e6a',
  blueMoon:  '#012353',
  blueMoonDark: '#011a3d',
  red500:    '#ef4444',
  white:     '#ffffff',
  black:     '#000000',
} as const;

export const colors = {
  brand: {
    primary:      palette.blueMoon,
    primaryDark:  palette.blueMoonDark,
    primaryLight: palette.teal,
  },
  neutral: {
    50:  palette.white,
    100: palette.mist,
    200: palette.slate200,
    300: palette.slate300,
    400: palette.slate400,
    500: palette.slate500,
    600: palette.slate600,
    700: palette.slate700,
    800: palette.slate800,
    900: palette.blueMoon,
  },
  accent: {
    aqua: palette.velasaru,
    rose: palette.dustyRose,
    teal: palette.teal,
  },
  surface: {
    default: palette.white,
    subtle:  palette.mist,
    muted:   palette.mist,
    border:  palette.slate200,
  },
  text: {
    primary:   palette.blueMoon,
    secondary: palette.slate600,
    tertiary:  palette.slate400,
    inverse:   palette.white,
  },
  macro: {
    carbs:   palette.velasaru,
    protein: palette.dustyRose,
    fat:     palette.teal,
  },
  status: {
    error: palette.red500,
  },
} as const;

export type Colors = typeof colors;
