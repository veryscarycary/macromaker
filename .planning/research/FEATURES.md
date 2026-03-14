# Feature Research

**Domain:** React Native design system for a fitness/diet tracking app
**Researched:** 2026-03-14
**Confidence:** MEDIUM-HIGH — design system component tables-stakes from multiple verified industry sources; color theory from UX/psychology research; font characteristics verified against official font documentation; spacing scale from well-established 8pt grid doctrine.

---

## Milestone Scope

This milestone establishes a cohesive design system for macromaker v1.1:

1. **Design token system** — color, spacing, typography, radius, shadow expressed as typed TypeScript constants
2. **Brand font selection** — a single open-license font with strong numerics and clear hierarchy
3. **Core UI component library** — typed, token-consuming components replacing ad-hoc styles
4. **Design system applied** — all existing screens updated to use the system

The feature research below maps the design system "feature space": what a design system must include (table stakes), what separates a great one from a mediocre one (differentiators), and what to avoid (anti-features). Color, typography, and spacing recommendations are opinionated and actionable.

---

## Feature Landscape

### Table Stakes (Users Expect These)

These are the non-negotiable components of any credible React Native design system. Their absence signals immaturity. Their quality signals craft.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Color token system (primitive + semantic) | Without named tokens, color is scattered as hex strings across files — impossible to retheme or audit | LOW | Two tiers: `colors.slate[900]` (primitive) and `colors.text.primary` (semantic). TypeScript `as const` object exported from `src/tokens/colors.ts`. |
| Typography scale (6-8 levels) | Without a type scale, font sizes are arbitrary and inconsistent across screens | LOW | 8 levels: `display`, `heading`, `title`, `body`, `bodySmall`, `label`, `caption`, `overline`. Defined in `src/tokens/typography.ts`. |
| Spacing scale (8pt base) | The 8pt grid is the industry standard for mobile; inconsistent spacing is the most visible sign of an unpolished app | LOW | Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Half-step at 4pt for icon padding/internal micro-spacing. Exported as `spacing` constant. |
| Border radius scale | Card, button, input, and pill shapes need consistent rounding | LOW | Tokens: `radius.none` (0), `radius.sm` (4), `radius.md` (8), `radius.lg` (12), `radius.xl` (16), `radius.full` (9999 for pills/avatars). |
| Shadow/elevation scale | Cards and modals need consistent depth; iOS shadow ≠ Android elevation | LOW | Define 3 levels: `shadow.sm`, `shadow.md`, `shadow.lg`. Each includes `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, and `elevation` for Android cross-compat. |
| Button component (primary + secondary + ghost) | Every screen in the app has CTAs; without a shared Button, they drift in size, color, and touch state | LOW | `<Button variant="primary|secondary|ghost" size="sm|md|lg">`. Token-consuming, no hardcoded colors. |
| TextInput component | Forms exist on onboarding, AddFood, EditFood screens; consistent input is mandatory | MEDIUM | Wraps RN `TextInput`, supports `label`, `error`, `suffix` (for "lbs", "g" units), focus state with brand border color. Replaces current `@rneui/themed` Input. |
| Typography components (Text variants) | If every `<Text>` specifies `fontFamily`, `fontSize`, `fontWeight` inline, the system is not a system | LOW | `<Heading>`, `<Body>`, `<Caption>`, `<Label>` components. Each maps to a typography token. Eliminates repetition across 15+ screens. |
| Card component | Used on DietTodayScreen, DietHistoryScreen, and any summary view; must be consistent | LOW | `<Card>` with `padding`, `shadow.sm`, `radius.lg`. Accepts children. Optionally `pressable` for tappable cards. |
| Icon wrapper | Currently `react-native-vector-icons` called directly with size/color scattered across files | LOW | `<Icon name="" size="" color="">` wrapper that defaults to token-based sizes and colors. Prevents unintentional 1px drift. |
| Loading/skeleton states | Data screens (history, today) fetch from AsyncStorage; flash of empty content feels broken | MEDIUM | Skeleton placeholder using `Animated` opacity pulse. Not a third-party library — a simple animated View with token background. |
| Empty state component | History has no meals, fitness tab is sparse — empty state is either invisible (bad) or jarring (bad) | LOW | `<EmptyState icon title message>` component. Used wherever a list or data section can be empty. |
| Color palette (documented hex values) | Without explicit brand colors with light/dark variants, designers and developers diverge | LOW | See Color Palette section below for full palette recommendation. |
| Font loaded + exported | Without a shared font constant, typos in `fontFamily` strings silently fall back to system font | LOW | `typography.fontFamily.sans = 'Inter'` (or chosen font). One source of truth. One `loadAsync` call in App entry. |

### Differentiators (What Separates Great from Mediocre)

These are the features that distinguish a design system built for macromaker specifically — a data-forward, precision-tracking app — from a generic component kit.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Tabular-numeral text variant | Calorie and macro numbers change constantly; proportional figures cause layout jitter as digits update. Tabular figures (`fontVariant: ['tabular-nums']` in React Native) keep columns and counts visually stable. | LOW | Special `<NumericText>` or `<DataLabel>` component with `fontVariant: ['tabular-nums']` baked in. Used for all macro/calorie displays. This is the single highest-ROI typography detail for a data app. |
| Macro-specific color semantics | Carbs, protein, and fat need consistent colors across every graph, label, and bar. Today those colors live only in D3 components. | LOW | Add semantic tokens: `colors.macro.carbs`, `colors.macro.protein`, `colors.macro.fat`. These feed both the typography labels and the D3 graph fills. One change updates all representations. |
| Progress bar / ring component | Macro progress (carbs consumed vs. target) is the core daily UI. It deserves a purpose-built component, not a raw View with a hardcoded width calculation. | MEDIUM | `<MacroProgressBar macro="carbs" value={120} target={250}>`. Animates fill on mount using `Animated.timing`. Uses macro semantic color tokens. |
| "Remaining" callout display | "X calories remaining today" is the most checked number. It deserves a distinct visual treatment — larger, higher contrast, near the top of the diet tab. | LOW | `<CalorieSummary consumed target>` renders two numbers: the consumed count (smaller, muted) and the remaining count (larger, primary). Uses `NumericText` for both. |
| Consistent data-density hierarchy | Fitness data apps suffer from either "too sparse" (wastes screen real estate) or "too dense" (overwhelming). The design system should define a "data card" pattern with header, primary metric, and secondary rows. | MEDIUM | Document and componentize the `DataCard` pattern: header label (caption), primary number (display/title size), supporting rows (body/label size). This is the template for the diet summary, history cards, and future fitness cards. |
| Section header component | DietTodayScreen and DietHistoryScreen have meal lists with implicit sections. A shared `<SectionHeader label>` unifies the visual rhythm. | LOW | Simple: label (overline/caption text, uppercase, tracking 0.8), optional right-side action link. Reused across tabs. |
| Neutral, data-respecting palette | Most fitness apps default to green/black (energy, performance) or garish gradients. macromaker is a precision tool — it should feel like a well-designed spreadsheet or dashboard. Slate + a single warm accent communicates precision + approachability. | LOW | See Color Palette section. Not green, not neon, not aggressive. |
| Token export as typed TS constants | Most design system implementations use JS objects. Exporting with `as const` and inferring types gives autocomplete on every token at the call site. | LOW | `export const spacing = { 4: 4, 8: 8, ... } as const; export type SpacingKey = keyof typeof spacing;` Catches typos at compile time. |
| Component prop validation via TypeScript | Ad-hoc components accept `any` for style. A proper design system validates variant strings and size keys via union types. | LOW | `type ButtonVariant = 'primary' \| 'secondary' \| 'ghost'; type ButtonSize = 'sm' \| 'md' \| 'lg';`. TS errors on invalid props — better than runtime failures. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Dark mode | Every modern app does dark mode; it feels like table stakes | macromaker is light mode only by design decision. Implementing dark mode requires semantic token indirection, conditional theme context, and testing every screen in two modes. That doubles the QA surface for a solo app with no stated requirement. | Defer to v2+. Design tokens should be structured to make dark mode addable later (semantic layer), but do not implement or test it in this milestone. |
| Third-party component library (Gluestack, Tamagui) | Pre-built components look polished and fast to integrate | macromaker already chose `react-native-paper`. Layering another system creates conflicts. More importantly, a custom token system over React Native primitives gives complete control and zero peer-dep risk. The app has modest component needs — no data table, no complex form. | Build the 8-10 components the app actually uses. Thin, typed, owned. |
| Storybook or design system docs site | "Document the design system properly" | Storybook RN support requires separate metro config and has a history of tooling issues. Maintaining a docs site for a solo app is busywork. | README in `src/design-system/` documenting tokens and usage. Component files are self-documenting via TypeScript props. |
| Animation on every interaction | Feels polished; every tap and transition animated | Over-animation slows perceived performance and trains users to wait. The Reanimated v3 dependency should be reserved for intentional, meaningful animations (macro bar fill on load, screen transition on onboarding) — not for every button press ripple. | Animate: macro progress fill, onboarding screen transitions. Do not animate: navigation tabs, list item taps, button press. |
| Complex theming context | ThemeProvider, useTheme, ThemeContext — the full React Context theming pattern | For a single-theme app (light only), passing theme through context adds indirection with zero payoff. Every component must now import `useTheme`. | Import token constants directly. If dark mode is added later, the semantic token layer makes the switch clean. Token files are the source of truth, not a context. |
| Responsive/adaptive layout system | Mobile best practice from web world | React Native apps target phone screens with a known density range. Breakpoints and fluid grids are web concepts. The 8pt grid + max-width containers are sufficient. Fluid typography is overkill for a small phone app. | Use fixed spacing tokens. Test on one small screen (iPhone SE: 375pt) and one large (iPhone 15 Pro Max: 430pt). That covers 90% of the install base. |
| Icon system with custom SVGs | Brand identity via custom icons | React Native Vector Icons is already installed, working, and provides 1000+ icons. Custom SVG icons require source files, react-native-svg pipeline, and future maintenance. | Use Ionicons (already in `Info.plist`). Define an `Icon` wrapper component with consistent default sizing. No custom SVGs unless a specific icon is clearly missing. |
| CSS-in-JS / Styled Components | Familiar from web React; "cleaner" API | Runtime style computation has measurable overhead in React Native. `StyleSheet.create` is pre-registered and more performant. styled-components adds bundle weight and a JSX transform. | `StyleSheet.create` + design token constants. The right abstraction for React Native. |

---

## Color Palette Recommendation

### Direction

macromaker's Notion/Linear aesthetic calls for a **slate-primary, warm-accent** palette. Rationale:

- **Slate** (blue-gray family): communicates precision, data, and calm — appropriate for a tracking tool where users look at numbers daily. Avoids the clichéd fitness-green while remaining neutral enough to not compete with macro color coding.
- **Warm accent** (orange or amber): provides the energy and call-to-action differentiation that pure slate/gray lacks. Orange is universally associated with action and achievment. It is not purple (macromaker's prior accent per v1.0 codebase at `#7078df`) — changing to a non-blue accent creates clear distinction between brand chrome and the informational blue in graphs.
- **Three macro colors**: must be visually distinct from each other, from the brand accent, and from neutral backgrounds. Muted but legible.

### Proposed Palette with Hex Values

**Primitives (raw values)**

| Name | Hex | Notes |
|------|-----|-------|
| `slate[50]` | `#F8FAFC` | Page background |
| `slate[100]` | `#F1F5F9` | Subtle surface, input background |
| `slate[200]` | `#E2E8F0` | Borders, dividers |
| `slate[400]` | `#94A3B8` | Placeholder text, disabled |
| `slate[600]` | `#475569` | Secondary text, captions |
| `slate[800]` | `#1E293B` | Primary text, headings |
| `slate[900]` | `#0F172A` | Maximum contrast (use sparingly) |
| `orange[400]` | `#FB923C` | Accent hover/secondary state |
| `orange[500]` | `#F97316` | Primary brand accent — CTAs, progress fills |
| `orange[600]` | `#EA580C` | Accent pressed state |
| `orange[50]` | `#FFF7ED` | Accent tinted surface |
| `red[400]` | `#F87171` | Error states, destructive actions |
| `red[50]` | `#FEF2F2` | Error surface tint |
| `green[500]` | `#22C55E` | Success states only |
| `white` | `#FFFFFF` | Card background, modal background |

**Macro-specific colors** (used consistently across graphs, labels, and progress bars)

| Name | Hex | Notes |
|------|-----|-------|
| `macro.carbs` | `#60A5FA` | Blue — calm, carbohydrate-associated with energy |
| `macro.protein` | `#A78BFA` | Violet — distinct from carbs and fat, associated with muscle |
| `macro.fat` | `#FBBF24` | Amber — warm, visually distinct from blue/violet |

**Semantic tokens (how primitives are used)**

| Token | Maps to | Purpose |
|-------|---------|---------|
| `colors.background.page` | `slate[50]` | App background |
| `colors.background.card` | `white` | Card/surface background |
| `colors.background.subtle` | `slate[100]` | Input fills, chip backgrounds |
| `colors.border.default` | `slate[200]` | Dividers, input borders |
| `colors.border.focus` | `orange[500]` | Input focused border |
| `colors.text.primary` | `slate[800]` | Headings, body |
| `colors.text.secondary` | `slate[600]` | Labels, descriptions |
| `colors.text.placeholder` | `slate[400]` | Input placeholders |
| `colors.text.disabled` | `slate[400]` | Disabled controls |
| `colors.text.onAccent` | `white` | Text on orange buttons |
| `colors.brand.accent` | `orange[500]` | Primary CTAs, active tab indicator |
| `colors.brand.accentSubtle` | `orange[50]` | Tinted backgrounds near accent |
| `colors.status.error` | `red[400]` | Validation errors |
| `colors.status.errorSurface` | `red[50]` | Error input background tint |
| `colors.status.success` | `green[500]` | Positive feedback |

### Why Not Other Palettes

| Palette | Why Rejected |
|---------|-------------|
| Green + black (classic fitness) | Clichéd, used by every gym app since 2012. macromaker is a precision tool, not a workout motivator. |
| Purple (`#7078df`, prior accent) | Prior brand color was purple from the @rneui era. It reads as "tech product" or "meditation app." No strong association with nutrition tracking. Not distinct enough from macro.protein violet. |
| Red primary | Red is reserved for error/destructive semantics. A red brand creates constant semantic ambiguity. |
| Teal/mint | Overused in health/wellness apps. Associates with medical/clinical rather than personal tracking. |
| Indigo/blue primary | Blends with `macro.carbs` blue. When the brand color and a data color are both blue, graphs and UI chrome compete. |

---

## Typography Recommendation

### Font: Inter

**Recommendation: Inter (Google Fonts, SIL Open Font License)**

Rationale:
- **Tabular numerals**: Inter has a full OpenType `tnum` feature. In React Native, `fontVariant: ['tabular-nums']` activates fixed-width digits, preventing layout shift when calorie/macro counts update. This is the most important typographic feature for a data app.
- **Designed for screens**: Rasmus Andersson built Inter specifically for UI interfaces, not for print. Tall x-height, open apertures, and careful hinting at small sizes.
- **18 weights**: Covers all hierarchy needs — Light (300), Regular (400), Medium (500), SemiBold (600), Bold (700). No faux-bold.
- **Variable font**: Inter ships as a variable font (Inter Variable), which is a single font file covering all weights. Smaller bundle than loading 5 separate weight files.
- **Breadth of use**: Used by Linear, Vercel, GitHub, Notion (body), and hundreds of major products. No exotic rendering surprises.
- **Google Fonts / open license**: Free, stable, well-maintained.

**Alternative considered: DM Sans** — Geometric with lower-contrast stroke, slightly warmer than Inter. Good for headings. Weaker numeric rendering; fewer weights. Acceptable second choice if Inter feels too utilitarian.

**Alternative considered: Plus Jakarta Sans** — Humanist warmth, 8 weights, good hierarchy. Less common on data-dense interfaces. Better for marketing than for tracking apps.

**Not recommended: system fonts (SF Pro, Roboto)** — Per-platform inconsistency makes the brand feel unfinished across iOS and Android.

### Typography Scale

Base: 16sp iOS / 16sp Android. Scale factor: Major Third (1.25×), with manual adjustments for mobile legibility.

| Token | Size (sp/pt) | Weight | Line Height | Letter Spacing | Use |
|-------|-------------|--------|-------------|----------------|-----|
| `type.display` | 32 | Bold 700 | 40 | -0.5 | Large calorie totals (today summary) |
| `type.heading` | 24 | SemiBold 600 | 32 | -0.3 | Screen titles, section headings |
| `type.title` | 20 | SemiBold 600 | 28 | -0.2 | Card titles, modal headings |
| `type.body` | 16 | Regular 400 | 24 | 0 | Body text, input content |
| `type.bodyMedium` | 16 | Medium 500 | 24 | 0 | Emphasized body, list item names |
| `type.label` | 14 | Medium 500 | 20 | 0.1 | Button text, input labels, tab labels |
| `type.caption` | 12 | Regular 400 | 16 | 0.2 | Secondary info, timestamps, unit labels |
| `type.overline` | 11 | SemiBold 600 | 16 | 0.8 | Section headers in uppercase (e.g., "TODAY'S MACROS") |

**Numeric display pattern** (for calorie totals, macro grams, BMR/TDEE values):
- Use `type.display` or `type.heading`
- Add `fontVariant: ['tabular-nums']`
- Consider `fontFeatureSettings: "'tnum' 1"` as a fallback

---

## Spacing Scale Recommendation

### Scale: 8pt Base with 4pt Half-Step

The 8pt grid is the iOS Human Interface Guidelines-aligned standard. Multiples of 8 divide cleanly into common screen widths and pixel densities (1x, 2x, 3x).

| Token | Value (pt) | Typical Use |
|-------|-----------|-------------|
| `spacing[1]` | 4 | Icon internal padding, chip inner padding, list item indicator |
| `spacing[2]` | 8 | Tight padding between related elements (label to input) |
| `spacing[3]` | 12 | Compact padding inside cards, between caption and body |
| `spacing[4]` | 16 | Standard horizontal screen padding, button vertical padding |
| `spacing[5]` | 20 | Comfortable card padding, form field bottom margin |
| `spacing[6]` | 24 | Section spacing between major groups |
| `spacing[8]` | 32 | Large section gap, above screen title |
| `spacing[10]` | 40 | Bottom tab safe area padding, modal top padding |
| `spacing[12]` | 48 | Minimum touchable target height (Apple HIG: 44pt) |
| `spacing[16]` | 64 | Hero section spacing, prominent blank space |

**Layout constants** (not part of the spacing scale, but defined alongside it):

| Constant | Value | Use |
|----------|-------|-----|
| `layout.screenHorizontalPadding` | 16 | Horizontal padding applied to every screen |
| `layout.cardBorderRadius` | 12 | Standard card rounding |
| `layout.inputHeight` | 48 | All text inputs — meets minimum touch target |
| `layout.buttonHeightMd` | 48 | Standard button height |
| `layout.buttonHeightSm` | 36 | Compact button height |
| `layout.tabBarHeight` | 56 | Bottom tab bar height (excluding safe area) |

---

## Feature Dependencies

```
Design token system (colors, spacing, typography, radius, shadow)
    └──required by──> All components
                          └──required by──> Screen redesign

Typography tokens
    ├──requires──> Inter font loaded (Expo Font / RN font linking)
    └──required by──> Text/Heading/Caption components
                          └──required by──> Every screen

Macro color tokens
    ├──required by──> MacroProgressBar component
    ├──required by──> D3 graph fill colors (BarGraph, TotalCaloriesGraph)
    └──required by──> Macro label text colors

NumericText component (tabular numerals)
    ├──requires──> Typography tokens
    └──required by──> CalorieSummary, MacroProgressBar, HistoryCard

Button component
    ├──requires──> Color tokens (brand.accent, text.onAccent)
    ├──requires──> Spacing tokens (buttonHeight)
    └──required by──> All onboarding CTAs, AddFood, EditFood

TextInput component
    ├──requires──> Color tokens (border.default, border.focus, status.error)
    ├──requires──> Spacing tokens (inputHeight)
    └──required by──> BasicInfoScreen, AddFoodScreen, EditFoodScreen

Card component
    ├──requires──> Color tokens (background.card)
    ├──requires──> Spacing tokens (cardBorderRadius, screenHorizontalPadding)
    └──required by──> DietTodayScreen, DietHistoryScreen
```

### Dependency Notes

- **Token system must come first**: Every component depends on tokens. Tokens are Phase 1.
- **Font loading is a prerequisite for Typography**: Inter must be linked/loaded before any component uses it. This is a native step (pod install on iOS, font file linking on Android) that can block other work if discovered late.
- **Macro colors are shared across UI and D3**: The same `colors.macro.*` tokens must feed both the component layer (labels, progress bars) and the existing D3 graph components. This ensures visual consistency without duplicating color decisions.
- **NumericText is a quick win with high payoff**: Once the token system exists, `NumericText` is a 20-line component that immediately improves every data display. Do it early.

---

## MVP Definition for This Milestone

### Launch With (milestone complete when)

- [ ] Token system complete: `src/tokens/colors.ts`, `src/tokens/typography.ts`, `src/tokens/spacing.ts`, `src/tokens/radius.ts`, `src/tokens/shadows.ts`
- [ ] Inter font loaded and exported as the `typography.fontFamily.sans` constant
- [ ] Core components built: `Button`, `TextInput`, `Card`, `Heading`/`Body`/`Caption` text variants, `NumericText`, `Icon` wrapper, `EmptyState`, `SectionHeader`
- [ ] `MacroProgressBar` component consuming `colors.macro.*` tokens
- [ ] All existing screens updated to consume tokens and core components (no more hardcoded hex, no more inline `fontSize`)
- [ ] D3 graph components updated to use `colors.macro.*` tokens for fills

### Add After Validation (v1.x)

- [ ] `DataCard` pattern documented and extracted as a reusable component if the pattern recurs
- [ ] `CalorieSummary` component (consumed vs. remaining callout) — builds on `NumericText` and token system
- [ ] Loading skeleton component (animated placeholder for async data)
- [ ] Shadow tokens applied to Cards (validate they look correct on both iOS and Android before committing)

### Future Consideration (v2+)

- [ ] Dark mode — semantic token layer makes this achievable; defer until demand is clear
- [ ] `react-native-reanimated` macro progress bar fill animation — Reanimated is installed; animation is polish, not function
- [ ] Storybook component catalog — only valuable if the design system grows to 30+ components or multiple contributors

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Color token system | HIGH | LOW | P1 |
| Typography scale + Inter font | HIGH | LOW | P1 |
| Spacing scale | HIGH | LOW | P1 |
| Button component | HIGH | LOW | P1 |
| TextInput component | HIGH | LOW | P1 |
| Text variant components | HIGH | LOW | P1 |
| Card component | HIGH | LOW | P1 |
| NumericText (tabular numerals) | HIGH | LOW | P1 |
| Macro color tokens | HIGH | LOW | P1 |
| MacroProgressBar component | HIGH | MEDIUM | P1 |
| Apply system to all screens | HIGH | MEDIUM | P1 |
| Update D3 graphs to use macro tokens | MEDIUM | LOW | P1 |
| Icon wrapper component | MEDIUM | LOW | P2 |
| EmptyState component | MEDIUM | LOW | P2 |
| SectionHeader component | MEDIUM | LOW | P2 |
| CalorieSummary component | MEDIUM | LOW | P2 |
| Loading skeleton | LOW | MEDIUM | P2 |
| Shadow token application | LOW | LOW | P2 |
| Dark mode | HIGH | HIGH | P3 |
| Animated progress bar fill | MEDIUM | MEDIUM | P3 |
| Component documentation site | LOW | HIGH | P3 |

**Priority key:**
- P1: Required for design system milestone to be complete
- P2: High value, add within this milestone if time permits
- P3: Defer — not needed for this milestone

---

## Competitor Design System Analysis

Analysis of what well-regarded fitness/data apps do at the design system level:

| Design Concern | Strong (weightlifting) | Linear (product/reference) | Notion (product/reference) | macromaker approach |
|----------------|------------------------|---------------------------|---------------------------|---------------------|
| Color palette | Dark background, green + blue data colors | Slate/gray neutral, purple accent | Off-white, black/gray primary, no saturated accent | Slate neutral + orange accent — avoids both the gym-dark and the SaaS-purple |
| Typography | System font (SF Pro), large numbers prominent | Custom (Linear Grotesk), tight tracking | System/custom, generous line height | Inter — purpose-built for UI, strong numerics |
| Numeric display | Large, bold, tabular | Data tables use tabular figures | Not data-primary | `NumericText` component with tabular numerals throughout |
| Data density | High density, information per pixel maximized | Moderate density, whitespace for scan | High whitespace, task-oriented | Moderate density — enough whitespace to be readable, enough data to be useful in one glance |
| Spacing | Tight — efficiency for gym context | Generous — productivity app rhythm | Very generous — reading-oriented | 8pt grid, `spacing[4]` (16pt) as the base padding unit |
| Macro/category colors | Not applicable | Categorical colors for issue status | Not applicable | Dedicated `colors.macro.*` tokens: blue (carbs), violet (protein), amber (fat) |

---

## Sources

- [Inter font — official site](https://rsms.me/inter/) — HIGH confidence; official documentation of tabular numerals and OpenType features
- [Inter on Google Fonts](https://fonts.google.com/specimen/Inter) — HIGH confidence; canonical source for license and download
- [8pt Grid System — spec.fm](https://spec.fm/specifics/8-pt-grid) — HIGH confidence; foundational reference, widely cited by iOS/Android designers
- [Cieden — Spacing Best Practices](https://cieden.com/book/sub-atomic/spacing/spacing-best-practices) — MEDIUM confidence; design system reference, patterns consistent with Apple HIG
- [UXmatters — Color Psychology in Health/Wellness Apps](https://www.uxmatters.com/mt/archives/2024/07/leveraging-the-psychology-of-color-in-ux-design-for-health-and-wellness-apps.php) — MEDIUM confidence; UX research publication, 2024
- [App Color Trends 2025 — Medium/HuedServe](https://medium.com/@huedserve/app-color-trends-2025-fresh-palettes-to-elevate-your-design-bbfe2e40f8f1) — LOW confidence; single author, directionally useful
- [decode.agency — How to Choose Color Palette for Apps](https://decode.agency/article/choose-color-palette-for-apps/) — MEDIUM confidence; agency blog, practical guidance
- [Stormotion — Fitness App UX Principles](https://stormotion.io/blog/fitness-app-ux/) — MEDIUM confidence; mobile development agency, consistent with other sources
- [creatype studio — Best Fonts for Mobile App Design 2025](https://creatypestudio.co/best-fonts-for-mobile-app-design/) — LOW confidence; validates Inter recommendation
- [Toptal — Typography for Mobile Apps](https://www.toptal.com/designers/typography/typography-for-mobile-apps) — MEDIUM confidence; established platform, practical guidance
- [React Native StyleSheet docs](https://reactnative.dev/docs/stylesheet) — HIGH confidence; official RN documentation
- [Martin Fowler — Design Token-Based UI Architecture](https://martinfowler.com/articles/design-token-based-ui-architecture.html) — HIGH confidence; authoritative reference
- [Material Design 3 — Design Tokens](https://m3.material.io/foundations/design-tokens) — HIGH confidence; Google's official token architecture reference

---

*Feature research for: macromaker v1.1 — Design System & Branding*
*Researched: 2026-03-14*
