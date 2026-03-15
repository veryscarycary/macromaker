// design/theme/paperTheme.ts
// Brand tokens wired into react-native-paper MD3 theme.
// All values sourced from design/tokens — no hardcoded hex or font strings here.
import { MD3LightTheme, configureFonts } from 'react-native-paper';

import { colors, fontFamilies } from '../tokens';

const paperFonts = configureFonts({
  config: {
    displayLarge:   { fontFamily: fontFamilies.bold,     fontWeight: undefined },
    displayMedium:  { fontFamily: fontFamilies.bold,     fontWeight: undefined },
    displaySmall:   { fontFamily: fontFamilies.bold,     fontWeight: undefined },
    headlineLarge:  { fontFamily: fontFamilies.bold,     fontWeight: undefined },
    headlineMedium: { fontFamily: fontFamilies.semiBold, fontWeight: undefined },
    headlineSmall:  { fontFamily: fontFamilies.semiBold, fontWeight: undefined },
    titleLarge:     { fontFamily: fontFamilies.semiBold, fontWeight: undefined },
    titleMedium:    { fontFamily: fontFamilies.medium,   fontWeight: undefined },
    titleSmall:     { fontFamily: fontFamilies.medium,   fontWeight: undefined },
    labelLarge:     { fontFamily: fontFamilies.medium,   fontWeight: undefined },
    labelMedium:    { fontFamily: fontFamilies.medium,   fontWeight: undefined },
    labelSmall:     { fontFamily: fontFamilies.medium,   fontWeight: undefined },
    bodyLarge:      { fontFamily: fontFamilies.regular,  fontWeight: undefined },
    bodyMedium:     { fontFamily: fontFamilies.regular,  fontWeight: undefined },
    bodySmall:      { fontFamily: fontFamilies.regular,  fontWeight: undefined },
    default:        { fontFamily: fontFamilies.regular,  fontWeight: undefined },
  },
});

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary:          colors.brand.primary,
    onPrimary:        colors.text.inverse,
    secondary:        colors.text.secondary,
    onSecondary:      colors.text.inverse,
    surface:          colors.surface.default,
    background:       colors.surface.default,
    onSurface:        colors.text.primary,
    onSurfaceVariant: colors.text.secondary,
    outline:          colors.surface.border,
  },
  fonts: paperFonts,
} satisfies typeof MD3LightTheme;
