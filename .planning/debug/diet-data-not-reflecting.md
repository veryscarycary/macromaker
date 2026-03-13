---
status: fixing
trigger: "Investigate issue: diet-data-not-reflecting\n\n**Summary:** Added meals are not reflected on Today or History, and Today macro bars appear filled by default instead of empty."
created: 2026-03-12T00:00:00Z
updated: 2026-03-12T00:15:00Z
---

## Current Focus

hypothesis: Diet screens depend entirely on `navigation.addListener('focus', ...)` for data loading, which is not reliably populating state in the current navigation lifecycle; the Today empty-state bars are separately caused by rendering the hook/bar fill from target calories instead of consumed calories
test: Replace screen loading with a focus-safe pattern that runs on initial focus and refocus, and change the hook bar to scale from `amount` rather than `targetAmount`
expecting: Stored meals will populate Today/History/Daily views when screens open or regain focus, and zero-intake Today bars will render empty
next_action: Patch the three diet screens and the bar graph component, then run targeted tests

## Symptoms

expected: After adding a meal, Today should show the meal and updated carbs/protein/fat/calorie data, History should include the day, and empty-state macro bars should render empty.
actual: The Today screen shows filled carbs/protein/fat bars by default before any meal is added. After adding a meal, neither Today nor History shows the meal data.
errors: No explicit runtime error reported yet.
reproduction: Open Add Meal, add a meal, return to Today and History, observe no reflected data. Also observe Today screen before adding anything: bars are filled instead of empty.
started: Current state as of 2026-03-12 after recent RN upgrade and onboarding UI changes; unknown whether this flow worked before.

## Eliminated

## Evidence

- timestamp: 2026-03-12T00:07:00Z
  checked: screens/Diet/screens/Today/DietTodayScreen.tsx, screens/Diet/DietHistoryScreen.tsx, screens/Diet/screens/DailyDiet/DailyDietScreen.tsx
  found: All three screens load meal data only inside `navigation.addListener('focus', async () => ...)` and do not perform an immediate fetch on initial render
  implication: If focus callbacks are not fired at the lifecycle points the app assumes, these screens stay on their empty default state even when meal data exists

- timestamp: 2026-03-12T00:09:00Z
  checked: context/MealContext.tsx, utils.ts
  found: Meal persistence writes to AsyncStorage keys shaped like `meals@{date}` and readback uses the same key derivation path via `getAllMealData()` and `getMealData(date)`
  implication: There is no obvious write/read key mismatch in the persistence layer, so the missing UI data is more likely a screen refresh problem than a storage serialization bug

- timestamp: 2026-03-12T00:12:00Z
  checked: components/BarGraph/components/HorizontalBarWithHook.tsx
  found: The visible hook/background shape length is computed from `data[index].targetAmount`, not `data[index].amount`
  implication: Today bars appear filled even when no meals have been logged because the component renders target calories as if they were current progress

## Resolution

root_cause: Diet data loading on Today/History/Daily screens is coupled only to a focus-listener pattern that is not reliably hydrating state in the current navigation lifecycle, and the Today progress bars render target macro calories as filled progress in the zero-data state
fix:
verification:
files_changed: []
