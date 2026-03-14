# Pitfalls Research

**Domain:** Adding a design system to an existing bare React Native app (v1.1: Design System & Branding)
**Researched:** 2026-03-14
**Confidence:** HIGH (verified against official react-native-paper docs, GitHub issues, official RN font docs, and direct codebase inspection)

---

## Critical Pitfalls

### Pitfall 1: Custom Font + react-native-vector-icons UIAppFonts Collision on iOS

**What goes wrong:**
The project already has `Ionicons.ttf`, `Feather.ttf`, and `FontAwesome.ttf` listed under `UIAppFonts` in `ios/macromaker/Info.plist`. When you add a brand font (e.g., `Inter-Regular.ttf`) using `react-native-asset` (the modern font-linking approach), the tool rewrites the `UIAppFonts` array. If it drops the vector icon entries — or if the build phase copies icon fonts again via CocoaPods — icons render as `?` boxes and/or the brand font fails to load. The inverse also happens: re-running `pod install` after adding a font can re-inject the icon fonts via CocoaPods, doubling them and breaking the icon renderer.

**Why it happens:**
Two systems compete to own `UIAppFonts`: manual `Info.plist` management (used for icon fonts) and `react-native-asset` / CocoaPods autolinking (the modern path for brand fonts). Neither knows about the other. The first time you run `npx react-native-asset` for a brand font, it appends to `UIAppFonts`, which is correct. The danger is subsequent `pod install` runs silently re-injecting the icon fonts via the CocoaPods build phase, resulting in duplicate `UIAppFonts` entries and broken icon rendering.

**How to avoid:**
Pick one authority for all font registration and eliminate the other:

- **Recommended**: Use `react-native-asset` as the single authority. This means: (a) add brand fonts to `assets/fonts/`, (b) declare `assets: ['./assets/fonts/']` in `react-native.config.js`, (c) run `npx react-native-asset`, and (d) keep icon font entries in `Info.plist` **only** while disabling CocoaPods from copying them by setting `fonts: { 'react-native-vector-icons': { platforms: { ios: null } } }` in `react-native.config.js`. After every `pod install`, verify that `UIAppFonts` still contains all required entries and has no duplicates.

- Never run `react-native link` (deprecated) alongside `react-native-asset` — they produce conflicting output.

**Warning signs:**
- Icons render as `?` or empty boxes on iOS after adding the brand font
- `UIAppFonts` array contains the same `.ttf` filename twice
- Brand font renders on Android but not iOS after pod install
- Xcode Build Phases → Copy Bundle Resources shows the same font file appearing in both "Copy Pods Resources" and as a direct project file

**Phase to address:**
Phase 1 (font integration) — must be validated on a real iOS build before any component uses the brand font.

---

### Pitfall 2: react-native-paper `configureFonts` Does Not Apply `fontWeight` — You Must Load Separate Weight Files

**What goes wrong:**
When configuring a custom font family in the react-native-paper MD3 theme using `configureFonts({ config: { fontFamily: 'Inter' } })`, bold and italic variants do not render — they either fall back to the system font or display the regular weight regardless of `fontWeight: '700'` in the config. This affects Paper components that use `labelLarge` or `headlineSmall` variants (which are bold by default in MD3).

**Why it happens:**
React Native does not implement CSS-style `font-weight` synthesis. On Android in particular, `fontWeight: '700'` only works if the OS can locate a font file that corresponds to that weight. On iOS, the OS can sometimes synthesize bold for system fonts but not for custom TTFs. React Native Paper's `configureFonts` passes `fontWeight` through to the native layer, which silently fails to apply it if no matching font file exists for that weight.

**How to avoid:**
Load each weight as a distinct font file with a distinct `fontFamily` name, then map weights explicitly in the Paper theme:

```ts
// Correct approach for react-native-paper MD3 custom font
const fontConfig = {
  displayLarge:   { fontFamily: 'Inter-Bold',    fontWeight: undefined },
  displayMedium:  { fontFamily: 'Inter-Bold',    fontWeight: undefined },
  headlineLarge:  { fontFamily: 'Inter-SemiBold', fontWeight: undefined },
  headlineSmall:  { fontFamily: 'Inter-Medium',   fontWeight: undefined },
  bodyLarge:      { fontFamily: 'Inter-Regular',  fontWeight: undefined },
  bodyMedium:     { fontFamily: 'Inter-Regular',  fontWeight: undefined },
  labelLarge:     { fontFamily: 'Inter-Medium',   fontWeight: undefined },
  // ... etc
};
```

Files needed in `assets/fonts/`: `Inter-Regular.ttf`, `Inter-Medium.ttf`, `Inter-SemiBold.ttf`, `Inter-Bold.ttf` (at minimum). Set `fontWeight: undefined` to suppress react-native-paper's default weight injection — it interferes when explicit family-per-weight names are used.

**Warning signs:**
- Body text renders in brand font but headings fall back to system font
- All text renders at regular weight regardless of semantic variant
- `fontWeight: '700'` appears in the theme config but has no visual effect
- Android and iOS show different weights for the same component

**Phase to address:**
Phase 1 (font integration and Paper theme configuration) — test both platforms before proceeding to component library.

---

### Pitfall 3: Custom Fonts Do Not Render in react-native-svg Text Elements on Android

**What goes wrong:**
The app has three D3/SVG graph components (BarGraph, MealTimeGraph, TotalCaloriesGraph) that use SVG `<Text>` elements for axis labels and values. These currently hardcode `fontFamily="Arial"` or `fontFamily="Helvetica"`. When you switch to a brand font, it will render correctly on iOS but silently fall back to the system default on Android inside `react-native-svg` — even if the font is correctly registered in the Android `assets/fonts/` directory.

**Why it happens:**
`react-native-svg`'s `<Text>` element on Android does not share the same font resolution path as React Native's standard `<Text>` element. SVG text uses Android's native SVG rendering stack, which requires a font path reference rather than just a font family name. This is a longstanding, known limitation documented in multiple react-native-svg GitHub issues (e.g., #122, #189, #905).

**How to avoid:**
Two options:

1. **Keep system fonts in graph labels** (recommended for this project). Use `"Arial"` / `"Helvetica"` (iOS) or `"sans-serif"` (Android) — these system fonts are always available and render reliably in SVG. Graph axis labels and numeric values do not need brand personality; legibility matters more. Set the fontFamily to a Platform-conditional value: `Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif'`.

2. **Use `<ForeignObject>` to embed a React Native `<Text>`** inside the SVG for graph labels. ForeignObject wraps a standard RN Text component, which does resolve custom fonts correctly. This is more complex and can affect SVG layout calculations.

For this codebase, Option 1 is correct. The graph labels are data — numbers and time strings — where monospaced system fonts are actually preferable for alignment.

**Warning signs:**
- Graph axis labels look brand-correct on iOS simulator but show system font on Android
- Applying `fontFamily={tokens.fontFamily.brand}` to SVG `<Text>` has no effect on Android
- No error thrown — the fallback is silent

**Phase to address:**
Phase 1 (font integration) — define graph text as a carve-out from brand font application before touching any graph component styling.

---

### Pitfall 4: Two Theme Systems — react-native-paper PaperProvider vs Custom Token Object

**What goes wrong:**
The app uses `PaperProvider` (currently with the stock `MD3LightTheme`, no customization). Adding a custom design token system creates a second source of truth for colors, spacing, and typography. Components using Paper (`Searchbar`, `TextInput`, `Button` from react-native-paper) read colors from the Paper theme context. Components using custom tokens read from the token file directly. Over time, the same semantic concept — e.g., "primary action color" — lives in two places with values that diverge. The Paper `primary` color and `tokens.color.brand.primary` become different shades that nobody notices until a visual review.

**Why it happens:**
Developers add a token file for custom components and never wire it to the Paper theme. The Paper `PaperProvider` keeps using `MD3LightTheme` defaults. Five screens into the migration, Paper inputs look one color and custom buttons look another. Neither is wrong — they just never shared a source of truth.

**How to avoid:**
Establish one source of truth at the start: the custom token file drives the Paper theme, not the other way around. Structure it as:

```
tokens/colors.ts      ← raw color values (the single source of truth)
tokens/theme.ts       ← constructs the Paper MD3 theme from token values
App.tsx               ← PaperProvider uses the Paper theme from tokens/theme.ts
```

All custom components import from `tokens/colors.ts` directly. All Paper components get their colors through the Paper theme, which was built from the same `tokens/colors.ts`. The two systems coexist by sharing the bottom layer — never have them maintain separate color values.

**Warning signs:**
- Paper `TextInput` underline color differs from custom button primary color
- Changing a color in the token file doesn't update Paper component colors
- `theme.colors.primary` in `useTheme()` is different from `tokens.colors.brand.primary`
- StyleSheet objects hardcode hex values instead of importing tokens

**Phase to address:**
Phase 1 (token system design) — this is the first architectural decision and must be made before any component is built.

---

### Pitfall 5: Token Sprawl — The Token System Grows to 200+ Entries and Becomes Unusable

**What goes wrong:**
A token system starts clean: 5 brand colors, a spacing scale, 8 typography sizes. By the end of the milestone, it has `colorBrandPrimaryHover`, `colorBrandPrimaryPressed`, `colorBrandPrimaryFocused`, `colorInteractiveSurface`, `spacingContainerHorizontalLarge`, `radiusInputFieldDefault`, and 180 more. No developer can remember what token applies where. Components start re-hardcoding values because finding the right token takes longer than guessing a hex code.

**Why it happens:**
Tokens get created reactively — each new design decision adds a token. There's no upfront constraint on the token hierarchy or on how granular tokens should be. Color tokens in particular explode: every component state (hover, pressed, focused, disabled) gets its own token even for a mobile-only app where hover states are irrelevant.

**How to avoid:**
Constrain the token vocabulary from day one:

- **Colors**: Maximum 3 tiers — Primitive (raw hex), Semantic (e.g., `colorPrimary`, `colorSurface`, `colorError`), Component-specific (only when semantic isn't enough). No state tokens — mobile has no hover; pressed states use opacity, not separate tokens.
- **Spacing**: One scale, 6-8 values (4, 8, 12, 16, 24, 32, 48). Name by size not by use: `space4`, `space8`, not `paddingCardHorizontal`.
- **Typography**: One scale, named by role (bodyLarge, bodySmall, labelMedium) not by pixel size. Reuse Paper's MD3 variant names to prevent a naming mismatch.
- **Radius and shadow**: Maximum 4-5 values, named small/medium/large/full.

The rule: if you can express a component's style using 2-3 semantic tokens, add no new tokens. Only add a component-specific token if the semantic token would need to be overridden in more than 2 places.

**Warning signs:**
- Token file exceeds 80 lines within the first sprint
- A developer asks "which token do I use for a card background?" and the answer isn't obvious
- Token names include component names (e.g., `colorButtonPrimaryBackground`) in the semantic tier
- Multiple tokens map to the same hex value

**Phase to address:**
Phase 1 (token system design) — set the vocabulary constraint before writing a single token.

---

### Pitfall 6: `StyleSheet.create` Cannot Use Token Values That Reference Runtime State

**What goes wrong:**
A common pattern is `StyleSheet.create({ container: { backgroundColor: tokens.color.surface } })` at module level. This works fine for static tokens. But when theming is added (even light-mode-only), developers sometimes want StyleSheet values to react to context — e.g., the Paper theme's dynamic color values. This fails: `StyleSheet.create` is called at module load time, before any React context exists. Attempting to pass a theme-derived value into a top-level `StyleSheet.create` produces a static snapshot that never updates.

**Why it happens:**
JavaScript module evaluation is synchronous and happens before any React tree renders. Developers familiar with CSS-in-JS (where styles are functions evaluated at render time) expect the same behavior from StyleSheet. React Native's StyleSheet is not reactive.

**How to avoid:**
Use one of two patterns, chosen by case:

1. **Static tokens in StyleSheet** (preferred for pure design tokens): Keep `StyleSheet.create` for all static values. Any token that is a compile-time constant (a hex string, a number) belongs here. Use `useMemo` inside the component only when a style depends on a prop or context value that changes at runtime.

2. **`useTheme()` + inline styles for Paper-reactive values**: When a style must track the Paper theme's color scheme, call `const theme = useTheme()` inside the component and construct those specific styles as inline objects or via a `useMemo`. Do not attempt to put these in `StyleSheet.create`.

This project's current architecture already follows pattern 1 for most screens. The risk arises when adding Paper `useTheme()` calls alongside existing StyleSheet — keep them separate and never mix them in the same `StyleSheet.create` call.

**Warning signs:**
- `StyleSheet.create({ color: theme.colors.primary })` — `theme` is not defined at this scope
- TypeScript error: "Cannot read properties of undefined reading 'colors'" at module init
- Colors that should respond to Paper theme changes are frozen after first render

**Phase to address:**
Phase 2 (component library) — enforce the pattern in code review for every new component.

---

### Pitfall 7: Variable Fonts Break on React Native — Load Separate Weight Files Instead

**What goes wrong:**
Some modern fonts ship as a single `.ttf` or `.woff2` variable font file (e.g., `Inter.ttf` from Google Fonts with `wght` axis). A variable font looks like it covers all weights in one file. On React Native, variable fonts are either not supported or have inconsistent cross-platform behavior — iOS may render some weights, Android renders only the default, and Metro may not bundle them correctly as font assets.

**Why it happens:**
React Native's font rendering relies on the native platform's text rendering stack. Android's Skia-based renderer and iOS's CoreText have different levels of variable font support. React Native Paper's `configureFonts` documentation explicitly notes "some platforms failing to render variants entirely" for variable fonts.

**How to avoid:**
Always download and use the **static** (non-variable) font files for each weight variant needed. For Inter, download `Inter-Regular.ttf`, `Inter-Medium.ttf`, `Inter-SemiBold.ttf`, and `Inter-Bold.ttf` from the Google Fonts "Download family" → "Variable fonts" → "Static" folder. Do not use `Inter[slnt,wght].ttf`.

Verify the font files are static before linking: open them in Font Book (macOS) and confirm there is no "Variation" section in the font info panel.

**Warning signs:**
- Font renders one weight on iOS, a different weight on Android
- `fontWeight: '700'` in StyleSheet has no effect with the custom font active
- Font renders correctly in Metro development but differently in a release build

**Phase to address:**
Phase 1 (font selection and asset preparation) — verify before any linking.

---

### Pitfall 8: Tabular Numbers Not Working for Graph Numerics With Custom Fonts

**What goes wrong:**
Graph axis labels and calorie readouts are numeric values. Without tabular (monospaced) number variants, digits have proportional widths — "1" is narrower than "8", so "111" and "888" take different horizontal space. This causes axis labels to shift position as values change (e.g., animating from "0" to "2,450 kcal"), making the graph visually jitter. The React Native `fontVariant: ['tabular-nums']` style property is intended to fix this but has inconsistent behavior: it works reliably with iOS system fonts (SF Pro), works with some custom fonts that include tabular figure variants, and silently falls back to proportional figures on Android with custom fonts.

**Why it happens:**
`tabular-nums` requires the font to have a `tnum` OpenType feature. Not all fonts include this feature. When the font does not support it, React Native silently falls back to proportional figures rather than throwing an error. Many popular brand fonts (especially display fonts) omit the tnum feature.

**How to avoid:**
Two strategies, choose one:

1. **Use system fonts for all numeric/data labels**: For SVG graph text (axis values, calorie counts), keep `fontFamily="Arial"` on iOS and `"sans-serif"` on Android. These system fonts have reliable tabular figure support. Apply brand font only to UI text outside the SVG (screen titles, labels, navigation items).

2. **Verify `tnum` support in the chosen font before committing to it**: Load the font in FontForge or Wakamai Fondue (online tool) and confirm it has the `tnum` OpenType feature. Inter (Google Fonts) supports tabular figures. If the chosen brand font supports `tnum`, test `fontVariant: ['tabular-nums']` on both Android and iOS physical devices with a numeric value that changes width (e.g., "1" vs "8888").

For this project, Option 1 is simpler and more reliable given the SVG graph architecture already uses hardcoded `fontFamily` for axis labels.

**Warning signs:**
- Axis label positions shift when values update (e.g., calorie count increments)
- Numeric values in the BarGraph appear ragged or misaligned across rows
- `fontVariant: ['tabular-nums']` is set but numbers still shift

**Phase to address:**
Phase 1 (font selection) — verify font's tnum support before committing; Phase 3 (screen application) — carve out graph numerics as a hardcoded system-font exception in the token system.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding hex values in StyleSheet instead of importing tokens | Faster component coding | Changing a color requires grep-and-replace across 20+ files; token system loses value | Never after token system is defined |
| Putting Paper `useTheme()` colors inside `StyleSheet.create` | Feels like cleaner colocation | Runtime crash or frozen colors — StyleSheet is not reactive | Never |
| Using one font file for all weights (variable font) | One asset file, simpler download | Wrong weights on Android; silent fallback | Never in React Native |
| Using brand font in SVG `<Text>` elements | Visual consistency | Silent fallback to system font on Android; may cause font-load timing issues in SVG | Acceptable only if verified working on Android physical device with react-native-svg ForeignObject |
| Creating component-scoped token aliases ("buttonPrimary") for every state | Feels thorough | Token sprawl; 200+ tokens; nobody uses them | Only for genuinely unique component needs with no semantic equivalent |
| Extending Paper theme with non-Paper color keys | Quick way to add custom colors to Paper context | TypeScript errors without custom type declaration; breaks Paper upgrade path | Acceptable if custom theme type is properly declared |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `react-native-asset` + existing `UIAppFonts` | Running `npx react-native-asset` without checking what it does to existing `Info.plist` entries | Read the `Info.plist` diff after every `react-native-asset` run; confirm icon font entries are intact |
| react-native-paper `configureFonts` | Setting `fontWeight: '700'` and expecting bold text with a single font file | Load separate weight files; map each MD3 variant to the correct `fontFamily` name |
| react-native-paper `PaperProvider` + custom tokens | Building custom token file without connecting it to the Paper theme | Token file builds the Paper theme object; both consume the same primitive color values |
| `StyleSheet.create` + `useTheme()` | Passing `theme.colors.x` into `StyleSheet.create` at module scope | Static tokens only in `StyleSheet.create`; call `useTheme()` inside component for reactive Paper values |
| Android font registration via `react-native-asset` | Assuming fonts in `assets/fonts/` auto-apply to SVG `<Text>` | SVG Text has a separate font resolution path on Android; use system font names in SVG |
| react-native-vector-icons + new brand font | Running `pod install` after font linking without auditing `UIAppFonts` | Verify `Info.plist` UIAppFonts after every pod install when custom fonts are involved |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Over-rendering because `useTheme()` is called in every leaf component | Subtle jank when Paper theme context updates (e.g., color scheme toggle) | Call `useTheme()` at screen level, pass colors as props; or memoize derived values | At the point where Paper theme changes cause full subtree re-renders |
| `useMemo` for StyleSheet objects with theme dependencies called on every render | No actual memoization benefit if dependency array is wrong | Pass correct deps; benchmark with Flipper before adding memoization | Not a correctness issue, but defeats purpose of memoization |
| Font files included in Metro bundle instead of native assets | Larger JS bundle; font load races with render | Always link fonts as native assets via `react-native-asset`, not by `require()` in JS | If fonts are loaded via `@expo/vector-icons` pattern (not applicable here, but common migration mistake) |
| Applying brand font to SVG graph components | Graph re-renders with font-load delay; axis labels flash system font then brand font | Keep SVG text on system fonts (Arial/sans-serif) | Any time the font has not fully loaded when SVG first renders |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Brand font applied to numeric readouts without tabular figure verification | Calorie and macro numbers shift position as they update; looks broken | Use system font or verified `tnum` font for all data numbers |
| Typography scale too large for dense data screens | Macro input rows become unreadable on small devices; values clip | Start with 14px body for data rows; the existing MacroInput and MealList layouts are dense — test on iPhone SE size class |
| Inconsistent spacing tokens applied to existing screens | Some screens feel tight, others feel loose; looks unpolished | Apply spacing tokens systematically via a screen-by-screen pass, not component-by-component |
| Line height not set in typography scale | Text appears cramped in multi-line labels; worse on Android where default line height differs from iOS | Always specify `lineHeight` per variant in the typography scale; test both platforms |
| Removing hardcoded `backgroundColor: '#e8e8e8'` from calorie container without providing a token replacement | Calorie readout area becomes invisible or inherits wrong background | Every color removed must be replaced with a named semantic token in the same commit |

---

## "Looks Done But Isn't" Checklist

- [ ] **Font linked on iOS**: Verify brand font name in `UIAppFonts` AND that it renders in a `<Text fontFamily="Inter-Regular">` — do not assume linking worked; build and verify visually
- [ ] **Font linked on Android**: Verify `android/app/src/main/assets/fonts/` directory exists and contains the font files after `react-native-asset` — Metro cache can mask missing fonts in dev mode
- [ ] **Icon fonts still work after brand font link**: Build on iOS, check that Ionicons/Feather/FontAwesome render as icons, not `?` characters
- [ ] **Paper theme uses token values**: Confirm `PaperProvider theme.colors.primary` equals `tokens.colors.brand.primary` — open React DevTools and inspect the theme prop
- [ ] **SVG graph labels are intentionally excluded from brand font**: Confirm BarGraph/MealTimeGraph/TotalCaloriesGraph SVG `<Text>` elements still use `Arial`/`sans-serif`, not the brand font
- [ ] **No raw hex values in new components**: Grep for hex color patterns (`#[0-9a-fA-F]{3,6}`) in all new component files — only `constants/Colors.ts` and the token primitive file should contain raw hex
- [ ] **Typography scale tested on iPhone SE viewport**: Open every screen on a 375×667 viewport; check that numeric readouts don't clip
- [ ] **`fontWeight` not set alongside custom font family**: Grep for `fontWeight` usage alongside `fontFamily` in the token config — these should be mutually exclusive per weight file approach
- [ ] **Token count bounded**: Token file stays under 60-80 entries total at end of Phase 1 — if exceeded, audit for redundancy before Phase 2

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Icons broken after brand font link | LOW | Check `Info.plist` UIAppFonts; verify no duplicates; clean DerivedData in Xcode; rebuild |
| Brand font not rendering on Android | LOW | Verify `android/app/src/main/assets/fonts/` has the files; wipe Metro cache (`npx react-native start --reset-cache`); do a clean Android build |
| Paper theme colors diverged from custom tokens | MEDIUM | Audit every place `theme.colors.x` is used in Paper components vs every token value; realign the Paper theme object to source from tokens |
| Token sprawl already happened | MEDIUM | Audit tokens against actual usage with a grep; delete any token with zero references; merge tokens that map to the same value; rename to semantic rather than component names |
| Variable font weight wrong on Android | LOW | Delete variable font file; download and link static weight files; update fontFamily references in theme and StyleSheet |
| SVG graph labels flashing/wrong font | LOW | Set all SVG `<Text fontFamily>` to explicit system font values; do not rely on default fallback behavior |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| UIAppFonts / vector icon collision | Phase 1: Font integration | Build on iOS; verify icons render and brand font renders; check UIAppFonts for duplicates |
| Paper `configureFonts` fontWeight failure | Phase 1: Font integration + Paper theme | All MD3 variants display correct weights on both platforms |
| SVG `<Text>` custom font on Android | Phase 1: Font integration | Explicitly documented that SVG labels use system fonts; no brand fontFamily in SVG Text |
| Two theme systems diverging | Phase 1: Token system design | `tokens/colors.ts` is imported by `tokens/theme.ts`; Paper theme and custom tokens share the same primitive values |
| Token sprawl | Phase 1: Token system design | Token file under 80 entries at end of Phase 1 |
| StyleSheet with reactive Paper values | Phase 2: Component library | No `theme.colors` references inside `StyleSheet.create()` calls in any new component |
| Variable font issues | Phase 1: Font asset preparation | Font files are static variants; no variable font files in `assets/fonts/` |
| Tabular number alignment | Phase 1: Font selection + Phase 3: Screen application | Graph numeric labels use system font; or tnum feature verified on both platforms |

---

## Sources

- [React Native Paper — Fonts guide](http://oss.callstack.com/react-native-paper/docs/guides/fonts/) — HIGH confidence (official docs)
- [React Native Paper — Theming guide](https://callstack.github.io/react-native-paper/docs/guides/theming/) — HIGH confidence (official docs)
- [react-native-paper issue #3609: Global custom fonts in MD3 not working](https://github.com/callstack/react-native-paper/issues/3609) — HIGH confidence (official issue tracker, maintainer response)
- [react-native-paper issue #4307: Custom font weight not working](https://github.com/callstack/react-native-paper/issues/4307) — HIGH confidence (official issue tracker)
- [react-native-svg issue #122: Trouble with custom fonts in SVG Text](https://github.com/react-native-community/react-native-svg/issues/122) — HIGH confidence (official issue tracker)
- [react-native-svg issue #905: Dynamic fonts not rendering on Android in SVG](https://github.com/software-mansion/react-native-svg/issues/905) — HIGH confidence (official issue tracker)
- [react-native-vector-icons SETUP-REACT-NATIVE.md](https://github.com/oblador/react-native-vector-icons/blob/master/docs/SETUP-REACT-NATIVE.md) — HIGH confidence (official)
- [Custom Fonts in React Native — LogRocket](https://blog.logrocket.com/adding-custom-fonts-react-native/) — MEDIUM confidence (community, multiple-source verified)
- [Custom Font Caveats in React Native — Ronald James](https://www.ronaldjamesgroup.com/article/custom-font-caveats-in-react-native) — MEDIUM confidence (community)
- [Tabular Figures in Mobile App — Glyphs Forum](https://forum.glyphsapp.com/t/tabular-figures-in-mobile-app/22733) — MEDIUM confidence (community, font engineering)
- [Fixed Width Text in React Native — Medium](https://medium.com/react-native-school/fixed-width-text-in-react-native-c8dfd65b8525) — MEDIUM confidence (community)
- Direct codebase inspection: `App.tsx`, `components/MealTimeGraph/index.tsx`, `components/BarGraph/HorizontalBars.tsx`, `screens/AddFood/AddFoodScreen.tsx`, `ios/macromaker/Info.plist` — HIGH confidence (source of truth)

---

*Pitfalls research for: v1.1 Design System & Branding — adding design system to existing bare React Native app (macromaker)*
*Researched: 2026-03-14*
