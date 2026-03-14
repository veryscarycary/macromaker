// design/tokens/typography.ts
// Inter font family names (match TTF filename = PostScript name for Inter v4.1)
// Each weight is a distinct fontFamily string — do NOT use fontWeight alongside these.

export const fontFamilies = {
  regular:  'Inter-Regular',
  medium:   'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold:     'Inter-Bold',
} as const;

export const typeScale = {
  display:    { fontFamily: fontFamilies.bold,     fontSize: 34, lineHeight: 41 },
  heading:    { fontFamily: fontFamilies.bold,     fontSize: 28, lineHeight: 34 },
  subheading: { fontFamily: fontFamilies.semiBold, fontSize: 22, lineHeight: 28 },
  body:       { fontFamily: fontFamilies.regular,  fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: fontFamilies.medium,   fontSize: 16, lineHeight: 24 },
  bodySmall:  { fontFamily: fontFamilies.regular,  fontSize: 14, lineHeight: 20 },
  caption:    { fontFamily: fontFamilies.regular,  fontSize: 12, lineHeight: 16 },
  label:      { fontFamily: fontFamilies.medium,   fontSize: 12, lineHeight: 16 },
  overline:   {
    fontFamily:    fontFamilies.medium,
    fontSize:      10,
    lineHeight:    14,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TypeScaleKey = keyof typeof typeScale;
export type TypeScale = typeof typeScale;
