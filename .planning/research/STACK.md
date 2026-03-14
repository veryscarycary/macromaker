# Stack Research

**Domain:** React Native design system — tokens, typography, custom fonts (v1.1 milestone)
**Researched:** 2026-03-14
**Confidence:** HIGH (font loading verified via official LogRocket/RN CLI docs; library compat verified via official sources)

> **Scope note:** This file covers only the NEW additions for the v1.1 design system milestone. The validated v1.0 stack (RN 0.84.1 bridge-compat, react-native-paper, react-native-vector-icons, react-native-svg, React Navigation v7, AsyncStorage) is already in place and is not re-researched here.

---

## Recommended Stack Additions

### Custom Font Loading

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `react-native-asset` | 2.2.8 | Links font files to iOS and Android native projects | Current standard for bare RN (replaces deprecated `react-native link`); auto-unlinks deleted assets; published March 2026 |
| `react-native.config.js` (config file, not a package) | n/a | Tells RN CLI where font files live | Built-in to `@react-native-community/cli` which is already installed |

**Font files to source:** Download Inter (400, 500, 600, 700 weights) as TTF files from [Google Fonts](https://fonts.google.com/specimen/Inter). Place in `assets/fonts/`. Inter is the canonical Notion/Linear typeface — variable font with excellent legibility at small sizes on mobile.

**No `expo-font` or `@expo-google-fonts/*` packages.** These are Expo-only. The bare RN approach needs only the native asset-linking mechanism.

### Design Token System

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Plain TypeScript module (`theme.ts`) | n/a — no package | Single source of truth for all design tokens (color, spacing, typography, radius, shadow) | Zero dependencies, zero runtime overhead, full TypeScript inference, works with React Native's existing `StyleSheet.create()`. The right choice for a single-product app with no dark mode requirement at this milestone. |
| React Native `StyleSheet` | built-in | Create and memoize style objects | Native bridge-optimized; styles are sent to the native layer once, referenced by ID. No performance penalty. |

**No Restyle, no Unistyles, no styled-components** — see "What NOT to Add" below.

### react-native-paper Theme Integration

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `react-native-paper` (already installed) | 5.15.0 | `configureFonts()` to wire brand font into Paper's MD3 typography system | Already a dep; `configureFonts` maps fontFamily + weight to each MD3 variant (displayLarge, headlineMedium, bodyMedium, etc.) inside `PaperProvider`. One place to configure, all Paper components pick it up automatically. |

---

## Installation

```bash
# Install asset linker (dev dependency — only needed at build time)
npm install --save-dev react-native-asset

# Download Inter TTF weights from Google Fonts and place in:
# ./assets/fonts/Inter-Regular.ttf
# ./assets/fonts/Inter-Medium.ttf
# ./assets/fonts/Inter-SemiBold.ttf
# ./assets/fonts/Inter-Bold.ttf

# After placing font files:
npx react-native-asset

# Then rebuild native:
cd ios && pod install && cd ..
# npm run ios / npm run android
```

**New source files to create (no packages):**
- `theme/tokens.ts` — design token constants (colors, spacing, typography scale, radii, shadows)
- `theme/paper-theme.ts` — `configureFonts` call + Paper theme object wiring tokens into `PaperProvider`
- `theme/index.ts` — re-export barrel

---

## Alternatives Considered

| Our Choice | Alternative | When to Use Alternative |
|------------|-------------|-------------------------|
| Plain `theme.ts` + `StyleSheet` | `@shopify/restyle` v2.4.5 | Use Restyle if the team is building a multi-product component library and wants compile-time type checking on prop-level design constraints (e.g., `backgroundColor="cardPrimary"` directly on component props). Overkill for a single product — adds ~3K LOC of type gymnastics for minimal benefit when you control all components. |
| Plain `theme.ts` + `StyleSheet` | `react-native-paper` theming only | If you were using only Paper components everywhere, the Paper theme object alone could serve as the token source. This app has custom components (D3 graphs, StepIndicator, custom forms) that need raw token access, so a separate `tokens.ts` is cleaner. |
| `npx react-native-asset` | Manual iOS/Android native setup | Manual setup (copying TTF to `android/app/src/main/assets/fonts/` and editing `Info.plist` by hand) works but is error-prone and does not auto-clean deleted assets. Use only if `react-native-asset` has a compatibility issue. |
| Inter (Google Fonts, self-hosted) | `@expo-google-fonts/inter` | Expo-only package. Does not work in bare React Native without expo-font runtime. Do not use. |

---

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `react-native-unistyles` v3 | **Hard blocker:** Requires New Architecture (Fabric). macromaker runs `newArchEnabled=false` in bridge-compat mode. Confirmed in official docs: "tightly integrated with Fabric, no plans to support Old Architecture." Support for v2 (Old Arch) ends December 2025. | Plain `StyleSheet` + `theme.ts` |
| `react-native-unistyles` v2 | End-of-life December 2025 — already past support window. Adds a native module for a project that explicitly deferred New Architecture. | Plain `StyleSheet` + `theme.ts` |
| `styled-components` (React Native variant) | Converts CSS strings to StyleSheet objects at runtime via `css-to-react-native`. Measurably slower than plain StyleSheet. Introduces CSS naming conventions (background-color vs backgroundColor) that conflict with the rest of the RN codebase. No benefit for a token-driven approach. | Plain `StyleSheet` with `theme.ts` constants |
| `@shopify/restyle` | Pure JS, bridge-compat — not a hard blocker, but adds significant boilerplate for a project with one developer building one product. Every component needs to be wrapped in `createBox`/`createText` factories. Tight coupling to the Restyle theme object is hard to unwind. The last release was March 2025 (v2.4.5); 9 months prior it was stale at v2.4.0. Active but slow cadence. | Plain `theme.ts` + `StyleSheet` |
| `@expo/vector-icons` | Expo runtime required. Already replaced by `react-native-vector-icons` in v1.0. | `react-native-vector-icons` (already installed) |
| `expo-font` | Expo runtime required. No-op in bare RN without the full Expo module system. | `react-native-asset` + `react-native.config.js` |
| `react-native-extended-stylesheet` | Unmaintained — last commit 2022. Race condition issues with async style resolution. | Plain `StyleSheet` + `theme.ts` |

---

## Stack Patterns by Variant

**If the app adds dark mode in a future milestone:**
- Upgrade the `theme.ts` to export `lightTheme` and `darkTheme` objects
- Use React context to provide the active theme (React Native's `useColorScheme` hook drives the toggle)
- No library change required — the same `StyleSheet`-based approach scales to dark mode with context injection

**If the design system grows to a multi-screen component library needing strict prop constraints:**
- Migrate to `@shopify/restyle` at that point — it excels at enforcing theme-only values via TypeScript generics
- The `tokens.ts` file maps 1:1 to a Restyle theme object — migration path is clean

**If New Architecture is enabled in v2:**
- `react-native-unistyles` v3 becomes viable, but the plain `theme.ts` approach still works and costs nothing to keep
- Migration to Unistyles would be elective, not required

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `react-native-asset@2.2.8` | `react-native@0.84.1`, `@react-native-community/cli@20.1.2` | Font linking via `react-native.config.js` — no native modules, no pod install needed for this tool itself |
| `react-native-paper@5.15.0` (existing) | `react-native@0.84.1`, bridge-compat | `configureFonts` is pure JS; no New Architecture requirement |
| Inter TTF font files | iOS 15.1+, Android API 24+ | TTF is the universal format; OTF also works but TTF has broader Android compatibility |
| `@shopify/restyle@2.4.5` (not recommended, but noted) | `"react": "*", "react-native": "*"` — pure JS, no native modules | Bridge-compat safe if chosen; last release March 19, 2025 |

---

## Font Family Names (iOS vs Android Gotcha)

iOS resolves `fontFamily` from the PostScript name inside the font file (e.g., `Inter-SemiBold`). Android resolves it from the filename without extension (e.g., `Inter-SemiBold`). For Inter TTF files downloaded from Google Fonts, the filename and PostScript name match — no cross-platform discrepancy.

**Rule:** Name the TTF files `Inter-Regular.ttf`, `Inter-Medium.ttf`, `Inter-SemiBold.ttf`, `Inter-Bold.ttf`. Reference them in styles as `fontFamily: 'Inter-SemiBold'`. Do not use a single `Inter.ttf` variable font file — weight resolution from a variable font is unreliable on Android.

---

## Sources

- [LogRocket: How to add custom fonts in React Native](https://blog.logrocket.com/how-to-add-custom-fonts-react-native/) — April 2025 update; confirmed `npx react-native-asset` as current standard, `react-native link` deprecated since 0.69 (HIGH confidence)
- [react-native-asset npm page](https://www.npmjs.com/package/react-native-asset) — v2.2.8 latest, published ~2 months ago (MEDIUM confidence — search-reported, npm page returned 403 on direct fetch)
- [Unistyles v3 FAQ](https://www.unistyl.es/v3/other/frequently-asked-questions) — confirmed "tightly integrated with Fabric, no plans to support Old Architecture" (HIGH confidence — official docs)
- [Shopify Restyle GitHub](https://github.com/Shopify/restyle) — v2.4.5 latest release March 19, 2025; pure JS with `"react": "*", "react-native": "*"` peer deps (MEDIUM confidence — GitHub page; npm page returned 403)
- [React Native Paper — Fonts guide](http://oss.callstack.com/react-native-paper/docs/guides/fonts/) — confirmed `configureFonts` for MD3 variants in v5.x (HIGH confidence — official docs)
- [WebSearch: styled-components vs StyleSheet performance](https://medium.com/@alexeytsuts/choosing-the-technology-for-styles-in-react-native-104ef242bac7) — confirmed styled-components adds runtime CSS-to-RN conversion overhead (MEDIUM confidence — secondary source, consistent with known behavior)

---

*Stack research for: React Native bare app — design system (tokens, typography, custom fonts)*
*Researched: 2026-03-14*
