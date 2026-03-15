# Phase 6: Paper Theme Integration - Research

**Researched:** 2026-03-14
**Domain:** react-native-paper v5 MD3 theming, `configureFonts`, MD3 color roles
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAPR-01 | `design/theme/paperTheme.ts` built from token imports — brand colors mapped to MD3 color roles | MD3Colors shape verified from Paper types; color role mapping documented below |
| PAPR-02 | `configureFonts` applied with Inter mapped to all MD3 typography variants using separate weight files | configureFonts v3 API and flat-config pattern verified from Paper source; fontWeight must be omitted |
| PAPR-03 | `App.tsx` updated to pass `paperTheme` to `PaperProvider`; existing Paper components visually reflect brand tokens | Current App.tsx pattern identified; PaperProvider already mounted |
</phase_requirements>

---

## Summary

Phase 6 wires the design token system (completed in Phase 5) into react-native-paper v5's `PaperProvider` so existing Paper components (`Searchbar`, `TextInput` in `AddFoodScreen`) render brand colors and Inter typography instead of Paper's Roboto/system-font defaults.

The project already has Paper v5.15.0 installed and `PaperProvider` mounted in `App.tsx`. The current code passes `MD3LightTheme` or `MD3DarkTheme` directly based on `colorScheme`. Phase 6 replaces this with a custom `paperTheme` object in a new file `design/theme/paperTheme.ts`, built entirely from token imports.

The key technical constraint (from STATE.md) is that `fontWeight` must be `undefined` (omitted) when using distinct per-weight Inter font family names — Paper's `MD3Type` shape accepts `fontWeight` as a string, but React Native ignores `fontWeight` when a distinct font file is loaded by name. Setting it would cause silent failures on Android where numeric fontWeight strings do not work with named font families the same way they do on iOS.

**Primary recommendation:** Use `configureFonts` with a flat `config` object (not per-variant) to stamp `Inter-Regular` across all 15 MD3 typescale variants, then spread per-variant overrides for variants that need `Inter-Medium`, `Inter-SemiBold`, or `Inter-Bold`. Spread `MD3LightTheme` as the base and override only `colors` and `fonts` — this preserves Paper's elevation, animation, and roundness defaults.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react-native-paper` | 5.15.0 (installed) | MD3 theme provider and components | Already installed; `PaperProvider` already in `App.tsx` |
| `design/tokens/colors` | local | Brand color source | Token system from Phase 5 |
| `design/tokens/typography` | local | `fontFamilies` (`Inter-Regular`, etc.) | Token system from Phase 5 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `configureFonts` (re-exported from `react-native-paper`) | — | Produces `MD3Typescale` object | Required to pass type-safe fonts to `MD3Theme` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `configureFonts` flat config | Per-variant config object | Per-variant is more verbose; flat + overrides is cleaner for this use case |
| Spreading `MD3LightTheme` as base | Building full theme from scratch | Scratch build would omit elevation colors, animation, roundness — spread is safer |

**No new installation required.** All dependencies are already present.

## Architecture Patterns

### Recommended Project Structure
```
design/
├── tokens/          # Phase 5 — existing
│   ├── colors.ts
│   ├── typography.ts
│   └── index.ts
└── theme/           # Phase 6 — new directory
    └── paperTheme.ts
```

### Pattern 1: Paper Theme File Built from Token Imports

**What:** `design/theme/paperTheme.ts` spreads `MD3LightTheme` as base, overrides `colors` with brand token values mapped to MD3 color roles, and overrides `fonts` with `configureFonts` output.

**When to use:** Always. This is the single source of truth for the Paper theme.

**MD3Colors shape (verified from `node_modules/react-native-paper/lib/typescript/types.d.ts`):**
```typescript
// The complete set of required MD3 color roles:
type MD3Colors = {
  primary: string;
  primaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  tertiary: string;
  tertiaryContainer: string;
  surface: string;
  surfaceVariant: string;
  surfaceDisabled: string;      // rgba string
  background: string;
  error: string;
  errorContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
  onTertiary: string;
  onTertiaryContainer: string;
  onSurface: string;
  onSurfaceVariant: string;
  onSurfaceDisabled: string;    // rgba string
  onError: string;
  onErrorContainer: string;
  onBackground: string;
  outline: string;
  outlineVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  shadow: string;
  scrim: string;
  backdrop: string;
  elevation: MD3ElevationColors; // { level0..level5 }
}
```

**Brand token → MD3 color role mapping (for Phase 6 scope):**

| MD3 Role | Token Value | Rationale |
|----------|-------------|-----------|
| `primary` | `colors.brand.primary` (`#f97316`, orange500) | CTA, active states, Searchbar active indicator |
| `onPrimary` | `colors.text.inverse` (`#ffffff`) | Text/icon on primary-colored surfaces |
| `secondary` | `colors.text.secondary` (`#475569`, slate600) | Secondary actions |
| `onSecondary` | `colors.text.inverse` | Text on secondary |
| `surface` | `colors.surface.default` (`#ffffff`) | Card/input backgrounds |
| `background` | `colors.surface.default` | Screen background |
| `onSurface` | `colors.text.primary` (`#0f172a`, slate900) | Body text on surfaces |
| `onSurfaceVariant` | `colors.text.secondary` | Secondary text, input labels |
| `outline` | `colors.surface.border` (`#e2e8f0`, slate200) | Input borders, dividers |

All other MD3 roles not listed above should fall through from `MD3LightTheme` spread (they are not overridden in Phase 6 scope — this is the minimal surface to make Searchbar and TextInput look branded without a full theme rebuild).

**Pattern: Spread base theme, override only what the tokens address:**
```typescript
// design/theme/paperTheme.ts
// Source: Paper v5 docs + verified from lib/module/styles/themes/v3/LightTheme.js
import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { colors, fontFamilies } from '../tokens';

const paperFonts = configureFonts({
  config: {
    // flat config stamps all 15 variants; override per-variant below
    fontFamily: fontFamilies.regular,
    fontWeight: undefined,
    letterSpacing: 0,
  },
  // then per-variant overrides for medium-weight variants:
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
};
```

**CRITICAL configureFonts behavior (verified from `lib/module/styles/fonts.js`):**

The flat-config overload spreads the same partial `MD3Type` across every variant:
```javascript
// From Paper source — flat config path:
if (isFlatConfig) {
  return Object.fromEntries(Object.entries(typescale).map(([variantName, variantProperties]) => [
    variantName,
    { ...variantProperties, ...config }
  ]));
}
```

This means passing `{ fontFamily: 'Inter-Regular', fontWeight: undefined }` as the flat config will override `fontFamily` on all 15 variants but leave `fontSize` and `lineHeight` from Paper's default typescale intact. That is the correct pattern for Phase 6 — we do NOT want to remap sizes.

**fontWeight must be `undefined` (not a string):** When React Native loads a font by PostScript name (e.g., `Inter-Bold`), the OS uses the bold glyphs embedded in that file. Passing `fontWeight: '700'` alongside a named font family causes Android to try to synthesize bold on top of an already-bold face, potentially doubling the weight or silently reverting to system fonts. The STATE.md decision captures this: "fontWeight must be undefined, not a string."

### Pattern 2: Per-Variant Font Override (when different weights are needed)

Because `configureFonts` accepts a per-variant map (verified from `fonts.d.ts` overloads), we can assign different Inter weight files to specific MD3 typescale roles:

```typescript
// Source: fonts.d.ts overload — config?: Partial<Record<MD3TypescaleKey, Partial<MD3Type>>>
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
```

This per-variant approach is more verbose but precisely controls which Inter weight each MD3 typescale role uses. **This is the recommended approach for PAPR-02** because it explicitly maps each variant and leaves no ambiguity about what weight Android will render.

**MD3TypescaleKey enum (verified from `types.d.ts`):**
```
displayLarge, displayMedium, displaySmall,
headlineLarge, headlineMedium, headlineSmall,
titleLarge, titleMedium, titleSmall,
labelLarge, labelMedium, labelSmall,
bodyLarge, bodyMedium, bodySmall
```
Plus `default` (Omit<MD3Type, 'lineHeight' | 'fontSize'>).

### Pattern 3: App.tsx Update

Current `App.tsx` pattern (verified by reading the file):
```typescript
// Current — to be replaced:
const paperTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
```

Replace with:
```typescript
// Phase 6 — import from design/theme/paperTheme
import { paperTheme } from './design/theme/paperTheme';
// Remove colorScheme usage for theme selection (dark mode is v2+ per REQUIREMENTS.md)
// Pass directly:
<PaperProvider theme={paperTheme}>
```

The `useColorScheme` hook can remain if other code uses it, but theme selection no longer reads from it in Phase 6 (dark mode is deferred to v2 per REQUIREMENTS.md Out of Scope table).

### Anti-Patterns to Avoid

- **Hardcoded hex in paperTheme.ts:** Any `'#f97316'` literal in `paperTheme.ts` is a PAPR-01 failure. All values must come from token imports.
- **Setting `fontWeight` as a string alongside named Inter fonts:** Causes Android silent fallback. Always set to `undefined` in the configureFonts config.
- **Building MD3Colors from scratch:** Omitting the `...MD3LightTheme.colors` spread means losing `elevation`, `surfaceDisabled` (rgba), `backdrop`, and other computed colors. These are hard to replicate correctly.
- **Using `MD3DarkTheme` as base for light theme:** The current `App.tsx` picks dark vs light; Phase 6 always uses light (dark mode is deferred).
- **Importing from `react-native-paper/src`:** Always import from the package root (`react-native-paper`). The published build uses `lib/module` or `lib/commonjs`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| MD3 typescale object | Manual 16-entry object literal | `configureFonts({ config: {...} })` | Ensures all 15 `MD3TypescaleKey` variants are covered; TypeScript enforces completeness |
| Color role completeness | Partial colors object | `{ ...MD3LightTheme.colors, ...overrides }` | MD3Colors has 30+ required fields; spread fills the ones not overridden |
| Font variant lookup | `Platform.select` per font | `fontFamilies.*` from token imports | Token already resolves to correct PostScript name for both platforms |

**Key insight:** The existing Paper defaults for elevation, backdrop, error, and semantic "on-" colors are carefully computed. Spreading `MD3LightTheme.colors` and overriding only the brand-relevant roles is dramatically safer than rebuilding the full 30-field object.

## Common Pitfalls

### Pitfall 1: Android Font Fallback — No Error, Wrong Render

**What goes wrong:** Paper component renders in system font (Roboto/sans-serif) on Android instead of Inter. No error is thrown.
**Why it happens:** `fontFamily` string does not exactly match the PostScript name of the installed font. On Android, RN resolves `fontFamily` by exact match against native font name. Even a minor mismatch (e.g., `"Inter Regular"` vs `"Inter-Regular"`) causes silent fallback.
**How to avoid:** Use `fontFamilies.regular` / `.medium` / `.semiBold` / `.bold` from the token file — those strings were verified against PostScript names during Phase 5 font integration.
**Warning signs:** Searchbar placeholder text looks like Roboto on Android; no console error.

### Pitfall 2: fontWeight String Doubles Weights on Android

**What goes wrong:** Text renders heavier than expected, or reverts to system font.
**Why it happens:** Android's font system interprets `fontWeight` as a separate axis from `fontFamily`. Passing `fontWeight: '700'` alongside `fontFamily: 'Inter-Bold'` tells Android to load Inter-Bold AND then apply bold synthesis.
**How to avoid:** Always set `fontWeight: undefined` in the `configureFonts` config map. This is the documented STATE.md project decision.
**Warning signs:** Text looks different from iOS; bold text appears double-bold or reverts to system Roboto-Bold.

### Pitfall 3: `colorScheme` Still Drives Theme Selection

**What goes wrong:** `paperTheme` object is defined but `App.tsx` still conditionally uses `MD3DarkTheme` for dark mode users.
**Why it happens:** The old conditional `colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme` is left partially in place.
**How to avoid:** Replace the theme selection line entirely. The `paperTheme` import always provides the light theme. Dark mode is deferred to v2.
**Warning signs:** On a device with system dark mode enabled, Paper components revert to default Paper palette instead of brand palette.

### Pitfall 4: `design/theme/` Directory Not Created

**What goes wrong:** TypeScript import fails because the directory doesn't exist.
**Why it happens:** `design/tokens/` exists from Phase 5 but `design/theme/` has not been created yet.
**How to avoid:** Create `design/theme/` as the first step. This is a new directory at Phase 6.
**Warning signs:** TS2307 "Cannot find module './design/theme/paperTheme'".

### Pitfall 5: MD3 elevation colors broken by color override

**What goes wrong:** Paper `Surface` components lose their elevation tinting (the subtle background gradient that indicates depth).
**Why it happens:** Paper's `elevation.level1`–`level5` colors are computed using `primary40` from the Material palette. They are strings like `'rgb(247, 243, 249)'`. If you replace `colors.elevation` with a blank object or omit it, surfaces lose depth cues.
**How to avoid:** The `...MD3LightTheme.colors` spread preserves `elevation`. Only override the fields explicitly listed in the brand mapping. Never spread your override with `elevation: {}`.
**Warning signs:** All Paper `Surface` elements look flat with identical white backgrounds regardless of elevation level.

## Code Examples

Verified patterns from official sources:

### configureFonts Per-Variant Call (type-verified)
```typescript
// Source: Paper lib/typescript/styles/fonts.d.ts — overload 4
// configureFonts(params?: {
//   config?: Partial<Record<MD3TypescaleKey, Partial<MD3Type>>>;
//   isV3?: true;
// }): MD3Typescale;

import { configureFonts } from 'react-native-paper';
import { fontFamilies } from '../tokens';

const fonts = configureFonts({
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
```

### paperTheme Construction (full pattern)
```typescript
// design/theme/paperTheme.ts
// No hardcoded color or font values — all from token imports
import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { colors, fontFamilies } from '../tokens';

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
  fonts: configureFonts({ config: { /* per-variant map */ } }),
} satisfies typeof MD3LightTheme;
```

Note: `satisfies typeof MD3LightTheme` (TypeScript 4.9+) validates the shape without widening the type. This is optional but catches missing required fields at compile time.

### App.tsx Update
```typescript
// Before (line 20 in current App.tsx):
// const paperTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

// After:
import { paperTheme } from './design/theme/paperTheme';
// Delete the MD3DarkTheme / MD3LightTheme imports if no longer used elsewhere
// PaperProvider usage remains the same: <PaperProvider theme={paperTheme}>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Paper MD2 theme (`isV3: false`) | MD3 theme (isV3: true, default since Paper v5) | Paper v5.0.0 (2022) | Different color role names; `configureFonts` v3 API differs |
| Per-platform font config (`{ ios: {...}, android: {...} }`) | Single fontFamily per variant using PostScript name | Phase 5 decision | Simpler; works cross-platform with static TTF files |
| `colorScheme`-driven theme switching | Single light theme for now | Phase 6 decision | Dark mode deferred to v2 |

**Deprecated/outdated:**
- MD2-style `configureFonts({ isV3: false, config: { ios: {...} } })`: Do not use. Project is on MD3 (isV3: true).
- `fontWeight` as a string alongside named Inter font files: Explicitly prohibited by STATE.md decision.

## Open Questions

1. **`satisfies` TypeScript operator availability**
   - What we know: Project uses TypeScript 5.7.3 (from package.json). `satisfies` was introduced in TS 4.9.
   - What's unclear: Whether the tsconfig targets support it (no tsconfig read during this research session).
   - Recommendation: Use `satisfies typeof MD3LightTheme` — it's safe with TS 5.7.3. If it causes an error, remove it; the type safety is a bonus not a requirement.

2. **`useColorScheme` hook removal from App.tsx**
   - What we know: `colorScheme` is currently used only for theme selection.
   - What's unclear: Whether `colorScheme` is passed into `Navigation` for any other purpose.
   - Recommendation: Audit Navigation component before removing the `colorScheme` prop. If Navigation uses it, keep the hook but stop using `colorScheme` for Paper theme selection.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest 29.7.0 with react-native preset |
| Config file | `package.json` — `"jest": { "preset": "react-native", ... }` |
| Quick run command | `npx jest __tests__/tokens/ --no-coverage` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAPR-01 | `paperTheme.ts` exports `paperTheme` with no hardcoded hex values | unit | `npx jest __tests__/theme/paperTheme.test.ts -x` | ❌ Wave 0 |
| PAPR-01 | `paperTheme.colors.primary` equals `colors.brand.primary` at runtime | unit | `npx jest __tests__/theme/paperTheme.test.ts -x` | ❌ Wave 0 |
| PAPR-02 | `paperTheme.fonts` contains all 15 MD3TypescaleKey variants + `default` | unit | `npx jest __tests__/theme/paperTheme.test.ts -x` | ❌ Wave 0 |
| PAPR-02 | Each font variant has `fontFamily` starting with `Inter-` and no `fontWeight` string | unit | `npx jest __tests__/theme/paperTheme.test.ts -x` | ❌ Wave 0 |
| PAPR-03 | `design/theme/paperTheme.ts` file exists on disk | unit (fs) | `npx jest __tests__/theme/paperTheme.test.ts -x` | ❌ Wave 0 |
| PAPR-03 | Visual: Searchbar uses brand orange on AddFoodScreen | manual | Run on simulator/device | manual only |

### Sampling Rate
- **Per task commit:** `npx jest __tests__/theme/ --no-coverage`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `__tests__/theme/paperTheme.test.ts` — covers PAPR-01, PAPR-02, PAPR-03 (structural)
- [ ] No new framework config needed — Jest is already configured

*(Existing test infrastructure is sufficient; only the new test file needs to be created)*

## Sources

### Primary (HIGH confidence)
- `node_modules/react-native-paper/lib/typescript/types.d.ts` — `MD3Colors`, `MD3Type`, `MD3Typescale`, `MD3TypescaleKey` enum (all 15 variants verified)
- `node_modules/react-native-paper/lib/typescript/styles/fonts.d.ts` — `configureFonts` overload signatures
- `node_modules/react-native-paper/lib/module/styles/fonts.js` — `configureV3Fonts` implementation (flat config vs per-variant behavior)
- `node_modules/react-native-paper/lib/module/styles/themes/v3/LightTheme.js` — `MD3LightTheme` structure, `configureFonts()` default call
- `node_modules/react-native-paper/lib/module/styles/themes/v3/tokens.js` — default typescale `regularType` / `mediumType` composition

### Secondary (MEDIUM confidence)
- `App.tsx` (project file) — current PaperProvider usage and colorScheme pattern
- `screens/AddFood/AddFoodScreen.tsx` — confirms Searchbar and TextInput are the Paper components in scope
- `.planning/STATE.md` — fontWeight decision documented as project constraint

### Tertiary (LOW confidence)
- None — all critical findings verified from installed package source

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from installed package source files
- Architecture: HIGH — MD3Colors shape, configureFonts behavior, and MD3LightTheme structure all read directly from Paper v5.15.0 source
- Pitfalls: HIGH — fontWeight/Android issue captured in STATE.md as a project decision; color spread pattern verified from LightTheme.js source

**Research date:** 2026-03-14
**Valid until:** 2026-06-14 (Paper minor version bumps unlikely to change configureFonts API in this timeframe)
