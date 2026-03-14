# Architecture Research

**Domain:** Design system integration into an existing bare React Native app (react-native-paper + custom components)
**Researched:** 2026-03-14
**Confidence:** HIGH — react-native-paper docs verified via official source; font integration pattern verified via LogRocket official guide; token/theme architecture from multiple verified sources.

---

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     App Entry (App.tsx)                       │
│  GestureHandlerRootView → PaperProvider → SafeAreaProvider   │
│              PaperProvider receives: theme object             │
│         theme = { ...MD3LightTheme, colors, fonts }          │
│         theme.colors <- derived from tokens/colors.ts        │
│         theme.fonts  <- derived from tokens/typography.ts    │
├──────────────────────────────────────────────────────────────┤
│                   Design Token Layer                          │
│  design/                                                      │
│  ├── tokens/                                                  │
│  │   ├── colors.ts     <- primitive + semantic palettes       │
│  │   ├── spacing.ts    <- 4pt grid scale                     │
│  │   ├── typography.ts <- font families, scale, weight map   │
│  │   ├── radius.ts     <- border radius scale                │
│  │   └── shadows.ts    <- elevation/shadow presets           │
│  └── theme/                                                   │
│      ├── paperTheme.ts <- MD3 theme built from tokens        │
│      └── useAppTheme.ts <- typed hook: useTheme<AppTheme>()  │
├──────────────────────────────────────────────────────────────┤
│                 Component Library Layer                       │
│  design/components/                                           │
│  ├── Button.tsx        <- wraps TouchableOpacity, token-styled│
│  ├── Card.tsx          <- surface wrapper                    │
│  ├── Input.tsx         <- wraps TextInput, token-styled      │
│  ├── Text.tsx          <- typography variant component       │
│  └── index.ts          <- barrel export                      │
├──────────────────────────────────────────────────────────────┤
│                  Existing Screen Layer                        │
│  screens/ <- existing screens; progressively migrated        │
│  components/ <- existing shared components (D3 graphs, etc.) │
│  navigation/ <- navigator files; headerStyle from tokens     │
└──────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `design/tokens/colors.ts` | Single source of truth for all color values | Exported plain TS object; primitives (`palette`) + semantic (`colors`) |
| `design/tokens/typography.ts` | Font family, size scale, weight map | Exported TS object; feeds both paper `configureFonts` and custom `Text` component |
| `design/tokens/spacing.ts` | Spacing scale (4pt grid) | Numeric object: `{ xs: 4, sm: 8, md: 16, lg: 24, xl: 32 }` |
| `design/tokens/radius.ts` | Border radius presets | Numeric object: `{ sm: 4, md: 8, lg: 12, full: 9999 }` |
| `design/tokens/shadows.ts` | Platform-aware shadow/elevation presets | iOS shadow props + Android elevation, keyed by level |
| `design/theme/paperTheme.ts` | MD3 theme object for PaperProvider | Spreads `MD3LightTheme`; overrides `colors` and `fonts` from tokens |
| `design/theme/useAppTheme.ts` | Typed theme hook | `export const useAppTheme = () => useTheme<AppTheme>()` |
| `design/components/Text.tsx` | Typography variant component | Variant prop maps to typography scale; renders RN `Text` with token styles |
| `design/components/Button.tsx` | Primary app button | Reads tokens directly; not a paper `Button` wrapper (avoids ripple behavior conflicts) |
| `design/components/Input.tsx` | Form text input | Wraps RN `TextInput` with token border/background/font styles |
| `design/components/Card.tsx` | Surface/container component | `View` with token background, radius, and shadow |

---

## Recommended Project Structure

```
macromaker/
├── design/                       # All design system files — new directory
│   ├── tokens/
│   │   ├── colors.ts             # Primitive palette + semantic color map
│   │   ├── spacing.ts            # 4pt grid spacing scale
│   │   ├── typography.ts         # Font families, size scale, weights, line heights
│   │   ├── radius.ts             # Border radius scale
│   │   ├── shadows.ts            # Platform shadow/elevation presets
│   │   └── index.ts              # Barrel: export * from each token file
│   ├── theme/
│   │   ├── paperTheme.ts         # MD3 theme built from tokens for PaperProvider
│   │   ├── AppTheme.ts           # Type: export type AppTheme = typeof paperTheme
│   │   └── useAppTheme.ts        # Hook: useTheme<AppTheme>()
│   └── components/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Text.tsx
│       └── index.ts              # Barrel export
├── assets/
│   └── fonts/                    # Brand font TTF/OTF files live here
│       ├── Inter-Regular.ttf     # (exact filename = fontFamily value in typography.ts)
│       ├── Inter-Medium.ttf
│       ├── Inter-SemiBold.ttf
│       └── Inter-Bold.ttf
├── react-native.config.js        # Points assets: ['./assets/fonts'] for linking
├── components/                   # Existing shared components (D3 graphs, etc.) — unchanged
├── constants/                    # Existing Colors.ts, Layout.ts — deprecated gradually
│   ├── Colors.ts                 # Keep during migration; shim pointing to design/tokens
│   └── Layout.ts
├── screens/                      # Existing screens — progressively re-skinned
├── navigation/                   # Existing navigators — header styles from tokens
├── context/                      # Existing contexts — unchanged
└── App.tsx                       # Updated: pass paperTheme from design/theme/paperTheme.ts
```

### Structure Rationale

- **`design/` at root:** Peer-level with `components/` and `screens/`, not buried in a subdirectory. Signals first-class status. Short import paths (`../../design/tokens`).
- **`design/tokens/` separate from `design/theme/`:** Tokens are raw values with no library coupling. Theme is the adapter that translates tokens into react-native-paper's MD3 shape. This separation means tokens can be consumed by custom components without importing paper.
- **`design/components/` separate from root `components/`:** Root `components/` holds existing D3 graph components that are domain-specific and are not part of the design system. `design/components/` holds primitive UI building blocks that consume tokens directly.
- **`assets/fonts/` at root:** Standard bare RN convention. `react-native-asset` and `react-native.config.js` point here. Xcode "Copy Bundle Resources" and Android `android/app/src/main/assets/fonts/` are populated by the link command.
- **`constants/Colors.ts` preserved during migration:** Existing files reference it. Add a re-export shim pointing to the token file, then delete after all screens are migrated.

---

## Architectural Patterns

### Pattern 1: Tokens as the Single Source of Truth

**What:** All color, spacing, typography, radius, and shadow values live in `design/tokens/`. Neither `paperTheme.ts` nor any component hard-codes a raw value — every value is imported from a token file.

**When to use:** Always. Every time a new value is needed, it goes into tokens first.

**Trade-offs:** One layer of indirection. Pays for itself when a brand color needs to change across 15 screens at once — one file edit, everything updates.

**Example:**
```typescript
// design/tokens/colors.ts
const palette = {
  indigo50:  '#EEF2FF',
  indigo600: '#4F46E5',
  indigo700: '#4338CA',
  neutral50:  '#F9FAFB',
  neutral200: '#E5E7EB',
  neutral500: '#6B7280',
  neutral900: '#111827',
  white: '#FFFFFF',
  errorRed: '#DC2626',
} as const;

export const colors = {
  primary:        palette.indigo600,
  primaryLight:   palette.indigo50,
  primaryPressed: palette.indigo700,
  surface:        palette.white,
  surfaceMuted:   palette.neutral50,
  border:         palette.neutral200,
  textPrimary:    palette.neutral900,
  textSecondary:  palette.neutral500,
  disabled:       palette.neutral200,
  disabledText:   palette.neutral500,
  error:          palette.errorRed,
  // Macro semantic colors — preserve existing identity
  carbs:    '#1854BD',
  protein:  '#982F2F',
  fat:      '#B59B46',
} as const;

export type Colors = typeof colors;
```

### Pattern 2: Token-Derived Paper Theme

**What:** `design/theme/paperTheme.ts` constructs the MD3 theme object by reading from tokens. `App.tsx` passes this to `PaperProvider`. Paper components (`Searchbar`, `TextInput` in paper mode) automatically pick up the brand colors through React context. Custom components read tokens directly — not via paper's theme hook.

**When to use:** This is the permanent architecture. Paper components are themed via `PaperProvider`; custom components consume tokens directly. Both derive from the same token source. There is no conflict.

**Trade-offs:** Paper's MD3 color roles (`primary`, `secondary`, `surface`, `onSurface`, etc.) do not map 1:1 to every custom semantic token. Some paper roles will use the closest-fit token. Document any mismatches in a comment in `paperTheme.ts`.

**Example:**
```typescript
// design/theme/paperTheme.ts
import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';

const fontConfig = {
  fontFamily: typography.fontFamily.regular,
};

export const paperTheme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary:     colors.primary,
    onPrimary:   colors.white,
    secondary:   colors.carbs,       // MD3 secondary maps to nearest accent
    surface:     colors.surface,
    onSurface:   colors.textPrimary,
    background:  colors.surfaceMuted,
    error:       colors.error,
  },
  fonts: configureFonts({ config: fontConfig }),
} as const;

export type AppTheme = typeof paperTheme;
```

```typescript
// design/theme/useAppTheme.ts
import { useTheme } from 'react-native-paper';
import type { AppTheme } from './paperTheme';

export const useAppTheme = () => useTheme<AppTheme>();
```

```typescript
// App.tsx — updated
import { paperTheme } from './design/theme/paperTheme';

// Replace:
// const paperTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
// With:
// <PaperProvider theme={paperTheme}>
```

### Pattern 3: Variant-Based Typography Component

**What:** A `Text` component in `design/components/Text.tsx` accepts a `variant` prop mapped to the typography scale. All UI text in the app goes through this component instead of RN's raw `Text` or `components/Themed.tsx`'s `Text`. This is separate from react-native-paper's `Text` component — it provides the same variant system but is fully controlled by the app's typography tokens.

**When to use:** For all custom components and screens. Paper's own `Text` component (with its MD3 `variant` prop) can still be used inside paper components, but for all app-authored text, use this.

**Trade-offs:** One more component to maintain. Eliminates fontSize magic numbers scattered across every `StyleSheet` in the codebase. Payoff is immediate when the type scale needs a global adjustment.

**Example:**
```typescript
// design/tokens/typography.ts
export const typography = {
  fontFamily: {
    regular:  'Inter-Regular',
    medium:   'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold:     'Inter-Bold',
  },
  size: {
    xs:   11,
    sm:   12,
    md:   14,
    lg:   16,
    xl:   20,
    xxl:  24,
    xxxl: 32,
  },
  weight: {
    regular:  '400' as const,
    medium:   '500' as const,
    semibold: '600' as const,
    bold:     '700' as const,
  },
} as const;

export type TextVariant =
  | 'display'      // xxxl, bold
  | 'heading'      // xxl, semibold
  | 'subheading'   // lg, semibold
  | 'body'         // md, regular (default)
  | 'bodySmall'    // sm, regular
  | 'label'        // sm, medium
  | 'caption'      // xs, regular
  | 'numeric';     // xl, semibold — for calorie/macro numbers

export const textVariants: Record<TextVariant, {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700';
}> = {
  display:    { fontFamily: typography.fontFamily.bold,     fontSize: typography.size.xxxl, lineHeight: 38, fontWeight: typography.weight.bold },
  heading:    { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.xxl,  lineHeight: 29, fontWeight: typography.weight.semibold },
  subheading: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg,   lineHeight: 22, fontWeight: typography.weight.semibold },
  body:       { fontFamily: typography.fontFamily.regular,  fontSize: typography.size.md,   lineHeight: 20, fontWeight: typography.weight.regular },
  bodySmall:  { fontFamily: typography.fontFamily.regular,  fontSize: typography.size.sm,   lineHeight: 17, fontWeight: typography.weight.regular },
  label:      { fontFamily: typography.fontFamily.medium,   fontSize: typography.size.sm,   lineHeight: 17, fontWeight: typography.weight.medium },
  caption:    { fontFamily: typography.fontFamily.regular,  fontSize: typography.size.xs,   lineHeight: 15, fontWeight: typography.weight.regular },
  numeric:    { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.xl,   lineHeight: 24, fontWeight: typography.weight.semibold },
};
```

```typescript
// design/components/Text.tsx
import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { TextVariant, textVariants } from '../tokens/typography';

type Props = RNTextProps & {
  variant?: TextVariant;
};

export function Text({ variant = 'body', style, ...rest }: Props) {
  return <RNText style={[textVariants[variant], style]} {...rest} />;
}
```

### Pattern 4: Direct Token Import for Static Styling (No Hook Required)

**What:** Custom components and screens import from `design/tokens/` directly in `StyleSheet.create()`. They do NOT use `useTheme()` for values that are static (do not change at runtime). `useAppTheme()` is reserved for components that need paper-managed runtime state (which is minimal in a light-mode-only app).

**When to use:** For all custom styled components in v1.1. This avoids hook overhead for values that never change at runtime.

**Trade-offs:** If dark mode is added in a future milestone, components that statically import tokens will need to be updated to a theme hook that switches between token sets. This is an acceptable deferral — the migration is purely mechanical.

**Example:**
```typescript
// screens/AddFood/AddFoodScreen.tsx — after migration
import { colors, spacing, radius } from '../../design/tokens';

const styles = StyleSheet.create({
  addMealButton: {
    backgroundColor: colors.primary,    // was: '#7078df'
    borderRadius:    radius.md,          // was: 5
    padding:         spacing.md,         // was: 12
  },
  disabledAddMealButton: {
    backgroundColor: colors.disabled,   // was: '#c6c6c6'
  },
});
```

---

## Data Flow

### Token to Theme to Component Flow

```
design/tokens/colors.ts
design/tokens/typography.ts
        |
        | imported by
        v
design/theme/paperTheme.ts
        |
        | passed to
        v
PaperProvider (App.tsx)
        |
        | via React context
        v
Paper components: Searchbar, TextInput (paper mode)
        read theme.colors.primary, theme.fonts automatically


design/tokens/colors.ts     design/tokens/typography.ts
design/tokens/spacing.ts    design/tokens/radius.ts
        |
        | direct import (no hook)
        v
design/components/*.tsx
screens/**/*.tsx
navigation/*.tsx (header styles)
        |
        | StyleSheet.create() values derived from tokens
        v
Rendered UI
```

### Font Integration Flow

```
assets/fonts/*.ttf
        |
        | react-native.config.js { assets: ['./assets/fonts'] }
        | npx react-native-asset   (run once after adding fonts)
        v
iOS:     Info.plist UIAppFonts array populated automatically
         Xcode "Copy Bundle Resources" updated
Android: android/app/src/main/assets/fonts/ populated

        |
        | font files available to RN runtime
        v
typography.ts fontFamily values reference exact filename (sans extension)
        |
        v
configureFonts({ config: { fontFamily: 'Inter-Regular' } })  in paperTheme.ts
design/components/Text.tsx uses fontFamily from typography tokens
screens use fontFamily from textVariants
```

### Key Data Flows

1. **New token value, applied everywhere:** Change one value in `design/tokens/colors.ts` — all `StyleSheet` references update on next build. No grep-and-replace across screens.
2. **Paper component theming:** `App.tsx` passes `paperTheme` to `PaperProvider` — `Searchbar` and `TextInput` (paper) in `AddFoodScreen` pick up `primary` color without any per-component changes.
3. **Screen migration:** Replace hard-coded hex/number literals in `StyleSheet.create()` with token imports — no context, no hook, no new component needed.

---

## Integration Points

### New vs. Modified: Explicit Breakdown

#### New Files (create from scratch)

| File | What It Does |
|------|--------------|
| `design/tokens/colors.ts` | Brand palette + semantic color map |
| `design/tokens/spacing.ts` | 4pt spacing scale |
| `design/tokens/typography.ts` | Font config, size scale, variant map |
| `design/tokens/radius.ts` | Border radius presets |
| `design/tokens/shadows.ts` | Shadow/elevation presets |
| `design/tokens/index.ts` | Barrel export for all tokens |
| `design/theme/paperTheme.ts` | MD3 theme object built from tokens |
| `design/theme/useAppTheme.ts` | Typed `useTheme<AppTheme>()` hook |
| `design/components/Text.tsx` | Variant-based typography component |
| `design/components/Button.tsx` | Token-styled button component |
| `design/components/Card.tsx` | Token-styled surface/card component |
| `design/components/Input.tsx` | Token-styled TextInput wrapper |
| `design/components/index.ts` | Barrel export for all design components |
| `react-native.config.js` | Font asset linking config |
| `assets/fonts/*.ttf` | Brand font files |

#### Modified Files (existing, targeted changes)

| File | What Changes |
|------|--------------|
| `App.tsx` | Replace `MD3LightTheme` with `paperTheme` from `design/theme/paperTheme.ts`; remove `colorScheme`-based theme switching for v1.1 light-only scope |
| `screens/AddFood/AddFoodScreen.tsx` | Replace hard-coded hex/size values in `StyleSheet` with token imports; replace `TouchableOpacity`+inline-styles button with `design/components/Button` |
| `screens/InfoModal/screens/BasicInfoScreen.tsx` | Replace `#7078df`, `#c6c6c6`, font sizes, border radii with token imports |
| `screens/InfoModal/screens/MoreInfoScreen.tsx` | Same token migration |
| `screens/InfoModal/screens/WelcomeScreen.tsx` | Same token migration |
| `screens/Diet/DietHistoryScreen.tsx` | Same token migration |
| `screens/Diet/screens/Today/DietTodayScreen.tsx` | Replace hardcoded macro colors (`'#1854bd'`, etc.) with `colors.carbs`, `colors.protein`, `colors.fat` |
| `screens/FitnessScreen.tsx` | Same token migration |
| `navigation/BottomTabNavigator.tsx` | Replace `Colors[colorScheme].tint` with `colors.primary`; apply token-based `screenOptions` for header styling |
| `components/Themed.tsx` | Redirect color lookup to `design/tokens/colors`; simplify or deprecate (the design system `Text` replaces `Themed.Text`) |
| `components/StepIndicator.tsx` | Replace hard-coded color with `colors.primary` |
| `constants/Colors.ts` | Add re-export shim pointing to `design/tokens/colors.ts`; delete after all screens migrated |

#### Unchanged Files (no action needed for design system)

| Files | Why Left Alone |
|-------|----------------|
| `components/BarGraph/`, `components/MealTimeGraph/`, `components/TotalCaloriesGraph/` | D3 graph components; style logic is tied to D3 scales and SVG. Macro colors are migrated to token references, but graph structure stays intact. |
| `context/`, `utils.ts`, `types.tsx` | Business logic only; zero styling. |
| `hooks/useColorScheme.ts` | Retained; will support future dark mode even if not used in v1.1. |
| `constants/Layout.ts` | Window dimension logic; used by graph sizing. Not part of design token scope. |

---

### react-native-paper Coexistence

Tokens are upstream of both paper and custom components. There is no conflict between the systems:

```
tokens/    (single source of truth — no library dependency)
    |
    ├──> paperTheme.ts  ──> PaperProvider  ──> Paper components
    |                                          (Searchbar, TextInput)
    |
    └──> direct import  ──> Custom components
                            (Button, Card, Input, Text)
                            Screens (StyleSheet.create)
                            Navigation (headerStyle)
```

**Paper components in the current codebase:**
- `Searchbar` in `AddFoodScreen` — themed via `PaperProvider`; no per-component change needed once `paperTheme.colors.primary` is set from tokens.
- `TextInput` (paper, `mode="flat"`) in `AddFoodScreen` — same.

**TypeScript-safe custom token access via paper context (HIGH confidence — official docs):**
React Native Paper explicitly supports adding custom properties to the theme. Export `type AppTheme = typeof paperTheme` and use `useAppTheme()` anywhere the paper context is needed to access a custom token. For `StyleSheet.create()` usage (the common case), import tokens directly.

**Do NOT use raw `useTheme()` from paper without the `AppTheme` generic.** TypeScript will not know about any tokens added beyond the standard MD3 spec. Always use the typed `useAppTheme()` hook when accessing the paper context.

---

## Scaling Considerations

This is a single-device local app. Scaling here means design system maintainability as the app grows, not traffic.

| Scale | Architecture Adjustment |
|-------|------------------------|
| v1.1: light mode only | Direct token imports in `StyleSheet.create()`; no theme hook needed for custom components. Paper handles its own theme. |
| Future: dark mode | Promote token files to a `useTokens()` hook that selects light vs. dark token sets at runtime. Custom components swap from static imports to hook calls. Paper handles dark mode automatically via `MD3DarkTheme` swap in `paperTheme.ts`. |
| Future: multi-theme / brand variants | `ThemeContext` selects between named token objects. Components resolve tokens at render time rather than module-load time. |

### Scaling Priority

1. **First friction:** Migrating ~15 `StyleSheet` files from hard-coded literals to token imports. Mechanical work, zero architecture change, one screen at a time.
2. **Second friction:** Adding dark mode. The `useColorScheme` hook and paper's `MD3DarkTheme` already handle paper components. Custom components need their static token imports converted to a runtime hook that switches on color scheme.

---

## Anti-Patterns

### Anti-Pattern 1: Tokens Inside the Paper Theme Only

**What people do:** Add all custom values (`colors.primary`, `spacing.md`, etc.) directly inside the paper theme object and access them everywhere via `useTheme()`.

**Why it's wrong:** Creates a hard dependency on react-native-paper's React context for values that have nothing to do with paper. Every custom component must be inside a `PaperProvider`. Non-UI logic cannot import token values without pulling in paper. Swapping or removing paper requires rewriting every consumer.

**Do this instead:** Tokens live in `design/tokens/`. Paper theme reads from tokens. Custom components also read from tokens directly. Paper is one consumer of the token system, not the token system itself.

---

### Anti-Pattern 2: Rewriting StyleSheets Into a New Abstraction at Migration Time

**What people do:** Create a `useStyles()` hook or `styled-components` wrapper and rewrite every screen's styles in the new system in one pass.

**Why it's wrong:** React Native `StyleSheet.create()` with token imports is the most compatible, lowest-overhead approach for bare RN. A `useStyles()` hook adds re-execution on every render for static values. `styled-components` requires additional tooling and has known performance overhead in RN.

**Do this instead:** Keep `StyleSheet.create()`. Replace the literal values with token imports. One mechanical find-and-replace pass per screen. No new paradigm needed.

---

### Anti-Pattern 3: Wrapping Paper Components in Design System Wrappers

**What people do:** Create an `<AppSearchbar>` wrapper around paper's `<Searchbar>` just to control styling.

**Why it's wrong:** Paper components are already the wrapper. When `PaperProvider` receives the correct `paperTheme`, paper components reflect brand colors automatically. Adding another wrapper doubles component surface for zero gain.

**Do this instead:** Theme paper components via `PaperProvider`. Only build custom design system components for patterns where paper has no component, or where paper's built-in behavior (ripple, elevation, MD3 state layers) conflicts with the minimal Notion/Linear aesthetic the app targets.

---

### Anti-Pattern 4: Using `react-native link` or Manual Xcode Steps for Fonts

**What people do:** Run `react-native link` after placing font files, or manually add fonts to Xcode's "Copy Bundle Resources" and Info.plist by hand.

**Why it's wrong:** `react-native link` is deprecated and unreliable with modern RN. Manual Xcode steps are error-prone and do not survive team environments or CI runners.

**Do this instead:** Use `npx react-native-asset` with a `react-native.config.js` that declares `assets: ['./assets/fonts']`. This command handles both platforms automatically and is safe to re-run.

```js
// react-native.config.js (project root)
module.exports = {
  project: { ios: {}, android: {} },
  assets: ['./assets/fonts'],
};
```

After placing font files in `assets/fonts/`:
```bash
npx react-native-asset
cd ios && pod install && cd ..  # iOS only
```

---

### Anti-Pattern 5: Using a Single Font File for All Weights

**What people do:** Install only `Inter-Regular.ttf` and use `fontWeight: '700'` to simulate bold.

**Why it's wrong:** On iOS, `fontWeight` on a custom font family that does not have a corresponding bold weight file produces synthetic bolding, which looks different from the designed typeface weight. The rendering varies by iOS version and is unpredictable.

**Do this instead:** Install one TTF file per weight used (Regular, Medium, SemiBold, Bold). In `typography.ts`, set `fontFamily` per variant to the exact filename without extension. Each entry in `textVariants` references the correct weight file directly.

---

## Build Order for Phases

Based on dependencies, the recommended implementation sequence for v1.1:

### Phase 1: Token Foundation (no visible UI change)

1. Create `design/tokens/` files: `colors.ts`, `spacing.ts`, `typography.ts`, `radius.ts`, `shadows.ts`, `index.ts`
2. Create `react-native.config.js` with `assets: ['./assets/fonts']`
3. Place brand font files in `assets/fonts/`
4. Run `npx react-native-asset` then `cd ios && pod install`
5. Smoke test: verify a font family reference resolves without error

### Phase 2: Paper Theme Integration (first visible change)

1. Create `design/theme/paperTheme.ts` — build MD3 theme from token imports
2. Create `design/theme/useAppTheme.ts`
3. Update `App.tsx` — pass `paperTheme` from tokens instead of raw `MD3LightTheme`
4. Verify: `Searchbar` and paper `TextInput` in `AddFoodScreen` reflect `colors.primary`

### Phase 3: Core Component Library

1. `design/components/Text.tsx` — variant system from `textVariants`
2. `design/components/Button.tsx` — replaces `TouchableOpacity` + inline styles
3. `design/components/Card.tsx` — surface/container wrapper
4. `design/components/Input.tsx` — TextInput with token border/background/font
5. `design/components/index.ts` — barrel export

### Phase 4: Apply Across Existing Screens

Migrate leaf screens first, navigators last (leaf screens have no downstream consumers):

1. InfoModal screens (`WelcomeScreen`, `BasicInfoScreen`, `MoreInfoScreen`) — onboarding polish scope; highest design visibility
2. `AddFoodScreen` — most complex styling, good integration test
3. `DietTodayScreen` — replace macro color hex values with `colors.carbs / protein / fat`
4. `DietHistoryScreen`, `DailyDietScreen`, `FitnessScreen`
5. `BottomTabNavigator` and navigator `screenOptions` (header styles)
6. Delete `constants/Colors.ts` shim after all screens confirmed migrated

---

## Sources

- [React Native Paper Theming Guide](http://oss.callstack.com/react-native-paper/docs/guides/theming/) — custom theme, `AppTheme` TypeScript pattern (HIGH confidence — official docs)
- [React Native Paper Fonts Guide](http://oss.callstack.com/react-native-paper/docs/guides/fonts/) — `configureFonts` API, `fontConfig` structure, custom variant creation (HIGH confidence — official docs)
- [React Native Paper LightTheme source](https://github.com/callstack/react-native-paper/blob/main/src/styles/themes/v3/LightTheme.tsx) — MD3 color role names reference (HIGH confidence — official source)
- [LogRocket: Adding Custom Fonts to React Native](https://blog.logrocket.com/adding-custom-fonts-react-native/) — `react-native-asset` and `react-native.config.js` as the current standard approach replacing `react-native link` (HIGH confidence — verified current article)
- [Thoughtbot: Structure for Styling in React Native](https://thoughtbot.com/blog/structure-for-styling-in-react-native) — token-based `StyleSheet` pattern for RN (MEDIUM confidence — engineering blog, widely cited)
- Codebase review of `App.tsx`, `constants/Colors.ts`, `screens/`, `navigation/`, `components/`, `package.json` — direct source of truth for existing integration points (HIGH confidence)

---

*Architecture research for: macromaker v1.1 design system integration — React Native bare app with react-native-paper coexistence*
*Researched: 2026-03-14*
