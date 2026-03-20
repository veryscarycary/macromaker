# Phase 7: Component Library - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Create the core reusable UI component set in `design/components/` — `Text`, `NumericText`, `Button`, `Card`, and `MacroProgressBar`. All components consume design tokens directly. No screen migration in this phase — that is Phase 8.

</domain>

<decisions>
## Implementation Decisions

### MacroProgressBar layout
- Segmented horizontal bar: one bar divided into 3 colored fills (carbs, protein, fat)
- Segment widths are proportional to **gram targets** (not calorie targets) — easier to reason about while logging
- Fill within each segment = logged grams / target grams for that macro (progress toward target)
- Segment colors from `colors.macro.*` tokens (carbs=blue, protein=violet, fat=amber)
- When a macro exceeds its gram target: cap fill at 100%, shift fill color to `colors.status.error` (red)
- The existing calorie graph (TotalCaloriesGraph above) handles calorie progress — MacroProgressBar handles gram progress

### Button variants
- **Primary**: filled `brand.primary` background, `text.inverse` label, `radius.md` corners, full-width by default
- **Secondary**: no fill, `brand.primary` border + `brand.primary` label text (outline style)
- **Ghost**: no fill, no border, `brand.primary` label text only
- Press feedback: `activeOpacity` on `TouchableOpacity` — opacity fade, no Reanimated needed
- Disabled state: `opacity: 0.4` applied to the full button
- No icon prop — text only for v1.1

### Text component API
- Single `<Text variant="heading">` component (not named exports per variant)
- `variant` prop maps to `typeScale` keys: display, heading, subheading, body, bodyMedium, bodySmall, caption, label, overline
- `color?: string` prop defaults to `colors.text.primary` — callers override for secondary/tertiary text
- `style?: StyleProp<TextStyle>` accepted and spread last — callers can tweak margin, textAlign, etc.
- Extends React Native `Text` props (accessible, selectable, numberOfLines all work)

### NumericText
- Extends `Text` API — same variant/color/style props
- Always adds `fontVariant: ['tabular-nums']` to style — fixed-width digits, no layout shift on value change
- Used for all calorie and macro number displays

### Card scope
- Minimal surface container — not opinionated about content structure
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

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `design/tokens/colors.ts`: `colors.macro.*`, `colors.brand.*`, `colors.surface.*`, `colors.text.*`, `colors.status.error` — all ready for direct import
- `design/tokens/typography.ts`: `typeScale` and `fontFamilies` — `Text` component builds on these directly
- `design/tokens/spacing.ts`, `design/tokens/radius.ts` — Card padding and radius pull from here
- `components/Themed.tsx`: legacy Text/View wrappers (reference `constants/Colors`) — new components replace these; do NOT build on them

### Established Patterns
- Token import pattern: `import { colors } from '../../design/tokens'` directly into `StyleSheet.create` — no runtime theme
- `fontWeight` must NEVER be set alongside Inter `fontFamily` strings (enforced by Phase 6 decisions)
- SVG graph `<Text>` (BarGraph, MealTimeGraph) stays on system fonts — not in scope for this component library
- `design/components/` is empty — all 5 components are net-new files

### Integration Points
- Components land in `design/components/` — Phase 8 imports from here to replace raw RN primitives
- Barrel export at `design/components/index.ts` — screens import `{ Text, Button, Card }` from there
- `PAPR-03` (PaperProvider wiring in App.tsx) is a Phase 6 carry-over — component library does NOT depend on PaperProvider; components use StyleSheet + tokens directly

</code_context>

<specifics>
## Specific Ideas

- MacroProgressBar gram-based segments chosen deliberately for legibility while logging — user noted "easier to reason about" than calorie-based widths
- The calorie TotalCaloriesGraph above the bar already handles calorie context; MacroProgressBar is the gram-progress companion

</specifics>

<deferred>
## Deferred Ideas

- Icon wrapper component for consistent sizing over raw vector-icon calls — v2 (DS-04 in REQUIREMENTS.md)
- Animated MacroProgressBar fill via Reanimated — v2 (DS-02)
- Shadow tokens on Card — v2 (DS-03, shadow.ts is a stub)
- EmptyState component — v2 (DS-05)
- Button with icon prop — can add in a later phase if screens need it

</deferred>

---

*Phase: 07-component-library*
*Context gathered: 2026-03-20*
