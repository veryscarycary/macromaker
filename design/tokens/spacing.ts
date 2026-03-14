// design/tokens/spacing.ts
// 8pt grid spacing constants. Use these for all padding, margin, and gap values.

export const spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

export type Spacing = typeof spacing;
