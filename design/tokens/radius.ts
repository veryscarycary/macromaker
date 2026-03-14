// design/tokens/radius.ts
// 4-level border radius constants for consistent corner rounding.

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
} as const;

export type Radius = typeof radius;
