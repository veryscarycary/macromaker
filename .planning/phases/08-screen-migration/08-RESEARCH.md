# Phase 8: Screen Migration - Research

**Researched:** 2026-03-20
**Domain:** React Native screen migration to design system tokens; hardcoded color elimination; D3/SVG graph color token adoption
**Confidence:** HIGH

---

## Summary

Phase 8 is a mechanical migration: every screen and graph component in the app must stop using hardcoded style values and start consuming the design system tokens and components built in Phases 5–7. The token layer (`design/tokens/`) and component library (`design/components/`) are complete and fully verified. The work divides cleanly into two categories:

**Category A — Screen migration.** Most screens already import from `design/tokens/colors` and `design/tokens/typography` (partially migrated during earlier phases). The remaining work is replacing: (1) the legacy `components/Themed` Text/View imports with the DS `Text` component or plain RN primitives, (2) raw `fontFamily`/`fontSize` literals with `typeScale` spread or `fontFamilies` tokens, (3) remaining numeric spacing literals with `spacing`/`radius` tokens, and (4) isolated hardcoded hex colors and `rgba(...)` values.

**Category B — Graph color token adoption.** Three D3 graph components (`BarGraph`, `MealTimeGraph`, `TotalCaloriesGraph`) and a legacy pie chart (`MacroGraph`) pass macro colors as hardcoded hex strings. These must be updated to use `colors.macro.*` tokens directly. The SVG `<Text>` elements inside these components stay on system fonts (`Helvetica, Arial`) — this is a documented carve-out (Phase 6 decision) because custom fonts break on Android via react-native-svg.

**Category C — Shim deletion.** `constants/Colors.ts` and the `components/Themed.tsx` wrapper are only referenced by `navigation/BottomTabNavigator.tsx` and `components/Themed.tsx` itself. Once all screen imports are migrated, both files can be deleted.

**Primary recommendation:** Work screen-by-screen in dependency order: onboarding screens first (they are the most complete), then AddFood/EditFood (complete), then Diet screens (partially using old Themed), then FitnessScreen (trivial — two lines), then graph components (isolated color changes), then delete the shim files.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MIGR-01 | Onboarding screens (WelcomeScreen, BasicInfoScreen, MoreInfoScreen) migrated to design system tokens and components | Screens already import tokens; key work is replacing `Themed.Text/View` imports and isolated `rgba()` literals in WelcomeScreen |
| MIGR-02 | AddFoodScreen and EditFoodScreen migrated to design system tokens and components | AddFoodScreen largely migrated; remaining work is replacing `Themed.Text/View` and inline `MacroBar` with `MacroProgressBar` DS component; EditFoodScreen is the same file (AddFoodScreen.tsx) |
| MIGR-03 | DietTodayScreen migrated to design system tokens and components | Three hardcoded hex color literals in `data[]` array; must be replaced with `colors.macro.*`; no Themed imports in this file |
| MIGR-04 | DietHistoryScreen and DailyDietScreen migrated to design system tokens and components | Both screens use `Themed.Text/View` and have raw numeric spacing; MealSection subcomponent is nearly complete |
| MIGR-05 | FitnessScreen migrated to design system tokens and components | Trivial: one `fontWeight: 'bold'` and no token imports; uses `Themed.Text/View` |
| MIGR-06 | D3 graph components updated to use `colors.macro.*` for fills; SVG Text stays on system fonts | BarGraph passes color per data item from DietTodayScreen; MealTimeGraph uses `MEAL_COLOR_MAP` constants; MacroGraph hardcodes 6 hex values; TotalCaloriesGraph passes color1/color2/color3 props from caller |
| MIGR-07 | `constants/Colors.ts` shim deleted; no hardcoded hex values remain in any screen or component file | Two files import from `constants/Colors`: `Themed.tsx` and `BottomTabNavigator.tsx`; both must be migrated before deletion |
</phase_requirements>

---

## Standard Stack

### Core Tokens (already installed)
| Module | Export | Purpose |
|--------|--------|---------|
| `design/tokens/colors` | `colors` | Semantic color layer — `colors.brand.*`, `colors.surface.*`, `colors.text.*`, `colors.macro.*`, `colors.status.*` |
| `design/tokens/typography` | `fontFamilies`, `typeScale` | Inter font family strings + 9-level type scale |
| `design/tokens/spacing` | `spacing` | 8pt grid — xs(4) sm(8) md(12) lg(16) xl(24) 2xl(32) 3xl(48) 4xl(64) |
| `design/tokens/radius` | `radius` | Corner rounding — xs(4) sm(8) md(12) lg(16) |

### DS Components (already built, import from barrel)
| Component | Import | Replaces |
|-----------|--------|---------|
| `Text` | `design/components` | `components/Themed` Text + raw `RNText` with font literals |
| `NumericText` | `design/components` | Raw `RNText` for calorie/macro numbers (`fontVariant: ['tabular-nums']`) |
| `Button` | `design/components` | `TouchableOpacity` + inline button styles where the shape matches |
| `Card` | `design/components` | `View` containers with surface background + border |
| `MacroProgressBar` | `design/components` | Inline macro bar segments built with `View` flex rows |

### Barrel import rule (locked Phase 7 decision)
```typescript
// ALWAYS — never import from individual file paths
import { Text, NumericText, Button, Card, MacroProgressBar } from '../../design/components';
```

---

## Architecture Patterns

### Recommended Migration Approach Per Screen

**Step 1:** Replace `Themed` imports. Every file importing from `components/Themed` replaces:
- `Text` from Themed → `Text` from `design/components` (with `variant` prop)
- `View` from Themed → plain `View` from `react-native` (Themed.View only applied background color from the now-deleted light/dark scheme; just use `View` from RN directly)

**Step 2:** Replace raw font literals. `fontFamily: fontFamilies.bold` is already the correct pattern. Files that still use `fontFamily: 'helvetica'` or `fontWeight: 'bold'` standalone get replaced with `typeScale` spreads or explicit `fontFamilies.*` references.

**Step 3:** Replace spacing literals. Numeric values like `16`, `8`, `12`, `24` get replaced with `spacing.lg`, `spacing.sm`, `spacing.md`, `spacing.xl`. Do not over-refactor — only replace values that map cleanly to an existing spacing token.

**Step 4:** Replace hardcoded colors. All `#rrggbb` and most `rgba(...)` values get replaced with `colors.*` tokens. The WelcomeScreen `rgba(255,255,255,N)` values are intentional white-with-opacity overlays on a dark background — acceptable to leave as-is since no token exists for opacity variants. Document as accepted carve-out.

**Step 5:** Replace D3 graph color data. The caller (DietTodayScreen) currently defines `color: '#1854bd'` etc. in the data array. Replace these three values with `colors.macro.carbs`, `colors.macro.protein`, `colors.macro.fat`.

### The `Themed.View` Replacement Pattern

```typescript
// BEFORE
import { Text, View } from '../../components/Themed';
// ...
<View style={styles.container}>...</View>

// AFTER
import { View } from 'react-native';
import { Text } from '../../design/components';
// ...
<View style={styles.container}>...</View>
// No backgroundColor injection needed — Themed.View applied background from Colors.ts
// which was always 'white' in light mode (the only mode in this app)
```

### The `MacroProgressBar` in AddFoodScreen

AddFoodScreen has an inline macro bar implementation (3 `View` segments with `flex: carbsCalories` and `backgroundColor: colors.macro.*`). This inline bar shows macro proportions of the current meal being entered — it is NOT a progress bar against a target. It should remain as-is (it is already using `colors.macro.*` tokens). Do not replace it with `MacroProgressBar` component, which requires target/logged values.

### D3 Graph Color Injection Pattern

`BarGraph` and `TotalCaloriesGraph` receive color through the `BarGraphData` type:
```typescript
// BarGraph/types.ts
type BarGraphData = { label: string; amount: number; targetAmount: number; color: string; }
```

The color originates in `DietTodayScreen.tsx` where the `data` array is constructed. The fix is in the caller, not inside the graph component:

```typescript
// BEFORE (DietTodayScreen.tsx lines 71-89)
{ label: 'Carbs',   color: '#1854bd' }
{ label: 'Protein', color: '#982f2f' }
{ label: 'Fat',     color: '#b59b46' }

// AFTER
import { colors } from '../../../../design/tokens/colors';
{ label: 'Carbs',   color: colors.macro.carbs }
{ label: 'Protein', color: colors.macro.protein }
{ label: 'Fat',     color: colors.macro.fat }
```

### MealTimeGraph Color Injection Pattern

`getMealTimeMealsWithColor` in `components/MealTimeGraph/utils.ts` reads from `MEAL_COLOR_MAP` in `components/MealTimeGraph/constants.ts`. The constants file must be updated:

```typescript
// BEFORE (constants.ts)
export const MEAL_COLOR_MAP: Record<string, string> = {
  carbs: '#1854bd', protein: '#982f2f', fat: '#b59b46',
};

// AFTER
import { colors } from '../../design/tokens/colors';
export const MEAL_COLOR_MAP: Record<string, string> = {
  carbs: colors.macro.carbs, protein: colors.macro.protein, fat: colors.macro.fat,
};
```

### MacroGraph Color Pattern

`components/MacroGraph.tsx` uses hardcoded hex for pie slices both in `MACRO_CONFIG` and inline in `pieData`. Both sites must be updated to use `colors.macro.*`. The SVG `<SvgText>` fill values (`#888`, `#e0e0e0` for empty state) are structural chrome — acceptable to migrate to `colors.text.tertiary` and `colors.surface.muted`.

### BottomTabNavigator Colors.ts Migration

`navigation/BottomTabNavigator.tsx` imports `Colors` from `constants/Colors` only for `tabBarActiveTintColor`:
```typescript
// BEFORE
tabBarActiveTintColor: Colors[colorScheme].tint  // was '#2f95dc' (light blue)

// AFTER
tabBarActiveTintColor: colors.brand.primary
```
Remove `useColorScheme` import and hook if it was only used for color scheme selection — verify no other usage in that file.

### PercentageSlider Migration

`components/PercentageSlider.tsx` has hardcoded `#7078df` (brand.primary), `#d8dcf7` (brand.primaryLight-ish), `#9091b4`, and `#eceffd`. The default props are the brand purple. Replace:
- `minTrackColor = '#7078df'` → `colors.brand.primary`
- `maxTrackColor = '#d8dcf7'` → `colors.surface.muted` (closest semantic fit; `#d8dcf7` is a very light purple tint)
- `thumbColor = '#9091b4'` → `colors.brand.primaryLight`
- Inline style `#eceffd` → `colors.surface.subtle` or `colors.surface.muted`
- `#5560b8` → `colors.brand.primaryDark`
- `#7078df` (valuePill bg) → `colors.brand.primary`
- `'#fff'` → `colors.text.inverse`
- `fontFamily: 'Helvetica'` → `fontFamilies.medium`
- `fontWeight: 'bold'` → remove (fontFamily handles weight with Inter)

### SVG Text Carve-Out (locked decision)

SVG `<Text>` elements inside react-native-svg components stay on system fonts. This is a documented project decision from Phase 6. The `fontFamily="Helvetica, Arial"` values in `HorizontalBars.tsx` SVG `<Text>` and similar are acceptable to leave unchanged. Only the fill/stroke colors on the SVG primitives need updating.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Macro proportion bar | Custom View flex row | `MacroProgressBar` DS component (when target/logged semantics apply) | Already built in Phase 7 with correct overflow handling |
| Themed text with variant | Custom Text wrapper | `Text` from `design/components` | Already built with full variant system |
| Button with disabled state | TouchableOpacity + conditional style | `Button` from `design/components` | Has opacity-based disabled state built in |
| Card container | View with border + background | `Card` from `design/components` | Handles `bordered` prop cleanly |

**Note:** The inline macro bar in `AddFoodScreen` (showing meal proportions only, no target) should NOT be replaced with `MacroProgressBar` — the component API requires target/logged values and AddFoodScreen only has raw calorie fractions.

---

## Common Pitfalls

### Pitfall 1: `Themed.View` backgroundColor injection
**What goes wrong:** Removing `Themed.View` import without checking whether the `backgroundColor` it injected was relied upon for a white background.
**Why it happens:** `Themed.View` called `useThemeColor({ background: 'background' })` which always returned `#fff` in light mode.
**How to avoid:** After switching to plain `View` from `react-native`, verify background is still correct. Most container Views have explicit `backgroundColor` in their stylesheet — those are fine. The few that don't will become transparent (which is usually the desired behavior in screens that have a root-level background).
**Warning signs:** White content disappearing against a transparent background.

### Pitfall 2: DS `Text` default color override
**What goes wrong:** `Text` from `design/components` has `color = colors.text.primary` as default. Screens that previously used `Themed.Text` (which used `Colors.light.text = '#000'`) may look slightly different since `colors.text.primary = '#0f172a'` (slate900, near-black).
**Why it happens:** The DS Text component adds a default color via its `color` prop which is merged into the style array.
**How to avoid:** This is the correct behavior — slate900 is intentionally the primary text color. No workaround needed; just be aware when reviewing screenshots.

### Pitfall 3: Replacing `rgba()` values on dark-background screens
**What goes wrong:** WelcomeScreen uses `rgba(255,255,255,0.N)` for overlays on a dark (slate900) background. These values have no equivalent semantic token.
**Why it happens:** The design system has no opacity modifier tokens.
**How to avoid:** Keep `rgba()` literals in WelcomeScreen as accepted carve-outs. Document in code comment. The MIGR-07 success criterion only requires no hardcoded **hex** values — `rgba()` literals are outside the grep check.

### Pitfall 4: Deleting `constants/Colors.ts` before all consumers are migrated
**What goes wrong:** Build fails because `Themed.tsx` and `BottomTabNavigator.tsx` still import from it.
**Why it happens:** File deletion before migration is complete.
**How to avoid:** Sequence: (1) migrate Themed.tsx and BottomTabNavigator.tsx, (2) verify no remaining imports (`grep -r constants/Colors`), (3) then delete.

### Pitfall 5: `TotalCaloriesGraph` passes colors as props (not in a token map)
**What goes wrong:** `TotalCaloriesGraph` receives `color1`, `color2`, `color3` props from `DietTodayScreen`. Updating only the constants file won't fix this path.
**Why it happens:** Two separate color injection mechanisms exist (props vs MEAL_COLOR_MAP).
**How to avoid:** DietTodayScreen defines both the `data[]` array (used by BarGraph) and passes `data[0].color` etc. to TotalCaloriesGraph. Fixing DietTodayScreen's `data` array fixes both graph components simultaneously.

### Pitfall 6: `fontWeight: 'bold'` left alongside Inter fontFamily
**What goes wrong:** React Native ignores `fontWeight` when a custom `fontFamily` is set — the weight is baked into the font file name (Inter-Bold.ttf).
**Why it happens:** Old patterns mixed fontFamily + fontWeight.
**How to avoid:** Remove `fontWeight` from any style that also sets `fontFamily` from `fontFamilies.*`. Use `fontFamilies.bold` instead.

---

## Code Examples

### Screen import pattern after migration
```typescript
// Source: design/components/index.ts (barrel)
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, NumericText } from '../../design/components';
import { colors } from '../../design/tokens/colors';
import { spacing, radius } from '../../design/tokens';
```

### Type scale spread (replaces inline font literals)
```typescript
// Source: design/tokens/typography.ts
// typeScale.body = { fontFamily: 'Inter-Regular', fontSize: 16, lineHeight: 24 }
// typeScale.label = { fontFamily: 'Inter-Medium', fontSize: 12, lineHeight: 16 }

// BEFORE
fontFamily: fontFamilies.semiBold, fontSize: 18, color: colors.text.primary

// AFTER — using DS Text with variant
<Text variant="subheading" color={colors.text.primary}>7-Day Average</Text>
```

### DS Text replacing Themed.Text
```typescript
// BEFORE
import { Text } from '../../components/Themed';
<Text style={styles.title}>7-Day Average</Text>
// styles.title: { fontFamily: fontFamilies.semiBold, fontSize: 18, color: colors.text.primary }

// AFTER
import { Text } from '../../design/components';
<Text variant="subheading">7-Day Average</Text>
// Text defaults: variant='body', color=colors.text.primary
```

### MealTimeGraph constants.ts after token injection
```typescript
// Source: components/MealTimeGraph/constants.ts
import { colors } from '../../design/tokens/colors';

export const MEAL_COLOR_MAP: Record<string, string> = {
  carbs:   colors.macro.carbs,
  protein: colors.macro.protein,
  fat:     colors.macro.fat,
};
```

### BottomTabNavigator migration
```typescript
// BEFORE
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
// ...
const colorScheme = useColorScheme();
// ...
tabBarActiveTintColor: Colors[colorScheme].tint

// AFTER
import { colors } from '../design/tokens/colors';
// ...
tabBarActiveTintColor: colors.brand.primary
// Remove useColorScheme entirely from this file if not used elsewhere
```

---

## Current State Audit: What Each File Needs

### Screens — Hardcoded Hex Remaining

| File | Issues | Effort |
|------|--------|--------|
| `screens/InfoModal/screens/WelcomeScreen.tsx` | Uses `Themed.Text` (single import); `rgba()` literals (carve-out); token usage otherwise complete | Low |
| `screens/InfoModal/screens/BasicInfoScreen.tsx` | Uses `Themed.Text` + `Themed.View`; spacing literals (16, 8, 24, etc.) | Medium |
| `screens/InfoModal/screens/MoreInfoScreen.tsx` | Uses `Themed.Text` + `Themed.View`; spacing literals | Medium |
| `screens/AddFood/AddFoodScreen.tsx` | Uses `Themed.Text` + `Themed.View`; no hex values; good token usage | Low |
| `screens/AddFood/components/MacroInput.tsx` | Uses `Themed.Text` + `Themed.View`; token usage otherwise complete | Low |
| `screens/Diet/DietHistoryScreen.tsx` | Uses `Themed.Text` + `Themed.View`; spacing literals | Low |
| `screens/Diet/screens/DailyDiet/DailyDietScreen.tsx` | Uses `Themed.Text` + `Themed.View`; spacing literals | Low |
| `screens/Diet/screens/Today/DietTodayScreen.tsx` | 3 hardcoded hex values in data array; no Themed imports | Very Low |
| `screens/FitnessScreen.tsx` | Uses `Themed.Text` + `Themed.View`; `fontWeight: 'bold'`; no token imports | Low |
| `screens/NotFoundScreen.tsx` | Two hex values (`#fff`, `#2e78b7`); `fontWeight: 'bold'` | Very Low |
| `screens/MacroScreen.tsx` | `fontFamily: 'helvetica'`, `fontWeight: 'bold'`; uses Themed.Text | Low |
| `screens/Diet/components/NoDataMacroGraph.tsx` | `#aaa` hex literal; uses Themed.Text/View | Very Low |

### Components — Hardcoded Hex Remaining

| File | Issues | Effort |
|------|--------|--------|
| `components/MacroGraph.tsx` | 6 hex macro colors + 2 empty-state colors; uses raw RN Text (not Themed) | Medium |
| `components/TotalCaloriesGraph/index.tsx` | `fontFamily: 'helvetica'`; `color: '#6a6a6a'` | Low |
| `components/BarGraph/HorizontalBars.tsx` | 5 hardcoded hex/color literals; SVG `<Text>` (carve-out for fontFamily) | Low |
| `components/MealTimeGraph/constants.ts` | 3 hardcoded hex macro colors | Very Low |
| `components/MealTimeGraph/index.tsx` | 1 hex `#a0a0a0` for axis line | Very Low |
| `components/PercentageSlider.tsx` | 7+ hardcoded hex values; `fontFamily: 'Helvetica'`; `fontWeight: 'bold'` | Medium |
| `components/Themed.tsx` | Entire file is the shim — delete after migration | N/A |
| `navigation/BottomTabNavigator.tsx` | `Colors[colorScheme].tint` reference | Very Low |
| `constants/Colors.ts` | Delete after all imports migrated | N/A |

---

## State of the Art

| Old Pattern | Current Pattern | Impact |
|-------------|-----------------|--------|
| `import { Text, View } from 'components/Themed'` | `import { Text } from 'design/components'` + `import { View } from 'react-native'` | Removes Expo-era color scheme dependency |
| `fontFamily: 'helvetica', fontWeight: 'bold'` | `...typeScale.subheading` or `fontFamily: fontFamilies.bold` | Correct Inter weight rendering |
| `color: '#1854bd'` inline | `color: colors.macro.carbs` | All macro colors consistent with MacroProgressBar |
| `Colors[colorScheme].tint` | `colors.brand.primary` | Single source of truth for tab bar tint |

---

## Open Questions

1. **`MacroScreen.tsx` navigation status**
   - What we know: The file exists (`screens/MacroScreen.tsx`) but is not referenced in the navigation structure seen in `BottomTabNavigator.tsx` or `App.tsx`
   - What's unclear: Is it a dead/unused screen?
   - Recommendation: Include it in migration pass for completeness (still needs `fontFamily` fix). Verify no live navigation reference before deleting.

2. **`rgba()` values in WelcomeScreen — token gap**
   - What we know: WelcomeScreen's design uses opacity variants of white that have no semantic token equivalent
   - What's unclear: Whether the planner should add these as tokens or accept them as literals
   - Recommendation: Accept as carve-outs. The MIGR-07 grep check only targets `#[hex]` patterns. Document in a code comment.

3. **`HorizontalBarTop` / `HorizontalBarWithHook` hex colors**
   - What we know: These BarGraph subcomponents use `#fa8e00` (orange) and `#FFC77D` (light orange) — they appear to be "target marker" UI, not macro colors
   - What's unclear: Whether these should be replaced with a semantic token or left as structural chrome
   - Recommendation: Map `#fa8e00` → `colors.brand.primary` (closest semantic fit: orange accent) or leave as carve-out. Research decision at planning time.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest (react-native preset) |
| Config file | `package.json` (`"jest": { "preset": "react-native" }`) |
| Quick run command | `npx jest --testPathPattern="__tests__/screens" --watchAll=false` |
| Full suite command | `npx jest --watchAll=false` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MIGR-01 | WelcomeScreen, BasicInfoScreen, MoreInfoScreen render without hardcoded fonts/colors | Smoke render | `npx jest __tests__/screens/BasicInfoScreen.test.tsx --watchAll=false` | Partial — BasicInfoScreen.test.tsx exists |
| MIGR-02 | AddFoodScreen/EditFoodScreen render with DS components | Smoke render | `npx jest --testPathPattern="AddFood" --watchAll=false` | No — Wave 0 gap |
| MIGR-03 | DietTodayScreen data array uses `colors.macro.*` | Unit (inspect prop values) | `npx jest --testPathPattern="DietToday" --watchAll=false` | No — Wave 0 gap |
| MIGR-04 | DietHistoryScreen, DailyDietScreen render | Smoke render | `npx jest --testPathPattern="DietHistory|DailyDiet" --watchAll=false` | No — Wave 0 gap |
| MIGR-05 | FitnessScreen renders with DS Text | Smoke render | `npx jest --testPathPattern="FitnessScreen" --watchAll=false` | No — Wave 0 gap |
| MIGR-06 | Graph components receive `colors.macro.*` token values | Unit (prop inspection) | `npx jest --testPathPattern="MacroGraph|MealTime|BarGraph|TotalCalories" --watchAll=false` | Partial — MacroGraph.test.tsx exists |
| MIGR-07 | No hardcoded hex in screens/ or components/ | Grep CI check | `grep -rE '#[0-9a-fA-F]{3,6}' screens/ components/` returns 0 | Manual verification only |

### Sampling Rate
- **Per task commit:** `npx jest --watchAll=false --passWithNoTests`
- **Per wave merge:** `npx jest --watchAll=false`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `__tests__/screens/AddFoodScreen.test.tsx` — covers MIGR-02 (smoke render with mocked contexts)
- [ ] `__tests__/screens/DietTodayScreen.test.tsx` — covers MIGR-03 (verify macro colors in data array)
- [ ] `__tests__/screens/FitnessScreen.test.tsx` — covers MIGR-05 (renders with DS Text)

*(BasicInfoScreen.test.tsx already exists and covers MIGR-01 partial. MacroGraph.test.tsx already exists.)*

---

## Sources

### Primary (HIGH confidence)
- Direct code inspection of all files listed in this research — all findings are ground-truth from the current codebase
- `design/tokens/colors.ts` — semantic token values for `colors.macro.*`
- `design/components/index.ts` — confirmed barrel exports
- `design/components/MacroProgressBar.tsx` — confirmed component API

### Secondary (MEDIUM confidence)
- Phase 6 STATE.md decision: "SVG graph `<Text>`: stays on system fonts (documented carve-out) — custom fonts break on Android via react-native-svg"
- Phase 7 STATE.md decision: "Barrel index.ts is the single import point for all DS consumers"

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Current state audit (what needs changing): HIGH — direct file inspection of every screen and component
- Token mapping decisions: HIGH — tokens are final and fully defined
- Test infrastructure: HIGH — jest config confirmed from package.json
- SVG carve-out validity: HIGH — locked decision in STATE.md from Phase 6

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable — token layer is locked, no external library changes)
