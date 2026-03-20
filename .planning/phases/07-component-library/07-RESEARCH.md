# Phase 7: Component Library - Research

**Researched:** 2026-03-20
**Domain:** React Native component authoring with design tokens, TypeScript prop APIs
**Confidence:** HIGH

## Summary

Phase 7 creates five net-new components in `design/components/`: `Text`, `NumericText`, `Button`, `Card`, and `MacroProgressBar`. All design decisions are locked in CONTEXT.md — the implementation is a straight translation of those specs into React Native `StyleSheet`-based components that import directly from `design/tokens/`.

No new libraries are needed. The full token foundation (colors, typeScale, fontFamilies, spacing, radius) is already in place and battle-tested through Phases 5 and 6. The component pattern is `StyleSheet.create` with direct token imports — no runtime theme, no context, no styled-components. This is consistent with all prior v1.1 work.

The only implementation subtlety is `MacroProgressBar`: it uses pure React Native `View` with `flexDirection: 'row'` and proportional `flex` values to create the segmented bar. No SVG, no D3. The overflow/error state (fill exceeds target) requires capping fill at 100% width and switching the fill `backgroundColor` to `colors.status.error`.

**Primary recommendation:** Implement all 5 components as individual `.tsx` files under `design/components/`, each consuming tokens via direct import, with a barrel `index.ts`. Follow `StyleSheet.create` + token import pattern established in Phase 5/6. Tests use `@testing-library/react-native` render + prop assertion (same pattern as StepIndicator test).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**MacroProgressBar layout**
- Segmented horizontal bar: one bar divided into 3 colored fills (carbs, protein, fat)
- Segment widths are proportional to gram targets (not calorie targets)
- Fill within each segment = logged grams / target grams for that macro (progress toward target)
- Segment colors from `colors.macro.*` tokens (carbs=blue, protein=violet, fat=amber)
- When a macro exceeds its gram target: cap fill at 100%, shift fill color to `colors.status.error` (red)
- The existing calorie graph (TotalCaloriesGraph) handles calorie progress — MacroProgressBar handles gram progress

**Button variants**
- Primary: filled `brand.primary` background, `text.inverse` label, `radius.md` corners, full-width by default
- Secondary: no fill, `brand.primary` border + `brand.primary` label text (outline style)
- Ghost: no fill, no border, `brand.primary` label text only
- Press feedback: `activeOpacity` on `TouchableOpacity` — opacity fade, no Reanimated needed
- Disabled state: `opacity: 0.4` applied to the full button
- No icon prop — text only for v1.1

**Text component API**
- Single `<Text variant="heading">` component (not named exports per variant)
- `variant` prop maps to `typeScale` keys: display, heading, subheading, body, bodyMedium, bodySmall, caption, label, overline
- `color?: string` prop defaults to `colors.text.primary` — callers override for secondary/tertiary text
- `style?: StyleProp<TextStyle>` accepted and spread last
- Extends React Native `Text` props (accessible, selectable, numberOfLines all work)

**NumericText**
- Extends `Text` API — same variant/color/style props
- Always adds `fontVariant: ['tabular-nums']` to style — fixed-width digits, no layout shift
- Used for all calorie and macro number displays

**Card scope**
- Background: `colors.surface.default`, border radius: `radius.md`
- `bordered?: boolean` prop (default `false`) — when true, adds 1px `colors.surface.border` border
- Built-in padding: `spacing[16]` (16pt) on all sides — caller can override via `style` prop
- No title slots, no header/footer — children are fully caller-controlled

### Claude's Discretion
- `design/components/index.ts` barrel export structure
- Whether to split components into separate files or group Typography (Text + NumericText) together
- Exact TypeScript interface names and prop types
- MacroProgressBar bar height and corner radius
- Whether Button exposes a `size` prop (normal only for now is fine)

### Deferred Ideas (OUT OF SCOPE)
- Icon wrapper component — v2 (DS-04)
- Animated MacroProgressBar fill via Reanimated — v2 (DS-02)
- Shadow tokens on Card — v2 (DS-03, shadow.ts is a stub)
- EmptyState component — v2 (DS-05)
- Button with icon prop — later phase if screens need it
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| COMP-01 | `Text` component with typed variant system (display, heading, subheading, body, bodySmall, caption, label, overline) | `typeScale` and `fontFamilies` in `design/tokens/typography.ts` are the direct source of truth; component is a thin wrapper spreading the correct typeScale entry |
| COMP-02 | `NumericText` component with tabular numerals (`fontVariant: ['tabular-nums']`) for all calorie/macro number displays | `fontVariant` is a standard React Native `TextStyle` property; no extra library needed; extends Text props API from COMP-01 |
| COMP-03 | `Button` component with primary / secondary / ghost variants consuming brand tokens | `colors.brand.primary`, `colors.text.inverse`, `radius.md` all exist; `TouchableOpacity` is the correct primitive per locked decisions |
| COMP-04 | `Card` component — surface container with radius token and optional border | `colors.surface.default`, `colors.surface.border`, `radius.md`, `spacing.lg` (16pt) all exist in tokens |
| COMP-05 | `MacroProgressBar` component consuming `colors.macro.*` tokens | `colors.macro.carbs/protein/fat` and `colors.status.error` exist; pure View/flexbox implementation — no SVG required |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native `View`, `Text`, `TouchableOpacity`, `StyleSheet` | 0.84.1 (installed) | Component primitives | Built-in; no external dep needed for these components |
| `design/tokens` (project) | n/a | Color, typography, spacing, radius tokens | Already established in Phases 5–6; all token shapes verified |
| TypeScript | ^5.7.3 (installed) | Type-safe prop interfaces | Project standard; `TypeScaleKey` already exported from tokens |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@testing-library/react-native` | ^13.3.3 (installed) | Component rendering in tests | All 5 component test files; `render`, `getByText`, `getByTestId` |
| `react-test-renderer` | ^19.2.3 (installed) | Snapshot fallback if needed | Only if TRTL-style assertions needed; prefer RTLN |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Raw `TouchableOpacity` | `Pressable` | `Pressable` offers more granular press state but adds complexity; `TouchableOpacity` with `activeOpacity` is the locked decision |
| Pure View flexbox for progress bar | react-native-svg Rect | SVG adds complexity and the SVG `<Text>` carve-out (system fonts only) would apply; pure View is simpler and sufficient |
| Per-component StyleSheet | Inline styles | StyleSheet.create is the project standard; provides style caching |

**Installation:** No new packages needed. All dependencies are already installed.

## Architecture Patterns

### Recommended Project Structure
```
design/
├── tokens/          # Already complete (Phase 5)
├── theme/           # Already complete (Phase 6)
└── components/      # Phase 7 target — currently empty
    ├── Text.tsx
    ├── NumericText.tsx
    ├── Button.tsx
    ├── Card.tsx
    ├── MacroProgressBar.tsx
    └── index.ts
```

Tests land alongside the existing test structure:
```
__tests__/
└── components/
    ├── StepIndicator.test.tsx   # existing
    ├── Text.test.tsx            # Wave 0 gap
    ├── NumericText.test.tsx     # Wave 0 gap
    ├── Button.test.tsx          # Wave 0 gap
    ├── Card.test.tsx            # Wave 0 gap
    └── MacroProgressBar.test.tsx # Wave 0 gap
```

### Pattern 1: Token-Consuming StyleSheet Component
**What:** Component imports tokens directly into `StyleSheet.create` — no context, no theme hook.
**When to use:** All 5 components in this phase.
**Example:**
```typescript
// Source: established in Phase 5/6 — design/theme/paperTheme.ts + all existing token tests
import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../design/tokens';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.default,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
});
```

### Pattern 2: Typed Variant Prop
**What:** A single component accepts a `variant` string prop typed against a token key union.
**When to use:** `Text` and `NumericText` — maps to `TypeScaleKey`.
**Example:**
```typescript
// Source: design/tokens/typography.ts (TypeScaleKey already exported)
import { typeScale, TypeScaleKey, colors } from '../../design/tokens';
import { Text as RNText, TextProps as RNTextProps, StyleProp, TextStyle } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: TypeScaleKey;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function Text({ variant = 'body', color = colors.text.primary, style, ...rest }: TextProps) {
  return <RNText style={[typeScale[variant], { color }, style]} {...rest} />;
}
```

### Pattern 3: Segmented Flex Progress Bar
**What:** Three `View` children inside a `flexDirection: 'row'` container, each with `flex` proportional to gram target.
**When to use:** `MacroProgressBar`.
**Key logic:**
```typescript
// Segment width = gramTarget / totalGramTargets (as flex ratio)
// Fill within segment = Math.min(logged / target, 1.0) as width percentage
// Fill color = logged > target ? colors.status.error : colors.macro[macro]
const totalTarget = carbsTarget + proteinTarget + fatTarget;
const carbsFlex = totalTarget > 0 ? carbsTarget / totalTarget : 1/3;
// Each segment is a container; inside it, an absolutely-positioned fill View
// fill width = `${Math.min(logged / target, 1) * 100}%`
```

### Pattern 4: TouchableOpacity Button with Variant Styles
**What:** `TouchableOpacity` with variant-selected stylesheet entries; disabled via `activeOpacity` + `opacity` style.
**When to use:** `Button`.
**Example:**
```typescript
// Disabled handled with opacity on outer TouchableOpacity:
<TouchableOpacity
  activeOpacity={0.7}
  style={[styles.base, styles[variant], disabled && styles.disabled]}
  onPress={onPress}
  disabled={disabled}
>
  <Text variant="bodyMedium" color={labelColor[variant]}>{label}</Text>
</TouchableOpacity>
// styles.disabled = { opacity: 0.4 }
```

### Anti-Patterns to Avoid
- **fontWeight alongside custom Inter fontFamily:** `typeScale` entries already encode weight via distinct fontFamily strings (`Inter-Bold`, etc.). Never add `fontWeight` to any style that also sets an `Inter-*` fontFamily — this is enforced by the Phase 6 rule and the `paperTheme.test.ts` precedent.
- **Hardcoded hex values in component files:** All color values must come from `colors.*` token imports. The `paperTheme.test.ts` fs-scan pattern enforces this at test time for the theme layer; Phase 7 tests should apply the same scan to `design/components/`.
- **Building on `components/Themed.tsx`:** That file uses `constants/Colors` and `useColorScheme` — legacy. New components start fresh from `design/tokens`.
- **SVG for MacroProgressBar:** The SVG `<Text>` carve-out (system fonts only in SVG) makes SVG-based bars unnecessary complexity. Pure View + flex is sufficient.
- **Using `flex` shorthand without explicit `flexDirection: 'row'` on parent:** React Native defaults to `flexDirection: 'column'`. The segmented bar parent must explicitly set `row`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tabular numerals | Custom digit-width logic | `fontVariant: ['tabular-nums']` (RN TextStyle) | Native platform handles digit-width; zero complexity |
| Token type safety | Manual type assertions | `TypeScaleKey` (already exported from tokens) | Phase 5 already typed the union; use it |
| Progress bar segment math | Custom pixel calculation | `flex` proportions in `flexDirection: 'row'` | React Native layout engine handles proportional sizing; no measurement needed |
| Button disabled state | Custom event blocking | `disabled` prop on `TouchableOpacity` + `opacity: 0.4` style | Native touch handling; locked decision |

**Key insight:** All the building blocks are already in place from Phases 5–6. Phase 7 is composition, not construction.

## Common Pitfalls

### Pitfall 1: MacroProgressBar divide-by-zero when all targets are 0
**What goes wrong:** If `carbsTarget + proteinTarget + fatTarget === 0`, dividing to get flex ratios produces `NaN` or `Infinity`, which React Native silently rejects (the View renders with zero width).
**Why it happens:** New user, no targets set yet.
**How to avoid:** Guard with `totalTarget > 0 ? macro / totalTarget : 1/3` — fall back to equal thirds.
**Warning signs:** Progress bar disappears or collapses to zero width when targets are unset.

### Pitfall 2: MacroProgressBar fill overflow when logged > target
**What goes wrong:** Setting fill width as a percentage > 100% stretches beyond the segment container, overflowing into adjacent segments or clipping.
**Why it happens:** User logs more than their target for a macro.
**How to avoid:** `Math.min(logged / target, 1)` caps fill at 100% of the segment. Simultaneously switch `backgroundColor` to `colors.status.error`. This is a locked decision.
**Warning signs:** Fill bleeds across segment boundaries.

### Pitfall 3: TypeScript name collision between `design/components/Text` and `react-native` `Text`
**What goes wrong:** Inside `design/components/Text.tsx`, importing RN `Text` while also exporting a component named `Text` causes a circular reference or naming collision.
**Why it happens:** Component and primitive share the same name.
**How to avoid:** `import { Text as RNText } from 'react-native'` — alias the primitive on import; export the wrapper as `Text`.

### Pitfall 4: `style` prop ordering — tokens before caller overrides
**What goes wrong:** If caller `style` is applied before token styles, callers cannot override `color` or `fontSize`.
**Why it happens:** Style array order matters in React Native (last wins).
**How to avoid:** Always spread as `[tokenStyle, { color }, callerStyle]` — caller style last.

### Pitfall 5: Barrel export collision in `design/components/index.ts`
**What goes wrong:** Both `Text.tsx` and `NumericText.tsx` might be grouped in a `Typography.tsx` file; if that file also re-exports both, the barrel re-exporting both `Typography` and individual names causes duplicate export errors.
**Why it happens:** Grouping vs individual file decision (Claude's Discretion).
**How to avoid:** Pick one approach. Recommendation: individual files, each a named export in `index.ts`. Simpler, avoids grouping confusion.

## Code Examples

Verified patterns from official sources:

### fontVariant: tabular-nums (React Native TextStyle)
```typescript
// Source: React Native TextStyle type definition — fontVariant is a standard property
// Verified: fontVariant: ['tabular-nums'] is valid in RN 0.60+
const style: TextStyle = {
  fontVariant: ['tabular-nums'],
};
// Used in NumericText by merging into the Text component's style array
```

### Flex-based proportional bar segments
```typescript
// Source: React Native flexbox — flex numeric values within flexDirection: 'row'
// are proportional to each other (same as CSS flex-grow)
<View style={{ flexDirection: 'row', overflow: 'hidden' }}>
  <View style={{ flex: carbsFlex }}>
    {/* fill view inside */}
  </View>
  <View style={{ flex: proteinFlex }}>
    {/* fill view inside */}
  </View>
  <View style={{ flex: fatFlex }}>
    {/* fill view inside */}
  </View>
</View>
```

### TouchableOpacity with activeOpacity + disabled
```typescript
// Source: React Native TouchableOpacity docs
// activeOpacity controls press-state opacity; disabled disables touch events
<TouchableOpacity
  activeOpacity={0.7}
  disabled={disabled}
  onPress={onPress}
  style={[baseStyle, disabled && { opacity: 0.4 }]}
>
```

### @testing-library/react-native component test pattern (from StepIndicator.test.tsx)
```typescript
// Source: __tests__/components/StepIndicator.test.tsx — established project test pattern
import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../../design/components';

it('renders with body variant by default', () => {
  const { getByText } = render(<Text>Hello</Text>);
  expect(getByText('Hello')).toBeTruthy();
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `components/Themed.tsx` Text/View with dark mode hooks | Direct token imports, no theme context | Phase 5/6 (this project) | New components start from tokens, not Themed.tsx |
| Hardcoded hex colors in components | `colors.*` semantic token imports | Phase 5 (this project) | No hex literals allowed in component files |
| SVG-based progress/calorie bar (TotalCaloriesGraph) | Pure View + flex for MacroProgressBar | Phase 7 (this phase) | Simpler, no SVG font carve-out concerns |

**Deprecated/outdated:**
- `components/Themed.tsx`: Legacy; uses `constants/Colors` + `useColorScheme`. New design components do NOT extend this.
- `components/StyledText.tsx`: Legacy mono-font component. Replaced by `design/components/Text`.
- Direct `fontWeight` strings alongside custom `fontFamily`: Breaks Inter on Android (established Phase 5/6 rule).

## Open Questions

1. **MacroProgressBar when a single macro has no target (target = 0) but others do**
   - What we know: Total target > 0, but one segment target is 0
   - What's unclear: Should that segment have `flex: 0` (invisible) or a minimum visible width?
   - Recommendation: `flex: 0` is correct — a macro with zero target contributes no segment; the bar shows only set targets. This matches "segment widths proportional to gram targets" literally.

2. **Card `style` prop — `ViewStyle` or `StyleProp<ViewStyle>`?**
   - What we know: Claude's Discretion area
   - What's unclear: Whether callers pass arrays of styles
   - Recommendation: Use `StyleProp<ViewStyle>` — it accepts both single objects and arrays, consistent with how RN primitives type their `style` props.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest 29.7.0 + @testing-library/react-native 13.3.3 |
| Config file | `package.json` `jest` key — preset: `react-native` |
| Quick run command | `npx jest __tests__/components/ --no-watchAll` |
| Full suite command | `npm run test:single` (runs all tests once, no watch) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| COMP-01 | Text renders all 9 variants with correct typeScale styles | unit | `npx jest __tests__/components/Text.test.tsx --no-watchAll` | Wave 0 gap |
| COMP-01 | Text `color` prop defaults to `colors.text.primary` | unit | same | Wave 0 gap |
| COMP-01 | Text `style` prop is applied last (caller can override) | unit | same | Wave 0 gap |
| COMP-02 | NumericText applies `fontVariant: ['tabular-nums']` | unit | `npx jest __tests__/components/NumericText.test.tsx --no-watchAll` | Wave 0 gap |
| COMP-02 | NumericText renders variant/color like Text (inheritance) | unit | same | Wave 0 gap |
| COMP-03 | Button renders primary/secondary/ghost variants without crash | unit | `npx jest __tests__/components/Button.test.tsx --no-watchAll` | Wave 0 gap |
| COMP-03 | Button disabled applies opacity 0.4 | unit | same | Wave 0 gap |
| COMP-03 | Button onPress fires when not disabled | unit | same | Wave 0 gap |
| COMP-04 | Card renders children | unit | `npx jest __tests__/components/Card.test.tsx --no-watchAll` | Wave 0 gap |
| COMP-04 | Card `bordered` prop adds border | unit | same | Wave 0 gap |
| COMP-05 | MacroProgressBar renders without crash for zero targets | unit | `npx jest __tests__/components/MacroProgressBar.test.tsx --no-watchAll` | Wave 0 gap |
| COMP-05 | MacroProgressBar caps fill at 100% when logged > target | unit | same | Wave 0 gap |
| COMP-05 | MacroProgressBar uses `colors.macro.*` tokens (no hex literals) | unit/structural | same | Wave 0 gap |

### Sampling Rate
- **Per task commit:** `npx jest __tests__/components/<ComponentName>.test.tsx --no-watchAll`
- **Per wave merge:** `npx jest __tests__/components/ --no-watchAll`
- **Phase gate:** Full suite green (`npm run test:single`) before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `__tests__/components/Text.test.tsx` — covers COMP-01
- [ ] `__tests__/components/NumericText.test.tsx` — covers COMP-02
- [ ] `__tests__/components/Button.test.tsx` — covers COMP-03
- [ ] `__tests__/components/Card.test.tsx` — covers COMP-04
- [ ] `__tests__/components/MacroProgressBar.test.tsx` — covers COMP-05

Note: No new jest config, mocks, or framework installs needed. `@testing-library/react-native` 13.3.3 is already installed. The `react-native` preset in `package.json` handles all RN module transforms.

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection: `design/tokens/colors.ts`, `typography.ts`, `spacing.ts`, `radius.ts` — all token shapes verified
- Direct codebase inspection: `__tests__/components/StepIndicator.test.tsx` — test pattern verified
- Direct codebase inspection: `components/TotalCaloriesGraph/components/MultipleMacroBarWithContainer.tsx` — existing segmented bar pattern (SVG) for reference contrast
- Direct codebase inspection: `package.json` — all dependencies and versions verified
- `.planning/phases/07-component-library/07-CONTEXT.md` — all locked decisions

### Secondary (MEDIUM confidence)
- React Native documentation: `fontVariant: ['tabular-nums']` is a standard `TextStyle` property available since RN 0.55+; this project uses RN 0.84.1

### Tertiary (LOW confidence)
- None. All findings are grounded in direct codebase inspection and established project patterns.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified in package.json; no new installs
- Architecture: HIGH — token shapes read directly; patterns established by Phases 5/6 and enforced by existing tests
- Pitfalls: HIGH — derived from direct reading of existing component code and locked decision rationale
- Test patterns: HIGH — StepIndicator.test.tsx and paperTheme.test.ts read directly; framework confirmed installed

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable — no new library versions anticipated; all work is within the existing codebase)
