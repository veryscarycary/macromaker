# Phase 5: Token Foundation + Font Integration - Research

**Researched:** 2026-03-14
**Domain:** React Native design tokens (TypeScript), custom font linking (bare RN), UIAppFonts collision
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TOKS-01 | Color token file with primitive tier (palette) and semantic tier (brand, surface, text, macro colors) | TypeScript `as const` pattern with two-layer structure; no runtime library needed |
| TOKS-02 | Typography scale — 8 levels (display → overline) using Inter, typed TypeScript constants | Static per-weight font families + typed variant map; Inter PostScript names documented |
| TOKS-03 | Spacing scale — 8pt grid constants (4, 8, 12, 16, 24, 32, 48, 64) | Simple numeric `as const` object; directly usable in `StyleSheet.create` |
| TOKS-04 | Border radius scale — 4 levels (xs, sm, md, lg) as typed constants | Same `as const` pattern; straightforward to define |
| FONT-01 | Inter static TTF files (Regular, Medium, SemiBold, Bold) added to `assets/fonts/` | rsms/inter v4.1 ships these as `Inter-Regular.ttf`, `Inter-Medium.ttf`, `Inter-SemiBold.ttf`, `Inter-Bold.ttf` |
| FONT-02 | `react-native.config.js` configured and `react-native-asset` run to link fonts on both platforms | Config format and run command documented; v2.2.9 is current |
| FONT-03 | Inter renders correctly on iOS and Android (smoke test on simulator + physical device) | iOS uses PostScript name as fontFamily; Android uses filename without extension |
| FONT-04 | react-native-vector-icons still render correctly after font linking — Info.plist UIAppFonts intact | react-native-asset MERGES UIAppFonts via manifest tracking — collision risk managed by audit protocol |
</phase_requirements>

---

## Summary

Phase 5 establishes the entire design token foundation and verifies custom font delivery before any downstream work begins. Token implementation is entirely in plain TypeScript — five files using `as const` objects with exported types in `design/tokens/`. No runtime library is needed or wanted; tokens are imported directly into `StyleSheet.create` calls.

The font integration work follows a standard bare React Native pattern: copy four Inter static TTF files to `assets/fonts/`, create `react-native.config.js`, run `npx react-native-asset@latest`, then `pod install` for iOS. The critical risk in this phase is UIAppFonts collision: `react-native-asset` tracks what it has linked via a manifest and MERGES UIAppFonts rather than overwriting, but this must be manually audited after every run to confirm Ionicons.ttf, Feather.ttf, and FontAwesome.ttf remain intact.

iOS and Android differ in how they resolve `fontFamily`: iOS requires the PostScript name (e.g., `Inter-Bold`), Android requires the filename without extension (e.g., `Inter-Bold`). For Inter, the PostScript names and filenames are identical, so no platform-conditional code is needed for this font. However, this equivalence must be confirmed after downloading the actual TTF files.

**Primary recommendation:** Use Inter v4.1 static TTF files from rsms/inter GitHub releases, named `Inter-Regular.ttf` / `Inter-Medium.ttf` / `Inter-SemiBold.ttf` / `Inter-Bold.ttf`. Configure linking via `react-native.config.js` + `react-native-asset`. Manually audit Info.plist after every asset-link run.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Inter font (rsms/inter) | v4.1 | Brand typeface — 4 static weights | Industry standard grotesque; excellent legibility at mobile sizes; free OFL license |
| react-native-asset | 2.2.9 | Font file linking for both platforms | Replaces removed `react-native link`; tracks linked assets via manifest for safe add/remove |
| TypeScript `as const` | (built-in) | Token definitions | Zero runtime cost; full type inference; no external dependency; works directly in StyleSheet.create |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@react-native-community/cli` | 20.1.2 (already installed) | Provides `react-native-asset` command internally | Already present; no separate install needed if using `npx react-native-asset` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain TS `as const` | Style Dictionary, Theo | Runtime tool overhead, build pipeline complexity — wrong for a solo mobile app with no web surface |
| Static TTF per weight | Variable Inter font | Variable font renders only default weight on Android — confirmed in REQUIREMENTS.md out-of-scope list |
| react-native-asset | Manual copy + Info.plist edit | Manual approach works but error-prone for Android `assets/fonts/` sync; react-native-asset handles both platforms |

**Installation:**
```bash
# No new dependencies — react-native-asset is run via npx
# Inter TTF files are downloaded manually from https://github.com/rsms/inter/releases/tag/v4.1
# and copied into assets/fonts/
```

---

## Architecture Patterns

### Recommended Project Structure
```
design/
├── tokens/
│   ├── colors.ts          # Primitive palette + semantic layer
│   ├── typography.ts      # 8-level scale with Inter font family names
│   ├── spacing.ts         # 8pt grid (4, 8, 12, 16, 24, 32, 48, 64)
│   ├── radius.ts          # xs, sm, md, lg border radius
│   ├── shadows.ts         # Elevation levels (deferred to v2 per REQUIREMENTS DS-03)
│   └── index.ts           # Barrel export
assets/
└── fonts/
    ├── Inter-Regular.ttf
    ├── Inter-Medium.ttf
    ├── Inter-SemiBold.ttf
    └── Inter-Bold.ttf
react-native.config.js     # Root — asset linking config
```

### Pattern 1: Two-Layer Color Tokens (Primitive + Semantic)
**What:** Primitive layer defines all raw color values by hue/shade. Semantic layer maps primitives to intent (brand, surface, text, macro nutrients).
**When to use:** Always — semantic layer is what components import; primitives are never used directly in components.
**Example:**
```typescript
// design/tokens/colors.ts
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
  orange400: '#fb923c',
  orange500: '#f97316',
  orange600: '#ea580c',
  blue400:   '#60a5fa',
  violet400: '#a78bfa',
  amber400:  '#fbbf24',
  white:     '#ffffff',
  black:     '#000000',
} as const;

export const colors = {
  brand: {
    primary:   palette.orange500,
    primaryDark: palette.orange600,
    primaryLight: palette.orange400,
  },
  surface: {
    default:   palette.white,
    subtle:    palette.slate50,
    muted:     palette.slate100,
    border:    palette.slate200,
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
```

### Pattern 2: Typography Token with Named Font Families
**What:** Each weight is a distinct `fontFamily` string matching the TTF filename / PostScript name. The scale maps variant names to all TextStyle properties needed.
**When to use:** In TOKS-02 implementation and consumed by Phase 6 `configureFonts`.

```typescript
// design/tokens/typography.ts
// Font family names: match TTF filename (without extension) = PostScript name for Inter
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
  overline:   { fontFamily: fontFamilies.medium,   fontSize: 10, lineHeight: 14, letterSpacing: 1.5, textTransform: 'uppercase' as const },
} as const;

export type TypeScaleKey = keyof typeof typeScale;
export type TypeScale = typeof typeScale;
```

Note: `textTransform` requires `as const` because TypeScript widens string literals in objects.

### Pattern 3: Spacing and Radius Tokens
**What:** Simple numeric constants on an 8pt grid.
**When to use:** All padding, margin, gap values in StyleSheet.create.

```typescript
// design/tokens/spacing.ts
export const spacing = {
  xs:  4,
  sm:  8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;
export type Spacing = typeof spacing;

// design/tokens/radius.ts
export const radius = {
  xs:  4,
  sm:  8,
  md: 12,
  lg: 16,
} as const;
export type Radius = typeof radius;
```

### Pattern 4: Barrel Index
**What:** Single import point for all tokens.

```typescript
// design/tokens/index.ts
export { colors } from './colors';
export type { Colors } from './colors';
export { fontFamilies, typeScale } from './typography';
export type { TypeScaleKey, TypeScale } from './typography';
export { spacing } from './spacing';
export type { Spacing } from './spacing';
export { radius } from './radius';
export type { Radius } from './radius';
// shadows deferred to v2 per DS-03 — stub or omit
```

### Pattern 5: react-native.config.js for Font Linking
**What:** Tells `react-native-asset` where to find font files. Must also declare `react-native-vector-icons` with `ios: null` to prevent it from re-writing UIAppFonts.

```javascript
// react-native.config.js
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null, // Prevents vector-icons from overwriting Info.plist UIAppFonts
      },
    },
  },
};
```

### Anti-Patterns to Avoid
- **Importing palette directly in components:** Only the semantic layer (`colors.brand.*`, `colors.text.*`) should be used in components. Palette is internal to the tokens file.
- **Using `fontWeight` string alongside custom font families:** When each weight is a separate font file, `fontWeight` is redundant and causes issues in react-native-paper's `configureFonts`. Omit `fontWeight` when `fontFamily` already encodes weight.
- **Using the Inter variable font file:** Renders only default weight on Android. Only static TTF files per weight are supported cross-platform.
- **Spreading `typeScale` styles into StyleSheet.create with `textTransform`:** The `textTransform: 'uppercase'` in overline is fine in StyleSheet but requires `as const` in the token object to prevent TypeScript widening.
- **Committing `link-assets-manifest.json` to git:** This file is generated per-machine; it should be gitignored (check if already present).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font file linking on iOS/Android | Manual copy + plist edits per developer | `npx react-native-asset` | Handles both platforms, tracks manifest, supports removal, idempotent reruns |
| Typography variant system | Custom hook or context | Plain `as const` object + TypeScript types | Zero runtime cost; types flow through naturally; no Provider needed for light-mode-only app |

**Key insight:** The most common mistake is reaching for a runtime token library (styled-components, Unistyles) when static TypeScript constants give better performance, simpler mental model, and full type safety for a single-theme mobile app.

---

## Common Pitfalls

### Pitfall 1: UIAppFonts Collision After react-native-asset Run
**What goes wrong:** After running `npx react-native-asset` to link Inter fonts, the Ionicons.ttf, Feather.ttf, and FontAwesome.ttf entries disappear from Info.plist, breaking all icons.
**Why it happens:** `react-native-asset` modifies the UIAppFonts array. The `link-assets-manifest.json` tracks what it manages, but if the vector-icons entries were added manually (as they are in this project), the manifest may not protect them.
**How to avoid:**
1. Add the `dependencies: { 'react-native-vector-icons': { platforms: { ios: null } } }` entry to `react-native.config.js` before running `react-native-asset`. This prevents vector-icons from interfering.
2. Manually audit Info.plist UIAppFonts after every `react-native-asset` run to confirm all six entries are present (3 icon fonts + 4 Inter fonts = but note UIAppFonts only needs the file name, not weight).
**Warning signs:** Icons show as "?" on iOS after a build following font linking.

### Pitfall 2: Wrong fontFamily Name on iOS vs Android
**What goes wrong:** Font renders in fallback system font on one platform.
**Why it happens:** iOS requires the PostScript name; Android requires the filename without extension. For Inter, these happen to be the same (`Inter-Bold`), but must be verified with the actual downloaded files.
**How to avoid:** Download the Inter v4.1 files, open one in Font Book (macOS) and verify the PostScript name matches the filename. If they match, no Platform.select() needed.
**Warning signs:** Bold text looks identical to regular weight on one platform; checking `fontFamily` in the Metro bundler.

### Pitfall 3: Variable Font Downloaded Instead of Static
**What goes wrong:** Font appears to work on iOS simulator but renders at default weight on Android.
**Why it happens:** Inter v4 ships both a variable font (single file, all weights) and static per-weight TTFs. If the variable version is downloaded, Android ignores weight axes.
**How to avoid:** Download from the `Inter-4.1.zip` release assets. Look for the `/static/` subdirectory inside the zip. Only use files from there.
**Warning signs:** `Inter-Regular.ttf` shows in `assets/fonts/` but file size is several MB (variable font); static Regular TTF should be around 300-400KB.

### Pitfall 4: pod install Skipped After Font Linking
**What goes wrong:** Fonts link correctly in `react-native.config.js` and `link-assets-manifest.json`, but iOS build does not include the font files.
**Why it happens:** On iOS, `react-native-asset` adds font files to the Xcode project's Copy Bundle Resources phase by editing the `.pbxproj` file. This change requires a `pod install` or at minimum a clean build to take effect.
**How to avoid:** After running `npx react-native-asset`, always run `pod install` in the `ios/` directory before testing.
**Warning signs:** Font renders as system fallback in iOS simulator even though UIAppFonts lists the Inter entries correctly.

### Pitfall 5: textTransform TypeScript Widening in Token Objects
**What goes wrong:** TypeScript error: `Type 'string' is not assignable to type 'TextTransform | undefined'` when spreading overline token into StyleSheet.create.
**Why it happens:** Without `as const`, TypeScript infers `textTransform: 'uppercase'` as `string`, not the literal union type.
**How to avoid:** Use `as const` on the entire `typeScale` object (as shown in code examples), or add `textTransform: 'uppercase' as const` inline on the specific property.

### Pitfall 6: react-native.config.js Not Found at Root
**What goes wrong:** `npx react-native-asset` runs but links nothing; no error message.
**Why it happens:** The config file must be at the project root (same level as `package.json`). No `react-native.config.js` currently exists in the project.
**How to avoid:** Create `react-native.config.js` at `/Users/sossboss/Development/macromaker/react-native.config.js` (project root).

---

## Code Examples

Verified patterns from official sources and community-confirmed practices:

### Linking Fonts — Full Flow
```bash
# Step 1: Download Inter v4.1 static TTF files from:
# https://github.com/rsms/inter/releases/tag/v4.1
# Extract the /static/ folder from Inter-4.1.zip
# Copy Inter-Regular.ttf, Inter-Medium.ttf, Inter-SemiBold.ttf, Inter-Bold.ttf
# to assets/fonts/

# Step 2: Create react-native.config.js (see Pattern 5 above)

# Step 3: Link assets
npx react-native-asset@latest

# Step 4: iOS only
cd ios && pod install && cd ..

# Step 5: Audit Info.plist
# Confirm UIAppFonts array contains ALL of:
#   Ionicons.ttf, Feather.ttf, FontAwesome.ttf  (pre-existing)
#   Inter-Regular.ttf, Inter-Medium.ttf, Inter-SemiBold.ttf, Inter-Bold.ttf  (new)

# Step 6: Clean rebuild
npx react-native run-ios
npx react-native run-android
```

### Smoke Test for Font Rendering
```typescript
// Minimal smoke test component — use in a test screen, not in __tests__/
// iOS: fontFamily = PostScript name = 'Inter-Bold'
// Android: fontFamily = filename without extension = 'Inter-Bold'
// For Inter v4.1, these are the same value — no Platform.select() needed

import { Text, View, StyleSheet } from 'react-native';
import { fontFamilies } from '../design/tokens';

export function FontSmokeTest() {
  return (
    <View>
      <Text style={{ fontFamily: fontFamilies.regular }}>Regular (400)</Text>
      <Text style={{ fontFamily: fontFamilies.medium }}>Medium (500)</Text>
      <Text style={{ fontFamily: fontFamilies.semiBold }}>SemiBold (600)</Text>
      <Text style={{ fontFamily: fontFamilies.bold }}>Bold (700)</Text>
    </View>
  );
}
```

### Consuming Tokens in StyleSheet
```typescript
import { StyleSheet } from 'react-native';
import { colors, spacing, typeScale, radius } from '../design/tokens';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.default,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  title: {
    ...typeScale.heading,
    color: colors.text.primary,
  },
  caption: {
    ...typeScale.caption,
    color: colors.text.secondary,
  },
});
```

### Info.plist UIAppFonts Expected State After Linking
```xml
<key>UIAppFonts</key>
<array>
  <!-- Pre-existing vector icon fonts — MUST remain -->
  <string>Ionicons.ttf</string>
  <string>Feather.ttf</string>
  <string>FontAwesome.ttf</string>
  <!-- New Inter fonts added by react-native-asset -->
  <string>Inter-Regular.ttf</string>
  <string>Inter-Medium.ttf</string>
  <string>Inter-SemiBold.ttf</string>
  <string>Inter-Bold.ttf</string>
</array>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `react-native link` for fonts | `npx react-native-asset` | RN 0.69 (link removed) | Asset-specific tool with manifest tracking |
| All fonts in one variable TTF | Static per-weight TTF files | Inter v4 (2023) | Reliable cross-platform weight rendering |
| `fontWeight` strings in configureFonts | Omit `fontWeight`, use distinct `fontFamily` per weight | RN Paper v5/MD3 | Prevents weight override bugs on Android |
| Import Colors.ts directly | Import from `design/tokens/` semantic layer | Phase 5 | Colors.ts shim deleted in Phase 8 (MIGR-07) |

**Deprecated/outdated:**
- `constants/Colors.ts`: The existing file uses light/dark theme structure with `#2f95dc` tint; it is a shim to be deleted in Phase 8 (MIGR-07). Phase 5 creates its replacement in `design/tokens/colors.ts` — no migration of screens occurs in this phase.
- `assets/fonts/SpaceMono-Regular.ttf`: This is the only font currently in `assets/fonts/`. It is not used by any component (Expo leftover). Can be left as-is or deleted — does not interfere.

---

## Open Questions

1. **Inter v4.1 PostScript names match filenames?**
   - What we know: The pattern `Inter-Bold` (PostScript) = `Inter-Bold.ttf` (filename) is standard for Inter fonts and confirmed by community usage.
   - What's unclear: The actual v4.1 release filenames need verification when downloading — v4 changed the naming scheme and introduced optical size variants (`Inter_18pt-Regular.ttf` style names have appeared in some discussions).
   - Recommendation: After downloading `Inter-4.1.zip`, open one TTF in Font Book on macOS and confirm the PostScript name. If the static `/` folder uses `Inter_18pt-Regular.ttf` style names, the `fontFamily` string used in code must match the PostScript name, not the filename (on iOS). Document whatever naming is found.

2. **react-native-asset merge behavior confirmed?**
   - What we know: The tool uses `link-assets-manifest.json` in both `ios/` and `android/` directories to track managed files. It adds entries to UIAppFonts rather than replacing the array wholesale.
   - What's unclear: The exact behavior when the vector-icons entries in UIAppFonts were manually added (not managed by react-native-asset) — are they preserved or at risk?
   - Recommendation: The `dependencies: { 'react-native-vector-icons': { platforms: { ios: null } } }` configuration in `react-native.config.js` is the safest approach. Always audit Info.plist after running.

3. **Should `shadows.ts` be created as a stub or omitted?**
   - What we know: Shadows token is listed in Phase 5 success criteria ("Five token files") but shadows are deferred to v2 per DS-03.
   - What's unclear: Whether an empty/stub file satisfies the success criterion or creates confusion.
   - Recommendation: Create `shadows.ts` with a comment that it's intentionally empty pending v2, and export an empty `shadows` object. This satisfies the file-count criterion and reserves the module slot.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest 29 + react-native preset |
| Config file | `package.json` `"jest"` key (no separate jest.config.js) |
| Quick run command | `npx jest __tests__/utils.test.ts --no-watchAll` |
| Full suite command | `npm run test:single` (runs all tests, no watch) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TOKS-01 | Color tokens export `colors` with correct shape and no undefined values | unit | `npx jest __tests__/tokens/colors.test.ts -x` | ❌ Wave 0 |
| TOKS-02 | Typography scale exports 9 keys (display…overline), each with fontFamily string | unit | `npx jest __tests__/tokens/typography.test.ts -x` | ❌ Wave 0 |
| TOKS-03 | Spacing exports 8 values on 8pt grid; all are positive numbers | unit | `npx jest __tests__/tokens/spacing.test.ts -x` | ❌ Wave 0 |
| TOKS-04 | Radius exports xs, sm, md, lg as positive numbers | unit | `npx jest __tests__/tokens/radius.test.ts -x` | ❌ Wave 0 |
| FONT-01 | Inter TTF files exist at `assets/fonts/Inter-{weight}.ttf` | unit (fs check) | `npx jest __tests__/tokens/fonts.test.ts -x` | ❌ Wave 0 |
| FONT-02 | `react-native.config.js` exports `assets` array containing `./assets/fonts` | unit | included in `fonts.test.ts` | ❌ Wave 0 |
| FONT-03 | Inter renders correctly on both platforms | manual-only | N/A — requires simulator/device visual check | N/A |
| FONT-04 | Info.plist UIAppFonts contains all icon font entries | unit (fs check) | `npx jest __tests__/tokens/fonts.test.ts -x` | ❌ Wave 0 |

Note: FONT-03 is manual-only — font rendering cannot be verified by Jest in a non-native test environment. The smoke test component (see Code Examples) is the verification vehicle.

### Sampling Rate
- **Per task commit:** `npx jest __tests__/tokens/ --no-watchAll`
- **Per wave merge:** `npm run test:single`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `__tests__/tokens/colors.test.ts` — covers TOKS-01
- [ ] `__tests__/tokens/typography.test.ts` — covers TOKS-02
- [ ] `__tests__/tokens/spacing.test.ts` — covers TOKS-03
- [ ] `__tests__/tokens/radius.test.ts` — covers TOKS-04
- [ ] `__tests__/tokens/fonts.test.ts` — covers FONT-01, FONT-02, FONT-04
- [ ] `__tests__/tokens/` directory does not yet exist

---

## Sources

### Primary (HIGH confidence)
- GitHub: unimonkiez/react-native-asset v2.2.9 — asset linking mechanism, manifest behavior, config format
- GitHub: callstack/react-native-paper issue #4307 — confirmed `fontWeight` must be omitted when using separate font family files
- rsms/inter GitHub repo — Inter v4.1 is latest release; static files ship in `/static/` directory of release zip
- `/Users/sossboss/Development/macromaker/ios/macromaker/Info.plist` — confirmed Ionicons.ttf, Feather.ttf, FontAwesome.ttf present and manually managed
- `/Users/sossboss/Development/macromaker/.planning/REQUIREMENTS.md` — confirmed out-of-scope items (variable font, Unistyles, styled-components)
- `/Users/sossboss/Development/macromaker/.planning/STATE.md` — confirmed active decisions: `as const` tokens, Inter static TTF, fontWeight must be undefined in configureFonts

### Secondary (MEDIUM confidence)
- LogRocket "How to add custom fonts in React Native" — react-native.config.js format and npx react-native-asset flow
- react-native-paper fonts guide (oss.callstack.com) — configureFonts API; recommends separate file per variant
- WebSearch results on Inter PostScript names — community consensus that iOS PostScript name = filename for Inter

### Tertiary (LOW confidence)
- WebSearch on UIAppFonts overwrite/merge — no official documentation found; behavior inferred from manifest mechanism and community reports; audit protocol is the safe fallback

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — TypeScript `as const` is project-decided; react-native-asset v2.2.9 is current and verified
- Architecture: HIGH — token patterns from decisions in STATE.md; font linking flow is well-documented
- Pitfalls: MEDIUM — UIAppFonts merge behavior is MEDIUM (no official docs confirm exact behavior); all other pitfalls are HIGH from community-verified patterns
- Inter v4.1 static filenames: MEDIUM — naming pattern is consistent across community usage, but exact filenames need verification at download time

**Research date:** 2026-03-14
**Valid until:** 2026-06-14 (stable domain — 90 days reasonable; react-native-asset and Inter are mature projects)
