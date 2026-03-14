# Project Research Summary

**Project:** macromaker v1.1 — Design System & Branding
**Domain:** React Native design system integration into an existing bare RN app
**Researched:** 2026-03-14
**Confidence:** HIGH

## Executive Summary

macromaker v1.1 is a design system milestone for an existing bare React Native app (bridge-compat, `newArchEnabled=false`). The research confirms a clean, low-dependency approach: a plain TypeScript token system (`design/tokens/`) serves as the single source of truth for all design values, feeding both the existing `react-native-paper` PaperProvider and all custom components via direct static imports into `StyleSheet.create`. The Inter font (four static TTF weight files) is the right brand font choice — its tabular numeral support (`tnum` OpenType feature) is the single highest-ROI typographic detail for a calorie tracking app where numbers update constantly. No new runtime libraries are required; the entire design system consists of structured source files and one dev-dependency (`react-native-asset`) for font linking.

The recommended build order enforces a strict dependency chain: token files must exist before any component is written, and the brand font must be linked and verified on both iOS and Android before any screen migration begins. The architecture deliberately avoids the two most common failure modes for this type of project — letting the Paper theme and custom token system diverge into separate color sources, and over-engineering the token vocabulary before understanding what the app actually needs. The color direction replaces the existing purple accent (`#7078df`) with a slate + orange palette: slate for the precision/data-forward aesthetic, orange for CTAs, and dedicated macro tokens (blue/violet/amber) shared across both UI components and the existing D3 graphs.

The highest-risk work is concentrated in Phase 1. Three specific pitfalls require explicit mitigation: iOS `UIAppFonts` collision between existing react-native-vector-icons entries and the new brand font, variable-vs-static font file confusion for Inter, and react-native-paper's `configureFonts` silently ignoring `fontWeight` unless each weight is a distinct font file. All three are fully preventable with steps documented in PITFALLS.md. If Phase 1 exits with fonts verified on both platforms and icons still rendering, the remaining work is mechanical screen migration with no architectural unknowns.

## Key Findings

### Recommended Stack

The v1.0 stack (RN 0.84.1, react-native-paper 5.15.0, react-native-vector-icons, react-native-svg, React Navigation v7, AsyncStorage) is already in place and is not changing. The only additions are `react-native-asset` (dev dependency, font linking) and four Inter TTF font files in `assets/fonts/`. Everything else is new TypeScript source files with zero runtime package additions.

The key constraint driving stack decisions is `newArchEnabled=false` (bridge-compat mode). This rules out `react-native-unistyles` v3 entirely (requires Fabric/New Architecture), eliminates v2 (end-of-life December 2025), and makes the plain `StyleSheet` + token constant approach the correct and permanent choice — not a compromise. styled-components adds measurable runtime overhead in React Native and is also the wrong tool for a token-driven approach.

**Core technologies:**
- `react-native-asset@2.2.8` (dev dep): Font asset linking for bare RN — current standard, replaces deprecated `react-native link`; auto-handles both iOS `Info.plist` and Android `assets/fonts/`
- `react-native.config.js` (config file, no package): Declares `assets/fonts/` to the RN CLI for asset linking
- Inter TTF static files (4 weights: Regular, Medium, SemiBold, Bold): Brand font with tabular numeral support; static variants only, never the variable font file
- `design/tokens/*.ts` (new source files, no packages): Plain TS `as const` objects for colors, spacing, typography, radius, shadows — zero runtime overhead, full TypeScript inference, autocomplete at every call site
- `react-native-paper@5.15.0` (existing): `configureFonts()` wires brand font into MD3 Paper theme; purely JS, no New Architecture requirement

**What not to add:** `react-native-unistyles` (either version), `@shopify/restyle`, `styled-components`, `expo-font`, `@expo/vector-icons`, `react-native-extended-stylesheet` (unmaintained since 2022).

### Expected Features

The design system must deliver a token foundation, a component library, and full screen migration. Research produced a clear P1/P2/P3 split with no ambiguity on what the milestone requires.

**Must have (P1 — milestone complete when these exist):**
- Token system: `colors.ts` (primitive + semantic tiers), `typography.ts`, `spacing.ts`, `radius.ts`, `shadows.ts`
- Inter font loaded and verified, all four static weight files, exported as `typography.fontFamily.*` constants
- Core components: `Button`, `TextInput` wrapper, `Card`, `Text` variant system, `NumericText` (tabular numerals for all calorie/macro displays)
- Macro color semantic tokens (`colors.macro.carbs`, `colors.macro.protein`, `colors.macro.fat`) shared by UI components and D3 graphs
- `MacroProgressBar` component consuming macro color tokens
- All existing screens migrated from hardcoded hex/size literals to token imports; D3 graph components updated to use `colors.macro.*` tokens for fills

**Should have (P2 — add within milestone if time permits):**
- `Icon` wrapper component (consistent default sizing over raw vector-icons calls)
- `EmptyState` component (history and fitness tab empty states)
- `SectionHeader` component (meal list sections)
- `CalorieSummary` component (consumed vs. remaining callout using `NumericText`)
- Shadow token application to Cards (verify cross-platform before committing)

**Defer to v2+:**
- Dark mode — the semantic token layer makes it addable later; defer until there is user demand; doubles QA surface for no current requirement
- Animated MacroProgressBar fill via Reanimated v3 — installed but animation is polish, not function
- Storybook component catalog — not valuable for a solo app under 30 components

**Anti-features to actively avoid:** Complex `ThemeProvider` context for a light-mode-only app (adds hook overhead with zero payoff); third-party component libraries layered on top of Paper (conflict risk); CSS-in-JS / styled-components; custom SVG icons (react-native-vector-icons already covers all needs); responsive/fluid layout systems (the 8pt grid is sufficient for phone-form-factor targets).

**Color direction:** Slate + orange accent replaces the existing purple `#7078df`. Slate communicates precision for a data tool without the clichéd fitness-green. Orange provides CTA contrast. Macro colors (blue `#60A5FA`, violet `#A78BFA`, amber `#FBBF24`) are visually distinct from each other and from the orange brand accent, and are distinct from the prior purple which was too close to the protein violet.

**Typography direction:** Inter across all 8 scale levels from `display` (32pt, bold) to `overline` (11pt, semibold uppercase). `NumericText` component applies `fontVariant: ['tabular-nums']` to all calorie and macro readouts. SVG graph `<Text>` elements intentionally stay on system fonts — this is a documented carve-out, not an oversight.

### Architecture Approach

The architecture has a clean three-layer structure: token files (raw values, no library dependency) at the bottom, a Paper theme adapter (`paperTheme.ts` built from tokens, passed to `PaperProvider`) and direct token imports (used by custom components and screens via `StyleSheet.create`) in the middle, and existing screens/navigators at the top progressively migrated. The two consumption paths share the same token source, eliminating color drift between Paper and custom UI.

A `design/` directory at project root holds all new files, kept peer-level with `components/` and `screens/` to signal first-class status and provide short import paths. Existing `components/` (D3 graphs) are not moved — they are domain-specific, not design system primitives.

**Major components:**
1. `design/tokens/` — five token files plus barrel `index.ts`; the single source of truth; no library dependency
2. `design/theme/paperTheme.ts` — MD3 theme object constructed from token imports; passed to `PaperProvider` in `App.tsx`; existing Paper components (`Searchbar`, `TextInput`) inherit brand colors without per-component changes
3. `design/components/` — `Button`, `Card`, `Input`, `Text` (variant system), barrel `index.ts`; consume tokens via direct static import into `StyleSheet.create`; no `useTheme()` calls for static values
4. `assets/fonts/` — four Inter TTF static weight files linked via `react-native.config.js` and `npx react-native-asset`
5. Existing `screens/` — progressively migrated via mechanical find-and-replace; `constants/Colors.ts` preserved as a shim pointing to `design/tokens/colors.ts` during migration, deleted after completion

**Key pattern:** `StyleSheet.create` with direct token imports for all static styling — no hook, no re-render overhead. `useAppTheme()` (typed `useTheme<AppTheme>()`) is reserved for the rare case requiring reactive Paper context values. This is the permanent light-mode architecture; dark mode can be added later by promoting static imports to a runtime hook — a mechanical migration, not an architectural rewrite.

### Critical Pitfalls

1. **UIAppFonts collision with react-native-vector-icons on iOS** — `npx react-native-asset` can corrupt the `Info.plist` `UIAppFonts` array, dropping icon font entries. After every `react-native-asset` run and every `pod install`, audit `Info.plist` manually. Icons rendering as `?` boxes is the warning sign. Must be addressed in Phase 1 before any component uses the brand font.

2. **react-native-paper `configureFonts` ignores `fontWeight` — requires separate weight files** — Passing `fontWeight: '700'` with a single font file silently falls back to system font for bold MD3 variants on Android. The fix is mapping each MD3 variant to the correct `fontFamily` name (e.g., `'Inter-Bold'`) and setting `fontWeight: undefined`. Discoverable by testing Paper components on Android during Phase 1 — before building the component library.

3. **Variable font files break on Android** — The Google Fonts "Inter Variable" download (`Inter[slnt,wght].ttf`) renders some weights on iOS and only default weight on Android. Always download the static variants folder. Verify font files are static in Font Book (macOS) before running `react-native-asset`.

4. **Two theme systems diverging** — Building a custom token file without wiring it to the Paper theme produces two disconnected color sources. Paper components and custom components will use different values for "primary." The fix is architectural from day one: tokens drive the Paper theme; both share the same primitive color values. Verify in React DevTools that `PaperProvider theme.colors.primary` equals `tokens.colors.brand.accent`.

5. **Token sprawl** — Reactive token creation produces 200+ entries that developers ignore. Hard constraint from day one: primitive tier + semantic tier only; no state tokens (mobile has no hover); spacing named by value not by use; maximum 6-8 spacing values. Token file stays under 80 entries at end of Phase 1.

6. **Custom font in SVG `<Text>` silently falls back on Android** — `react-native-svg` uses a separate font resolution path on Android. All SVG `<Text>` elements in D3 graph components must explicitly use `Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif'`. This is a deliberate carve-out; document it in the token system to prevent future "fixes" that re-introduce the bug.

## Implications for Roadmap

Research confirms a four-phase build order driven by hard dependencies. Tokens must exist before components; font must be verified before any component uses it; screen migration happens last. The ARCHITECTURE.md `Build Order for Phases` section is the authoritative sequencing reference.

### Phase 1: Token Foundation + Font Integration

**Rationale:** Everything downstream depends on tokens and font availability. This is also the highest-risk phase — pitfalls 1–3 (UIAppFonts collision, variable font confusion, Paper `configureFonts` fontWeight failure) all manifest here. Phase 1 must not be declared complete until fonts are verified rendering correctly on both platforms and icons are confirmed intact on iOS.
**Delivers:** Five token files in `design/tokens/`, `react-native.config.js`, four Inter static TTF files in `assets/fonts/`, font smoke-tested on iOS and Android, icon fonts confirmed intact, `constants/Colors.ts` shim created pointing to token file
**Addresses:** Color token system, typography scale, spacing scale, radius tokens, shadow tokens (all P1 table-stakes features from FEATURES.md)
**Must avoid:** Variable font files; UIAppFonts audit skipped after pod install; building any component before font verification; token count exceeding 80 entries
**Exit criteria:** "Looks Done But Isn't" checklist from PITFALLS.md cleared for font-related items

### Phase 2: Paper Theme Integration

**Rationale:** Once tokens exist, wiring them into the Paper theme is a single new file (`paperTheme.ts`) and one line change in `App.tsx`. This is the first visible change — existing Paper components (`Searchbar` and `TextInput` in AddFoodScreen) immediately reflect brand colors, providing an early proof-of-concept that the token-to-Paper path works. Must happen before the component library to prevent the two-system divergence pitfall (pitfall 4).
**Delivers:** `design/theme/paperTheme.ts`, `design/theme/useAppTheme.ts`, `App.tsx` updated to pass `paperTheme` to `PaperProvider`; Paper components visually reflect token colors on both platforms
**Addresses:** Pitfall 4 prevention (single color source); typed `useAppTheme` hook established for future use
**Must avoid:** Adding custom non-Paper color keys to the Paper theme without declaring `AppTheme` type; putting `theme.colors` inside `StyleSheet.create` calls (pitfall 6 from PITFALLS.md)

### Phase 3: Core Component Library

**Rationale:** With tokens and Paper theme verified, building components is pure implementation work with no architectural unknowns. Components are thin wrappers that import tokens directly. Build in dependency order: `Text` first (other components may compose it), then `Button`, `Card`, `Input`, then `MacroProgressBar` (depends on macro color tokens).
**Delivers:** `design/components/Text.tsx` (variant system including `NumericText`), `Button.tsx`, `Card.tsx`, `Input.tsx`, `MacroProgressBar.tsx`, barrel `index.ts`
**Addresses:** All P1 component features; `NumericText` with tabular numerals for all calorie/macro displays; macro color tokens established and verified in a real component before screen migration
**Must avoid:** Wrapping Paper components in unnecessary design system wrappers; `useTheme()` inside `StyleSheet.create`; adding hook overhead to components that only need static token imports

### Phase 4: Screen Migration

**Rationale:** Leaf screens first, navigators last — each screen is independent. The `constants/Colors.ts` shim ensures no breaking changes mid-migration. D3 graph components get macro color token references but SVG `<Text>` font families stay on system fonts (documented carve-out). Migration is complete only when the full PITFALLS.md "Looks Done But Isn't" checklist clears.
**Delivers:** All existing screens consuming design system tokens and components; D3 graph fills using `colors.macro.*` tokens; `constants/Colors.ts` shim deleted; no hardcoded hex values in any new or migrated component file
**Addresses:** Full P1 milestone completion; consistent screen padding and typography across all 8+ screens
**Migration order:** InfoModal screens (WelcomeScreen, BasicInfoScreen, MoreInfoScreen) → AddFoodScreen → DietTodayScreen → DietHistoryScreen, DailyDietScreen, FitnessScreen → BottomTabNavigator and navigator `screenOptions` (header styles); delete `constants/Colors.ts` shim last

### Phase Ordering Rationale

- Phase 1 cannot be skipped or parallelized — every subsequent phase requires artifacts from it (token files, verified font files)
- Phase 2 is a single-session change but must precede Phase 3 to prevent the two-system color divergence pitfall; it also provides an early confidence check on the token system shape
- Phase 3 components are independent of each other internally and can be built in any order; `MacroProgressBar` should come last as it requires macro tokens to be finalized
- Phase 4 screens are parallelizable but should be reviewed as logical groups (onboarding, diet, fitness) for coherent visual QA

### Research Flags

Phases with standard, well-documented patterns (no additional research-phase needed):
- **Phase 2:** React Native Paper `configureFonts` and `PaperProvider` theming are fully documented in official docs; the pattern is mechanically specified
- **Phase 3:** Direct token import + `StyleSheet.create` is the React Native standard; no novel decisions required; component API shapes are well-defined in FEATURES.md and ARCHITECTURE.md
- **Phase 4:** Screen migration is mechanical find-and-replace work; each screen's integration points are catalogued explicitly in ARCHITECTURE.md

Phases requiring careful execution (not additional research, but verification gates):
- **Phase 1:** Font integration steps are fully specified in STACK.md and PITFALLS.md. The risk is execution (verifying on real devices), not lack of knowledge. The "looks done but isn't" checklist from PITFALLS.md should be the mandatory exit gate before Phase 2 begins. Do not skip iOS physical device font verification — simulator uses different fallback behavior.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | `react-native-asset` and Paper `configureFonts` verified against official docs; Unistyles incompatibility confirmed via official Unistyles docs; Inter font tabular numeral feature verified via official Inter site; `react-native-asset` npm page returned 403 during research — version sourced from secondary reference |
| Features | HIGH | Token architecture from multiple authoritative sources (Material Design 3, Martin Fowler, 8pt grid spec, React Native StyleSheet docs); color palette from UX research and design system principles; typography scale from established typographic fundamentals |
| Architecture | HIGH | Patterns verified against official React Native Paper docs, LogRocket font guide, and direct codebase inspection; concrete file names, code examples, and integration point inventory provided with file-level specificity |
| Pitfalls | HIGH | 6 of 8 pitfalls sourced directly from official GitHub issue trackers (react-native-paper #3609, #4307; react-native-svg #122, #905; react-native-vector-icons docs); 2 from verified community sources consistent with official documented behavior |

**Overall confidence: HIGH**

### Gaps to Address

- **`react-native-asset@2.2.8` version confirmation** — The npm page returned 403 during research; version confirmed via a secondary source (LogRocket article, April 2025). Before installation, run `npm info react-native-asset` to confirm the current version. If `2.2.8` is not `latest`, use whatever `latest` resolves to.

- **react-native-paper `configureFonts` MD3 variant exhaustiveness** — PITFALLS.md shows a partial mapping. When building `paperTheme.ts`, cross-reference the `MD3LightTheme.fonts` object directly (available in the react-native-paper source) to confirm all variants are covered. Unmapped variants will render in the default system font rather than Inter.

- **iOS physical device font validation** — All font-related research was conducted against documentation. Actual font rendering behavior (especially the UIAppFonts collision risk) must be validated on a physical iOS device or a CI build — not just Simulator. Simulator uses different font fallback behavior than device hardware.

- **D3 graph macro color variable names** — ARCHITECTURE.md identifies `BarGraph`, `MealTimeGraph`, and `TotalCaloriesGraph` as needing `colors.macro.*` token references in Phase 4. The exact prop or local variable names holding the hardcoded macro hex values in those three files need a quick audit at Phase 4 start. SVG `<Text>` font family stays on system fonts — that scope is already clear and documented.

## Sources

### Primary (HIGH confidence)
- [React Native Paper — Fonts guide](http://oss.callstack.com/react-native-paper/docs/guides/fonts/) — `configureFonts` API, MD3 variant mapping
- [React Native Paper — Theming guide](https://callstack.github.io/react-native-paper/docs/guides/theming/) — custom theme, `AppTheme` TypeScript pattern
- [Unistyles v3 FAQ](https://www.unistyl.es/v3/other/frequently-asked-questions) — confirmed Fabric-only, no Old Architecture support
- [Inter font official site](https://rsms.me/inter/) — tabular numeral (`tnum`) OpenType feature, weight variants, screen rendering design
- [react-native-paper issue #3609](https://github.com/callstack/react-native-paper/issues/3609) — global custom fonts in MD3 not working; maintainer response
- [react-native-paper issue #4307](https://github.com/callstack/react-native-paper/issues/4307) — custom font weight not working
- [react-native-svg issues #122, #905](https://github.com/software-mansion/react-native-svg) — custom fonts silent fallback on Android in SVG Text
- [react-native-vector-icons SETUP-REACT-NATIVE.md](https://github.com/oblador/react-native-vector-icons/blob/master/docs/SETUP-REACT-NATIVE.md) — font registration approach
- [8pt Grid System — spec.fm](https://spec.fm/specifics/8-pt-grid) — spacing scale foundational reference
- [Material Design 3 — Design Tokens](https://m3.material.io/foundations/design-tokens) — token architecture reference
- [Martin Fowler — Design Token-Based UI Architecture](https://martinfowler.com/articles/design-token-based-ui-architecture.html) — authoritative token system pattern
- [React Native StyleSheet docs](https://reactnative.dev/docs/stylesheet) — static StyleSheet behavior and performance
- Direct codebase inspection (App.tsx, Info.plist, screens/, navigation/, components/, constants/) — integration points and migration scope

### Secondary (MEDIUM confidence)
- [LogRocket: Adding Custom Fonts to React Native](https://blog.logrocket.com/adding-custom-fonts-react-native/) — `react-native-asset` as current standard; Inter confirmed recommended
- [Thoughtbot: Structure for Styling in React Native](https://thoughtbot.com/blog/structure-for-styling-in-react-native) — token-based StyleSheet pattern
- [Stormotion — Fitness App UX Principles](https://stormotion.io/blog/fitness-app-ux/) — data density and palette direction for fitness/tracking apps
- [Cieden — Spacing Best Practices](https://cieden.com/book/sub-atomic/spacing/spacing-best-practices) — 8pt grid application to mobile
- [UXmatters — Color Psychology in Health/Wellness Apps](https://www.uxmatters.com/mt/archives/2024/07/leveraging-the-psychology-of-color-in-ux-design-for-health-and-wellness-apps.php) — palette rationale validation

### Tertiary (LOW confidence)
- [App Color Trends 2025 — Medium/HuedServe](https://medium.com/@huedserve/app-color-trends-2025-fresh-palettes-to-elevate-your-design-bbfe2e40f8f1) — directionally useful for palette validation; single author
- [creatype studio — Best Fonts for Mobile App Design 2025](https://creatypestudio.co/best-fonts-for-mobile-app-design/) — validates Inter recommendation; low-authority source

---
*Research completed: 2026-03-14*
*Ready for roadmap: yes*
