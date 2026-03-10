# Feature Research

**Domain:** Mobile macro/nutrition tracking app (React Native, local-only)
**Researched:** 2026-03-10
**Confidence:** MEDIUM — competitor patterns verified via multiple sources; RN-specific onboarding UX from official community sources; aggregate view patterns from app store analysis and nutrition blog reviews.

---

## Milestone Scope

This milestone targets two things on an already-functional app:

1. **Onboarding polish** — the Welcome → BasicInfo → MoreInfo modal flow is identified as the roughest UX area.
2. **7-day running average view** — aggregate/trend data for macro/calorie consistency.

The feature research below is scoped to these two areas plus domain-wide context for completeness.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist in any credible nutrition tracker. Missing = product feels incomplete or amateur.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Progress indicator in multi-step onboarding | Users need to know how many steps remain; "Am I almost done?" anxiety causes abandonment | LOW | Dots or step N-of-M label; Reanimated transition between steps. Current flow has no indicator — this is the most visible polish gap. |
| Back navigation during onboarding | Users make mistakes; back button on BasicInfo is absent | LOW | Stack navigator back arrow or explicit back button; preserve entered state across navigation |
| Sensible default values in onboarding forms | Forms pre-populated with typical values reduce required keystrokes | LOW | Age 30, weight 160 lbs, 5'9", Moderate activity. Zero defaults (current behavior) feel broken. |
| "Next" CTA is visually prominent and labeled clearly | Ambiguously labeled CTAs ("Calculate BMI") confuse flow intent | LOW | Replace "Calculate BMI" with "Next" or "Continue"; show calculation result on the results screen without making calculation the CTA label |
| Keyboard-aware layout (fields don't hide behind keyboard) | Text inputs under the native keyboard = impossible to type | MEDIUM | `KeyboardAvoidingView` or `react-native-keyboard-aware-scroll-view`; current `DismissKeyboardView` only handles dismiss, not avoidance |
| Calorie total prominently shown | Users orient to "how many calories today?" first | LOW | Already exists; must remain above the fold |
| Today's macro breakdown (carbs/protein/fat in grams and %) | Core feature; users compare against targets | LOW | Already exists |
| History view (past days) | Users track trends manually; need to look back | LOW | Already exists |
| Edit/delete logged meals | Logging errors are universal | LOW | Already exists |
| Daily macro target vs. actual comparison | Users measure compliance | LOW | Already exists via graphs |

### Differentiators (Competitive Advantage)

Features that align with the app's core value ("under 10 seconds to see your day") and aren't universally present at this quality level.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| 7-day running average panel | Smooths out noisy single-day data; users think in weekly patterns, not daily; MacroFactor built its reputation on this | MEDIUM | Rolling 7-day window: avg calories, avg carbs/protein/fat. Show in history tab or as a summary card. Requires `getAveragesFromDietDays` which already exists in `utils.ts`. |
| Onboarding result screen as motivation | Showing BMI/BMR/TDEE results as a "here's your body baseline" moment (not just a form step) creates an "aha" moment users remember | LOW | MoreInfoScreen already displays these values; framing and visual hierarchy is the only work needed |
| Animated step transitions in onboarding | Horizontal slide or fade between steps using Reanimated (already a dependency) feels premium vs. stack push | MEDIUM | `react-native-reanimated` v3 is already installed; FlatList/ScrollView-based pager or `Animated.Value` slide |
| Inline unit context on inputs | Labels like "lbs" or "ft / in" inside or adjacent to input fields prevent wrong-unit entries | LOW | No extra library; add `rightIcon` or suffix text to `@rneui/themed` Input |
| Running average trend arrow | Up/down/flat arrow indicating whether 7-day average is improving vs. prior 7-day period | MEDIUM | Requires 14 days of data; only show when data exists; avoids "no data" empty state problem |
| Persistent calorie budget display (remaining calories) | "X calories remaining today" is the most-used number in macro tracking; surfacing it without a tap reduces friction | LOW | Calculation: TDEE - today's total. Already have both values. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Barcode scanner / food database API | "Just scan the barcode" is the #1 user request for manual-entry trackers | External API costs money, requires internet, introduces a third-party dependency that can break, and defeats the local-only architecture. TDEE-based macro tracking is weight/macro-centric, not food-database-centric. | Manual entry with good defaults and quick repeat. Defer to a future milestone with a clear monetization plan. |
| Push notifications for meal reminders | Feels like a completeness feature | Requires permissions prompt, which itself is onboarding friction. Annoying when miscalibrated. Doesn't affect core loop. | Out of scope per PROJECT.md |
| Social sharing / progress photos | Aspirational feature request | Requires auth, storage, privacy concerns; contradicts offline-first design | Out of scope per PROJECT.md |
| Cloud sync / multi-device | "I use my phone and iPad" | Backend cost, auth system, conflict resolution — significant complexity with no revenue model | Explicitly out of scope per PROJECT.md. Document the tradeoff in settings. |
| AI-generated meal suggestions | 2026 trend, users ask for it | Requires an LLM API (cost, internet dependency), not aligned with manual/intentional tracking ethos | Not for this milestone |
| Wearable sync (Apple Health, Google Fit) | Makes TDEE more accurate | High implementation complexity (HealthKit entitlement, Android Health Connect), not the current bottleneck | Future milestone consideration |
| Custom macro targets by day of week | Power-user feature | Increases UI complexity significantly; most users won't use it | Single target set. Allow editing profile to change targets. |

---

## Onboarding UX Patterns: Polished vs. Clunky

This section is specific to the milestone goal of making the Welcome → BasicInfo → MoreInfo flow feel polished.

### Current State (from code review)

**WelcomeScreen:** Static image + title + description text + "Get Started" button. Functional, minimal. No animation, but not broken.

**BasicInfoScreen:** All profile inputs on one screen — name, age, weight (text inputs) + height (dual Picker), gender (Picker), activity level (Picker). Image takes 200x200 of vertical space above a dense form. CTA label is "Calculate BMI" — misleading because the calculation happens on submit, not at any separate step. No progress indicator. No back navigation affordance.

**MoreInfoScreen:** Shows BMI/BMR/TDEE results then offers macro percentage sliders. CTA is "Finish." No contextual explanation of what BMR vs TDEE means. Saves to AsyncStorage and navigates to Root.

### Specific Problems (evidence-based)

| Problem | Impact | Fix |
|---------|--------|-----|
| No progress indicator | Users don't know how many screens remain; 3-screen flows with no indicator feel longer than they are | Add step dots (3 dots, current highlighted) at top or bottom of each screen |
| "Calculate BMI" as CTA label | Implies BMI is being calculated here, not navigation to next step; confusing | Change to "Next" or "Continue"; calculation fires in background |
| All inputs on one screen (BasicInfoScreen) | Dense cognitive load: 6+ inputs visible simultaneously | Keep all on one screen but use `ScrollView` with proper `keyboardAvoidingView`; group logically |
| 200x200 image takes vertical space on small phones | On iPhone SE (375pt wide), image + form = scroll required; keyboard compounds this | Reduce image to 120x120 or hide on scroll; use `KeyboardAvoidingView behavior="padding"` |
| No input labels showing units | Weight says "Your Weight" — pounds? kilograms? | Add "lbs" suffix; add "ft" / "in" to height pickers |
| Zero as default for numeric inputs | `String(0)` in input fields; user must clear before typing | Default to empty string `""` and parse on submit; show placeholder text instead |
| No back affordance in BasicInfo → MoreInfo | Stack navigator provides back, but no explicit back button | Stack header shown=false hides it; either enable header or add explicit back chevron |
| MoreInfoScreen doesn't explain BMI/BMR/TDEE | Raw numbers shown without context | Add one-line tooltip or subtext: "BMR = calories your body needs at rest" |
| MoreInfo percentage sliders: no validation that they sum to 100% | User can set 40/40/40 | Show running total; warn if != 100% |

### Polished Onboarding Patterns (what competitive apps do)

**Pattern 1: One question per screen (progressive disclosure)**
- MyFitnessPal, MacroFactor: each screen has one clear question
- Works well for onboarding; each "Next" tap feels like progress
- For macromaker's scope, splitting BasicInfo into 2 screens (personal stats + activity level) is a pragmatic middle ground without major restructuring

**Pattern 2: Step dots or "Step X of N" label**
- Universal in polished mobile onboarding
- Should match the app's primary color (`#7078df`)
- Implementation: simple View with 3 styled dots, index from navigation state

**Pattern 3: Animated screen transitions**
- Horizontal slide (not the default vertical push of React Navigation modals)
- Use `Reanimated` FlatList pager or configure stack `cardStyleInterpolator` to `forHorizontalIOS`
- Signals "we're progressing through a sequence" vs. "we're going deeper into hierarchy"

**Pattern 4: Keyboard-aware inputs**
- `KeyboardAvoidingView` with `behavior="padding"` on iOS (not `height` — height causes jumps)
- `ScrollView` wrapping inputs so user can scroll even with keyboard open
- Auto-focus first input on screen mount (reduces taps)
- "Next" on keyboard goes to next field; final field's `returnKeyType="done"` dismisses keyboard

**Pattern 5: Preserve state on back navigation**
- If user goes BasicInfo → MoreInfo → back → BasicInfo, their entered values must still be there
- InfoContext already holds this state, so this is mostly about not calling `navigation.reset()` on back
- Test the back path explicitly

**Pattern 6: Immediate feedback on the results screen**
- MoreInfoScreen showing BMR/TDEE should feel like a reward, not another form
- Large prominent number for TDEE (it's the most actionable)
- BMI/BMR as secondary data
- Brief, plain-English explanation of what TDEE means for daily eating

---

## Aggregate / Average View Patterns

### What users expect in the 7-day average context

Based on competitor analysis (MacroFactor, MyFitnessPal, Cronometer, Fuel):

**Minimum viable 7-day view:**
- Rolling 7-day average calories
- Rolling 7-day average per macro (carbs/protein/fat in grams)
- Days with data vs. days without (show N/7 days logged)

**Valuable additions (post-MVP):**
- Comparison: this week vs. last week average
- Trend arrow (up/down/flat) per metric
- "On target X of 7 days" compliance summary

**What NOT to show in this milestone:**
- Individual day bars repeated from the existing history view (redundant)
- Percentages only — grams are primary in macro tracking, percentages secondary
- Micronutrients — scope creep, app doesn't track these

### Implementation reality check

`utils.ts` already exports `getAveragesFromDietDays` which computes averages from a `DietDay[]` array. The data is already in `HistoryContext`. The 7-day view is primarily a UI problem, not a data problem.

The main implementation questions:
1. Where does the view live? (History tab is most natural — it's already date-oriented)
2. How to handle fewer than 7 days of data? (Show what exists, label "3-day average" if only 3 days)
3. Same graph style as existing graphs or a simpler summary card?

Recommendation: summary card above the history list in `DietHistoryScreen` is lower complexity than a new tab and fits the existing navigation model.

---

## Feature Dependencies

```
Polished onboarding
    ├──requires──> KeyboardAvoidingView integration (precedes form refactor)
    ├──requires──> Progress indicator component (new, shared across 3 screens)
    └──requires──> Sensible defaults in InfoContext initial state

7-day running average view
    ├──requires──> HistoryContext has 7+ days of data (already works)
    ├──uses──>     getAveragesFromDietDays (already in utils.ts)
    └──lives in──> DietHistoryScreen (existing screen)

Animated screen transitions (onboarding)
    └──requires──> react-native-reanimated v3 (already installed)

Macro percentage validation (MoreInfoScreen sliders)
    └──requires──> PercentageSlider component refactor or wrapper logic
```

### Dependency Notes

- **7-day average requires HistoryContext:** The data layer already supports it. No new storage schema needed.
- **Onboarding animation requires Reanimated:** Already a project dependency — no new install.
- **Progress indicator is a new shared component:** Used by Welcome, BasicInfo, and MoreInfo screens. Build it once, render on all three.
- **Keyboard-aware layout precedes any input refactor:** Fix `KeyboardAvoidingView` before restructuring input groups, so the fix doesn't get lost.

---

## MVP Definition for This Milestone

### Launch With (milestone complete when)

- [ ] Progress step indicator on all 3 onboarding screens — prevents abandonment and is the most visible quality signal
- [ ] "Next" / "Continue" CTA labels replacing "Calculate BMI" — removes confusion about what the button does
- [ ] Keyboard-aware layout in BasicInfo — inputs are usable when keyboard is open
- [ ] Unit labels on inputs ("lbs", "ft", "in") — eliminates ambiguity
- [ ] Sensible non-zero defaults for numeric fields — age 30, weight 160, height 5'9" as placeholders
- [ ] 7-day rolling average summary card in DietHistoryScreen — shows avg calories + avg macros, handles <7 days gracefully

### Add After Validation (v1.x)

- [ ] Animated horizontal slide transitions between onboarding screens — Reanimated is installed; adds polish without changing content
- [ ] MoreInfoScreen TDEE explanation text — one sentence in plain English
- [ ] Macro percentage sum validation on sliders — warn when total != 100%
- [ ] Trend arrow on 7-day average (this week vs. last week) — requires 14 days of data to be meaningful

### Future Consideration (v2+)

- [ ] Split BasicInfo into 2 screens (personal stats / activity level) — requires navigation restructuring; current single-screen approach is acceptable with keyboard fix
- [ ] Barcode scanner / food database — explicit milestone with monetization plan
- [ ] Apple Health / HealthKit sync — new milestone, requires entitlement and significant native work

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Progress step indicator | HIGH | LOW | P1 |
| CTA label fix ("Next" vs "Calculate BMI") | HIGH | LOW | P1 |
| Keyboard-aware layout (BasicInfo) | HIGH | LOW | P1 |
| Unit labels on inputs | MEDIUM | LOW | P1 |
| Sensible defaults for numeric inputs | MEDIUM | LOW | P1 |
| 7-day rolling average summary card | HIGH | MEDIUM | P1 |
| Animated onboarding transitions | MEDIUM | MEDIUM | P2 |
| MoreInfoScreen TDEE explanation | MEDIUM | LOW | P2 |
| Macro slider sum validation | MEDIUM | LOW | P2 |
| Trend arrows on 7-day view | MEDIUM | MEDIUM | P2 |
| Barcode scanner | HIGH | HIGH | P3 |
| HealthKit sync | MEDIUM | HIGH | P3 |

---

## Competitor Feature Analysis

| Feature | MyFitnessPal | MacroFactor | Cronometer | macromaker approach |
|---------|--------------|-------------|------------|---------------------|
| Onboarding | Progressive, one question per screen, branded | Minimal inputs, results-focused | Dense but thorough | Current: dense + unlabeled. Target: progress dots + keyboard-aware + labeled |
| Daily view | Meal-separated timeline | Single dashboard, prominent calories remaining | Macro ring chart | Existing graphs; add "remaining" callout |
| Weekly/average view | Weekly reports (premium) | Core feature — 7-day expenditure trend | Custom charting (premium) | 7-day average card in history tab |
| Progress indicator | Dots or "Step X of Y" | Step numbers | Step numbers | Add dots using existing Reanimated |
| Keyboard handling | Polished, fields scroll above keyboard | Standard | Standard | Fix with KeyboardAvoidingView + ScrollView |

---

## Sources

- [Best Macro Tracking Apps (2026 Edition)](https://fuelnutrition.app/blog/best-macro-tracking-apps) — MEDIUM confidence, marketing content but feature lists are accurate
- [MacroFactor app](https://macrofactor.com/macrofactor/) — HIGH confidence, primary source; weekly check-in and running average are documented product features
- [Cronometer vs MyFitnessPal comparison](https://www.katelymannutrition.com/blog/cronometer-vs-mfp) — MEDIUM confidence; registered dietitian comparative review
- [Mobile Onboarding UX Best Practices 2026](https://www.designstudiouiux.com/blog/mobile-app-onboarding-best-practices/) — MEDIUM confidence; UX agency blog, patterns consistent with other sources
- [VWO Mobile App Onboarding Guide](https://vwo.com/blog/mobile-app-onboarding-guide/) — MEDIUM confidence; conversion optimization firm, practical patterns
- [React Native Onboarding patterns](https://blog.swmansion.com/onboarding-in-react-native-doesnt-have-to-be-hard-d037cd383771) — HIGH confidence; Software Mansion official blog (Reanimated maintainers)
- [Comparing Top Macro Apps 2026](https://www.katelymannutrition.com/blog/best-tracking-app) — MEDIUM confidence; practitioner review with feature enumeration
- Codebase review of `/screens/InfoModal/` — HIGH confidence; direct source of truth for current state

---

*Feature research for: macromaker — mobile macro/nutrition tracker (React Native, local-only)*
*Researched: 2026-03-10*
