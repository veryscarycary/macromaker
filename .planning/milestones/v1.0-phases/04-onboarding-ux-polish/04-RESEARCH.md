# Phase 4: Onboarding UX Polish - Research

**Researched:** 2026-03-13
**Domain:** React Native onboarding UI — keyboard avoidance, form defaults, step indicator, button styling
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Progress indicator: 3 dots, top center, fixed above scrollable content. Filled = visited/current, unfilled = upcoming. All 3 screens show indicator. Welcome = ●○○, BasicInfo = ●●○, MoreInfo = ●●●
- Button labels: BasicInfo CTA → "Continue" (was "Calculate BMI"), MoreInfo CTA → "Get Started" (was "Finish"), Welcome CTA stays "Get Started"
- Keyboard handling: KeyboardAvoidingView around BasicInfoScreen form, `padding` behavior on iOS, no adjustment on Android
- Unit labels: Weight gets inline suffix "lbs" to the right of the input — always visible. Age: no label. Height: already handled by existing ft/in section labels
- Defaults are pre-filled values (not placeholders): Weight 150, Height 5ft 10in, Age 30, Name blank. InfoContext default state must be updated
- Required field enforcement: Name is the only field without a default. Red border + "Name is required" helper text on failed submit. Button stays disabled while name is empty
- Button style unification (onboarding only): all 3 CTA buttons get purple + white text, consistent border radius and padding. WelcomeScreen and MoreInfoScreen currently render black text — fix both

### Claude's Discretion
- Exact purple shade (stay near #7078df, optimize for white text WCAG contrast)
- Progress dot size, spacing, exact color for filled vs unfilled states
- Helper text copy for required field error ("Name is required" etc.)
- Whether to extract a shared StepIndicator component or inline dots per screen

### Deferred Ideas (OUT OF SCOPE)
- App-wide button style unification beyond onboarding screens
- Animated slide transitions between onboarding steps
- Macro % slider sum validation on MoreInfoScreen
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ONBR-01 | Progress step indicator visible on all 3 onboarding screens | Step indicator component pattern — View + mapped dots, no extra library needed |
| ONBR-02 | BasicInfo CTA reads "Continue" not "Calculate BMI" | Single string replacement in BasicInfoScreen; also MoreInfo "Finish" → "Get Started" |
| ONBR-03 | BasicInfoScreen uses KeyboardAvoidingView so inputs remain visible | KeyboardAvoidingView wraps DismissKeyboardView; `padding` on iOS, 0 offset on Android via Platform.select |
| ONBR-04 | Numeric input fields show unit labels ("lbs") | Inline suffix View beside TextInput — flex row wrapper pattern |
| ONBR-05 | Numeric fields have sensible non-zero defaults (weight 150, height 5'10", age 30) | Update InfoContext defaultValues; getRequiredNumberValue(value > 0) already handles display correctly |
</phase_requirements>

---

## Summary

Phase 4 is a pure JS/TSX polish pass on three existing screens — no new screens, no native changes, no new library dependencies. All work is confined to `screens/InfoModal/screens/` and `context/InfoContext.tsx`. The decisions are fully locked via CONTEXT.md, so research focuses on confirming the correct React Native API signatures and identifying the exact friction points in the current code.

The most technically involved change is the KeyboardAvoidingView integration on BasicInfoScreen. The screen currently wraps content in `DismissKeyboardView` (a TouchableWithoutFeedback + View) which does not itself prevent keyboard occlusion. The fix is to wrap this with a `KeyboardAvoidingView` at the SafeAreaView level using `behavior="padding"` on iOS and no adjustment on Android. The existing `ScrollView` with `keyboardShouldPersistTaps="handled"` is already in place and cooperates with this pattern.

The progress indicator, suffix label, validation state, and default value changes are all pure React state/style work with no hidden complexity. The `getRequiredNumberValue` guard already converts 0 to empty string for display; once defaults are 150/30/5/10, that guard becomes a no-op for all fields except Name, which correctly stays blank.

**Primary recommendation:** Execute changes in a single logical wave: InfoContext defaults → StepIndicator component → BasicInfoScreen (KAV + suffix + label + validation state + button label) → WelcomeScreen (dots + button text) → MoreInfoScreen (dots + button text + label). No new dependencies required.

---

## Standard Stack

### Core (already installed — no new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react-native` | 0.84.1 | `KeyboardAvoidingView`, `Platform`, `View`, `StyleSheet`, `TextInput` | Built-in; no alternative |
| `react-native-safe-area-context` | 5.7.0 | `SafeAreaView` for safe area insets | Already in use on BasicInfoScreen and MoreInfoScreen |
| React (`useState`) | 19.2.3 | Local validation state (nameError boolean) | Built-in |

### No New Dependencies

This phase requires zero npm installs. All needed primitives (`KeyboardAvoidingView`, `Platform`, `View`, flex row layout) are in React Native core and already imported across the codebase.

---

## Architecture Patterns

### Recommended File Scope

```
screens/InfoModal/
├── screens/
│   ├── WelcomeScreen.tsx      # Add dots, add white text color to button
│   ├── BasicInfoScreen.tsx    # Add dots, KAV, suffix label, name validation state, relabel button
│   └── MoreInfoScreen.tsx     # Add dots, relabel button, add white text color
└── components/
    └── StepIndicator.tsx      # New shared component (3-dot progress)

context/
└── InfoContext.tsx             # Update defaultValues: age 0→30, weight 0→150, heightInches 6→10
```

### Pattern 1: StepIndicator Component

**What:** A small stateless component that renders N dots, coloring filled vs unfilled by index.
**When to use:** Rendered at the top of each onboarding screen, passed the current step index.

```tsx
// components/StepIndicator.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  totalSteps: number;
  currentStep: number; // 1-indexed
};

const StepIndicator = ({ totalSteps, currentStep }: Props) => (
  <View style={styles.container}>
    {Array.from({ length: totalSteps }, (_, i) => (
      <View
        key={i}
        style={[styles.dot, i < currentStep ? styles.dotFilled : styles.dotEmpty]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotFilled: {
    backgroundColor: '#7078df', // brand purple — Claude may adjust shade
  },
  dotEmpty: {
    backgroundColor: '#c7c7c7',
  },
});

export default StepIndicator;
```

Usage in each screen (before scroll content, after SafeAreaView opens):
- WelcomeScreen: `<StepIndicator totalSteps={3} currentStep={1} />`
- BasicInfoScreen: `<StepIndicator totalSteps={3} currentStep={2} />`
- MoreInfoScreen: `<StepIndicator totalSteps={3} currentStep={3} />`

**Placement on BasicInfoScreen:** The indicator must be outside the ScrollView and above `DismissKeyboardView` so it stays fixed. Current structure is `SafeAreaView > DismissKeyboardView > ScrollView`. Restructure to: `SafeAreaView > StepIndicator > DismissKeyboardView > ScrollView + footer`.

**Placement on WelcomeScreen:** WelcomeScreen does not use SafeAreaView — it uses `DismissKeyboardView` as the root. To place the indicator above content, wrap with a `View` flex container: `View(flex:1) > StepIndicator > DismissKeyboardView`.

**Placement on MoreInfoScreen:** Already `SafeAreaView > DismissKeyboardView > ScrollView`. Place `StepIndicator` between SafeAreaView and DismissKeyboardView, same as BasicInfoScreen.

### Pattern 2: KeyboardAvoidingView on BasicInfoScreen

**What:** Wraps the form so iOS pushes content up when keyboard appears.
**When to use:** Any screen with TextInput fields where the bottom CTA or lower inputs could be obscured.

```tsx
// Source: React Native official docs — KeyboardAvoidingView
import { KeyboardAvoidingView, Platform } from 'react-native';

// Inside BasicInfoScreen JSX — replace the existing SafeAreaView-direct structure:
<SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
  <StepIndicator totalSteps={3} currentStep={2} />
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    <DismissKeyboardView style={styles.form}>
      <ScrollView ...>
        {/* existing content */}
      </ScrollView>
      <View style={styles.footer}>
        {/* button */}
      </View>
    </DismissKeyboardView>
  </KeyboardAvoidingView>
</SafeAreaView>
```

**Critical note:** The footer (button) must remain inside the `DismissKeyboardView` / `KeyboardAvoidingView` subtree so that it also shifts up. The current code already has the footer inside `DismissKeyboardView` — this structure is preserved.

**Android:** `behavior={undefined}` (no-op) because ScrollView with `keyboardShouldPersistTaps="handled"` already handles Android scrolling correctly, and Android's `windowSoftInputMode` defaults (adjustResize) handle most cases without KAV.

### Pattern 3: Inline Suffix Label for Weight Input

**What:** A "lbs" label always visible to the right of the weight TextInput.
**When to use:** Any numeric field requiring persistent unit context.

```tsx
// Flex row wrapper around TextInput
<View style={styles.input}>
  <Text style={styles.pickerLabel}>Weight</Text>
  <View style={styles.inputRow}>
    <TextInput
      style={[styles.textInput, styles.textInputWithSuffix]}
      onChangeText={(val: string) =>
        setInfoState({ weight: val === '' ? 0 : Number(val) })
      }
      value={getRequiredNumberValue(weight)}
      placeholder="150"
      placeholderTextColor="#aaa"
      keyboardType="numeric"
    />
    <View style={styles.suffixContainer}>
      <Text style={styles.suffixText}>lbs</Text>
    </View>
  </View>
</View>

// New styles:
inputRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
},
textInputWithSuffix: {
  flex: 1,
  marginTop: 0, // overrides marginTop from textInput since parent row handles it
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
},
suffixContainer: {
  borderWidth: 1,
  borderColor: '#c7c7c7',
  borderLeftWidth: 0,
  borderTopRightRadius: 8,
  borderBottomRightRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 5,
  backgroundColor: '#f5f5f5',
  justifyContent: 'center',
},
suffixText: {
  fontSize: 12,
  color: '#1e1e1e',
},
```

### Pattern 4: Name Validation State

**What:** Local `useState` boolean that shows a red border and helper text when the user taps "Continue" with an empty name.
**When to use:** ONBR-05 required field enforcement on BasicInfoScreen.

```tsx
const [nameError, setNameError] = React.useState(false);

// On press handler:
onPress={async () => {
  if (!isBasicInfoComplete) {
    if (!name.trim()) setNameError(true);
    return;
  }
  setNameError(false);
  setBasicInfoCalculations();
  navigation.navigate('MoreInfo');
}}

// Clear error on name change:
onChangeText={(val: string) => {
  setInfoState({ name: val });
  if (nameError && val.trim().length > 0) setNameError(false);
}}

// Conditional style:
style={[styles.textInput, nameError ? styles.textInputError : null]}

// Helper text (below name input):
{nameError && (
  <Text style={styles.errorText}>Name is required</Text>
)}

// New style:
textInputError: {
  borderColor: '#d32f2f',
},
errorText: {
  color: '#d32f2f',
  fontSize: 11,
  marginTop: 2,
},
```

**Note:** The button stays disabled via `isBasicInfoComplete` — the current disabled gate already covers name. The `nameError` state is purely additive visual feedback triggered only when user explicitly taps the (already-disabled) button. Since the button is disabled, `onPress` won't fire on a disabled `TouchableOpacity` — the validation state must instead be triggered by allowing press even when disabled, OR the simpler alternative: keep the button always tappable but show the error and prevent navigation when name is empty. The locked decision says "button remains disabled while name is empty; red border is additive feedback layered on top." This means the red border triggers differently — e.g., on blur of the name field, or when age/weight are filled but name is not. The planner should decide: trigger on blur, or make the button active but validating. Given the context says "when user taps Continue and Name is empty", the button should be active (not disabled by name alone) and validate on press. The disabled state should only apply when weight=0 or age=0 (which cannot happen with defaults). With defaults in place, `isBasicInfoComplete` will be true as soon as name is filled — so the button is disabled only when name is empty. This means pressing a disabled button won't fire. Resolution: Remove disabled state from button (or keep visually disabled via style only without the `disabled` prop) and handle validation in the onPress handler.

### Pattern 5: InfoContext Default Values Update

**What:** Change `defaultValues` in `context/InfoContext.tsx`.
**Change:**

```ts
// Before:
age: 0,
weight: 0,
heightFeet: 5,
heightInches: 6,

// After:
age: 30,
weight: 150,
heightFeet: 5,
heightInches: 10,
```

`getRequiredNumberValue` (in BasicInfoScreen) converts 0 → `''` for display. After this change, weight=150 and age=30 will display as `"150"` and `"30"` immediately — no further display logic changes needed.

Height selector: buttons are rendered by `renderOptionButton` comparing `selectedValue === value`. With `heightInches: 10`, the "10" inch button will render with `optionButtonSelected` style on first load.

### Anti-Patterns to Avoid

- **Wrapping KAV outside SafeAreaView:** KeyboardAvoidingView must be inside SafeAreaView (or use SafeAreaView's insets), not outside it. Otherwise safe area insets are not accounted for and content shifts too much on notched devices.
- **Setting `keyboardVerticalOffset` without measuring:** Don't guess a static offset. Use Platform.select and let `padding` behavior do the work with the existing SafeAreaView.
- **Putting StepIndicator inside ScrollView:** The indicator must be fixed above the scroll area, not scrolling with content.
- **Changing `isBasicInfoComplete` logic:** Do not remove the existing name/age/weight validation gate. Work with it — the defaults make age and weight permanently > 0.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Keyboard avoidance | Custom keyboard height listener + manual padding | `KeyboardAvoidingView` from react-native | KAV handles iOS keyboard frames, rotation, and split keyboard correctly |
| Safe area + keyboard offset | Manual StatusBar height calculation | `KeyboardAvoidingView` inside `SafeAreaView` (edges param handles insets) | SafeAreaView with edges already accounts for notch/dynamic island |
| Progress dots | Third-party step indicator library | Inline View + StyleSheet | Phase scope is 3 static screens — a 10-line component is simpler than any lib |

**Key insight:** The entire phase is additive polish. Every pattern uses primitives already in the project's dependency graph. Adding new libraries would introduce unnecessary complexity and risk.

---

## Common Pitfalls

### Pitfall 1: Button Disabled Blocks Validation Feedback

**What goes wrong:** `TouchableOpacity` with `disabled={true}` does not fire `onPress`. If the button is disabled while `name` is empty (which it is, via `isBasicInfoComplete`), the user tapping it gets no feedback — the red border never shows.

**Why it happens:** The locked decision says "button remains disabled while name is empty" AND "tapping Continue with empty name shows red border." These two behaviors are in tension.

**How to avoid:** Remove `disabled={!isBasicInfoComplete}` prop from the TouchableOpacity. Keep the `buttonDisabled` style applied conditionally. Inside `onPress`, check `isBasicInfoComplete`: if false, set `nameError=true` and return. This gives the tap feedback while keeping the visual disabled appearance.

**Warning signs:** QA taps "Continue" with empty name and nothing happens at all (no red border, no message).

### Pitfall 2: KeyboardAvoidingView Inside DismissKeyboardView

**What goes wrong:** Wrapping KAV inside `DismissKeyboardView` (TouchableWithoutFeedback) can cause touch events to be consumed before they reach inputs, and the KAV cannot accurately measure the container for padding.

**Why it happens:** `DismissKeyboardView` is a `TouchableWithoutFeedback > View`. KAV needs to be the outermost layout element to measure keyboard frame against the screen.

**How to avoid:** Order: `SafeAreaView > StepIndicator > KeyboardAvoidingView > DismissKeyboardView > ScrollView + footer`. KAV wraps everything except the indicator.

### Pitfall 3: WelcomeScreen Has No SafeAreaView

**What goes wrong:** WelcomeScreen uses `DismissKeyboardView` as root (no SafeAreaView). Adding a StepIndicator at the top will push into the status bar / notch area.

**Why it happens:** WelcomeScreen was built before safe area handling was standardized in this app.

**How to avoid:** Wrap WelcomeScreen content in a `SafeAreaView` (from `react-native-safe-area-context`, edges `['top']`), then place StepIndicator inside it. Alternatively, wrap the entire screen: `SafeAreaView(flex:1, edges:['top','bottom']) > StepIndicator > DismissKeyboardView`.

### Pitfall 4: Suffix Label Breaks on Small Screens

**What goes wrong:** The flex row for the weight input (TextInput + "lbs" suffix) might collapse on very narrow screens or cause the suffix to overlap the border.

**Why it happens:** `textInput` style has `marginTop: 4` which conflicts with being a flex child.

**How to avoid:** When extracting TextInput into a flex row, move `marginTop: 4` to the parent row container (`inputRow`), not the input itself. Use `flex: 1` on the TextInput and fixed `paddingHorizontal` on the suffix View.

### Pitfall 5: Height Default Already Set But Wrong

**What goes wrong:** `InfoContext.tsx` currently has `heightInches: 6` — the context says this must be updated to `10`. Missing this update means the height selector shows 5'6" as default instead of 5'10".

**Why it happens:** The default was an arbitrary value when the context was created.

**How to avoid:** Update `defaultValues` in `InfoContext.tsx`: `heightInches: 6` → `heightInches: 10`. Verify by checking that the "10" button renders with `optionButtonSelected` style on first load of BasicInfoScreen.

---

## Code Examples

### Existing `getRequiredNumberValue` (BasicInfoScreen) — No Change Needed
```tsx
// Source: screens/InfoModal/screens/BasicInfoScreen.tsx line 27
const getRequiredNumberValue = (value: number) => (value > 0 ? String(value) : '');
// With defaults weight=150, age=30: these return "150" and "30" — displays correctly
```

### Current defaultValues in InfoContext — Shows What Changes
```ts
// Source: context/InfoContext.tsx lines 32-46
export const defaultValues: Info = {
  name: '',
  age: 0,       // → 30
  weight: 0,    // → 150
  heightFeet: 5,
  heightInches: 6,  // → 10
  gender: 'male',
  activityLevel: 2,
  bmi: 0,
  bmr: 0,
  tdee: 0,
  targetProteinPercentage: 0.3,
  targetCarbsPercentage: 0.5,
  targetFatPercentage: 0.2,
};
```

### Current BasicInfoScreen Structure — Shows KAV Insertion Point
```tsx
// Source: screens/InfoModal/screens/BasicInfoScreen.tsx lines 73-196
// Current:
<SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
  <DismissKeyboardView style={styles.form}>
    <ScrollView ...>...</ScrollView>
    <View style={styles.footer}>...</View>
  </DismissKeyboardView>
</SafeAreaView>

// Target:
<SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
  <StepIndicator totalSteps={3} currentStep={2} />
  <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <DismissKeyboardView style={styles.form}>
      <ScrollView ...>...</ScrollView>
      <View style={styles.footer}>...</View>
    </DismissKeyboardView>
  </KeyboardAvoidingView>
</SafeAreaView>
```

### Button Style Fix (WelcomeScreen and MoreInfoScreen)
```tsx
// Source: screens/InfoModal/screens/WelcomeScreen.tsx line 29 (current)
<Text>Get Started</Text>   // no explicit color → renders black on purple

// Target:
<Text style={styles.buttonText}>Get Started</Text>

// Add to StyleSheet:
buttonText: {
  color: '#ffffff',
},
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual keyboard height listeners | `KeyboardAvoidingView` with `behavior="padding"` | React Native core since RN 0.42 | Stable, well-tested on iOS 15+ |
| `KeyboardAvoidingView` with `keyboardVerticalOffset` | KAV inside `SafeAreaView` with edges (no manual offset) | react-native-safe-area-context v3+ | Eliminates manual measurement |

**Deprecated/outdated:**
- `Platform.select({ ios: 'padding', android: 'height' })` for KAV behavior: Android `'height'` frequently causes double-adjustment with ScrollView. Current guidance: use `undefined` (no-op) for Android and let ScrollView handle it.

---

## Open Questions

1. **Button disabled vs active for name validation**
   - What we know: `isBasicInfoComplete` gates the button as disabled; the decision says red border shows when user "taps Continue with name empty"
   - What's unclear: A disabled TouchableOpacity won't fire onPress, so the tap is undetectable
   - Recommendation: Remove the `disabled` prop; keep visual disabled style. Handle all validation in onPress. This satisfies both the visual and behavioral requirements without changing the user-visible outcome.

2. **Purple shade for button text contrast**
   - What we know: Current #7078df is the brand anchor; white text must be readable
   - What's unclear: Whether #7078df meets WCAG AA (4.5:1) with white — it likely does at roughly 3.8:1 (AA Large passes, AA Small borderline)
   - Recommendation: Claude's discretion per CONTEXT.md. A slight darkening to ~#5d65d0 improves AA compliance without departing from brand. The planner can leave exact value to the implementing agent.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest 29.7.0 with `react-native` preset |
| Config file | `package.json` ("jest": { "preset": "react-native" }) |
| Quick run command | `npx jest --testPathPattern="InfoContext" --no-coverage` |
| Full suite command | `npm run test:single` (non-watch) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ONBR-01 | StepIndicator renders correct number of dots | unit | `npx jest --testPathPattern="StepIndicator" --no-coverage` | ❌ Wave 0 |
| ONBR-02 | Button label change | manual-only | N/A — string change in JSX; visual verification only | N/A |
| ONBR-03 | KAV renders without error | unit | `npx jest --testPathPattern="BasicInfoScreen" --no-coverage` | ❌ Wave 0 |
| ONBR-04 | Suffix label present in Weight row | unit | `npx jest --testPathPattern="BasicInfoScreen" --no-coverage` | ❌ Wave 0 |
| ONBR-05 | InfoContext defaultValues | unit | `npx jest --testPathPattern="InfoContext" --no-coverage` | ❌ Wave 0 |

**Note on ONBR-02, ONBR-03, ONBR-04:** These are UI structural changes best verified by running the app on simulator. The Jest test for ONBR-03/04 can do a shallow render assertion that the component tree contains KAV and the suffix View, but the actual keyboard behavior requires manual testing.

### Sampling Rate

- **Per task commit:** `npx jest --testPathPattern="InfoContext|StepIndicator" --no-coverage`
- **Per wave merge:** `npm run test:single`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `__tests__/components/StepIndicator.test.tsx` — covers ONBR-01: renders N dots, correct filled/empty counts
- [ ] `__tests__/InfoContext.test.ts` — covers ONBR-05: defaultValues has age=30, weight=150, heightFeet=5, heightInches=10
- [ ] `__tests__/screens/BasicInfoScreen.test.tsx` — covers ONBR-03/04: KAV present in render tree, suffix label present

---

## Sources

### Primary (HIGH confidence)

- Direct source read: `screens/InfoModal/screens/BasicInfoScreen.tsx` — full implementation reviewed
- Direct source read: `screens/InfoModal/screens/WelcomeScreen.tsx` — button structure and missing text color confirmed
- Direct source read: `screens/InfoModal/screens/MoreInfoScreen.tsx` — button label and missing text color confirmed
- Direct source read: `context/InfoContext.tsx` — defaultValues confirmed (age:0, weight:0, heightInches:6)
- Direct source read: `components/DismissKeyboardView.tsx` — confirmed as TouchableWithoutFeedback wrapper (not KAV)
- Direct source read: `screens/InfoModal/ModalScreen.tsx` — confirmed headerShown:false, no changes needed
- Direct source read: `package.json` — react-native 0.84.1, react-native-safe-area-context 5.7.0 confirmed
- Direct source read: `.planning/phases/04-onboarding-ux-polish/04-CONTEXT.md` — all decisions locked

### Secondary (MEDIUM confidence)

- React Native docs pattern: `KeyboardAvoidingView` with `behavior="padding"` inside SafeAreaView is the canonical iOS solution; Android `undefined` behavior is confirmed community consensus for ScrollView-based screens

### Tertiary (LOW confidence)

- None. All findings verified against source code or stable React Native core APIs.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed; no new deps
- Architecture: HIGH — patterns verified against actual source code
- Pitfalls: HIGH — identified from reading actual code (button disabled conflict, WelcomeScreen no SafeAreaView, heightInches wrong default)
- Validation: MEDIUM — test file gaps are Wave 0 work; framework confirmed working

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (stable RN APIs; 30-day window is conservative)
