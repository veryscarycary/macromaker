# Phase 4: Onboarding UX Polish - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Polish the existing 3-screen onboarding modal (Welcome → BasicInfo → MoreInfo). Deliver a progress indicator, fix the button label, add keyboard avoidance, add unit labels, pre-fill sensible defaults, enforce required fields cleanly, and unify button styles within the onboarding screens. No new screens, no new data collected, no app-wide design system work.

</domain>

<decisions>
## Implementation Decisions

### Progress Indicator (ONBR-01)
- Style: 3 dots (filled = visited/current, unfilled = upcoming) — no text, no bar
- Position: top center, below safe area, fixed above scrollable content on each screen
- Welcome = Step 1 of 3 (all 3 screens show the indicator)
  - Welcome:   ● ○ ○
  - BasicInfo: ● ● ○
  - MoreInfo:  ● ● ●
- No existing progress component — needs a small new component (inline or shared)

### Button Labels (ONBR-02)
- BasicInfo CTA: "Continue" (was "Calculate BMI")
- MoreInfo CTA: "Get Started" (was "Finish")
- Welcome CTA: "Get Started" (unchanged — already correct)

### Keyboard Handling (ONBR-03)
- BasicInfoScreen needs KeyboardAvoidingView wrapping the form so inputs stay visible when keyboard opens
- Behavior: `padding` on iOS (standard RN pattern), no adjustment on Android (ScrollView handles it)

### Unit Labels (ONBR-04)
- Weight: inline suffix label "lbs" to the right of the input box — always visible even after typing
- Age: no unit label (self-explanatory)
- Height: already handled by existing ft/in section labels and button group — no change needed

### Default Values (ONBR-05)
- Defaults are pre-filled values (not placeholder hints) — user sees real values they can edit
  - Weight: 150 lbs
  - Height: 5 ft 10 in (height selector has 5 and 10 pre-selected)
  - Age: 30
  - Name: blank (personal — no sensible default)
- InfoContext default state must be updated to match

### Required Field Enforcement
- Name is the only field without a default — it must be filled before advancing
- Weight and Age have defaults so they start > 0; user cannot clear them to 0 without seeing the button re-disable
- When user taps "Continue" and Name is empty: red border on the Name input + brief helper text below ("Name is required" or similar)
- Button remains disabled while name is empty; this behavior is already implemented — the red border is additive feedback layered on top

### Button Style Unification (onboarding screens only)
- All 3 onboarding CTA buttons: purple brand color + white text, consistent border radius and padding
- Currently: WelcomeScreen and MoreInfoScreen buttons have default (black) text — fix both
- BasicInfoScreen already has white text on enabled state — keep; disabled state stays gray
- Exact purple shade: Claude's discretion — keep close to existing #7078df but may adjust for white-text readability and dark/light mode legibility

### Claude's Discretion
- Exact purple shade for unified button color (stay near #7078df, optimize for white text contrast)
- Progress dot size, spacing, and exact color for filled vs unfilled states
- Helper text copy for required field error ("Name is required" etc.)
- Whether to extract a shared `StepIndicator` component or inline the dots per screen

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/Spacer.tsx` — used in WelcomeScreen; available for spacing
- `components/DismissKeyboardView.tsx` — already wraps forms in all 3 screens; KeyboardAvoidingView wraps around this
- `context/InfoContext.tsx` — default state values need updating (age, weight, heightFeet, heightInches)
- `screens/InfoModal/ModalScreen.tsx` — ModalStack.Navigator with headerShown: false; no changes needed here

### Existing Button Inconsistency
- `WelcomeScreen` button: `backgroundColor: '#7078df'`, text uses `<Text>Get Started</Text>` with no explicit color → renders black
- `BasicInfoScreen` button: `backgroundColor: '#7078df'`, `buttonText: { color: '#ffffff' }` (enabled), `buttonTextDisabled: { color: '#7d7d7d' }` — already correct for enabled state
- `MoreInfoScreen` button: `backgroundColor: '#7078df'`, text uses `<Text>Finish</Text>` with no explicit color → renders black

### Integration Points
- `context/InfoContext.tsx` → update default reducer state for age (30), weight (150), heightFeet (5), heightInches (10)
- `screens/InfoModal/screens/BasicInfoScreen.tsx` → add dots, KeyboardAvoidingView, weight suffix label, validation state, button label
- `screens/InfoModal/screens/WelcomeScreen.tsx` → add dots, fix button text color
- `screens/InfoModal/screens/MoreInfoScreen.tsx` → add dots, change button label, fix button text color

### Established Patterns
- Height is already a segmented button selector (not a TextInput) — defaults just mean pre-selecting 5 ft and 10 in buttons
- `isBasicInfoComplete` in BasicInfoScreen already gates the button — validation state adds red border on top of this
- App uses `useWindowDimensions()` + `isCompact` pattern for small-screen adaptations — maintain this in any new layout elements

</code_context>

<specifics>
## Specific Ideas

- User wants eventual app-wide design system consistency with white text on brand-colored buttons — onboarding is the first step
- Existing purple (#7078df) is the brand anchor; Claude may adjust the shade slightly for better contrast/legibility
- Keep polish changes minimal and non-disruptive to existing layout — add, don't redesign

</specifics>

<deferred>
## Deferred Ideas

- App-wide button style unification (all screens beyond onboarding) — future design system phase
- Animated slide transitions between onboarding steps (already noted in REQUIREMENTS.md Out of Scope: "Blocked until Reanimated 4 is stable; P2 polish")
- Macro % slider sum validation on MoreInfoScreen — REQUIREMENTS.md Out of Scope: "defer until onboarding polish is shipped"

</deferred>

---

*Phase: 04-onboarding-ux-polish*
*Context gathered: 2026-03-13*
