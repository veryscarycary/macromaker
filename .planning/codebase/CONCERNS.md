# Codebase Concerns

**Analysis Date:** 2026-03-10

## Tech Debt

**Loose Type Safety in Context Factories:**
- Issue: Both `createDataContext.tsx` and `createUseStateContext.tsx` use `any` type extensively
- Files: `context/createDataContext.tsx`, `context/createUseStateContext.tsx`, `components/withProvider.tsx`
- Impact: Type safety is lost when accessing context values; refactoring contexts is error-prone; IDE autocomplete is degraded
- Fix approach: Create generic TypeScript overloads for `createDataContext<S, A>` to enforce typed state and action creators. Replace `any` with proper generic types in Provider component and returned context object.

**Untyped Meal Query Performance:**
- Issue: `getMealData()` calls `getAllMealData()` internally, which fetches and parses ALL meals from AsyncStorage every time
- Files: `context/MealContext.tsx` (line 129-136)
- Impact: O(n) operation for every single meal lookup; scales poorly as meal history grows; observable lag when accessing daily screens with thousands of stored meals
- Fix approach: Implement direct single-key AsyncStorage access for daily meal keys (`meals@MM/DD/YYYY`), or add an in-memory cache layer with cache invalidation on write

**Incomplete Error Handling:**
- Issue: `storeData()` and `getStoredData()` catch errors but only log to console; no error propagation or user feedback
- Files: `utils.ts` (lines 53-78)
- Impact: Silent failures in data persistence; users may lose meal data without knowing; errors in `deleteMeal` can go unhandled (line 68 throws, but calling code doesn't catch everywhere)
- Fix approach: Return error objects or throw explicitly; wrap AsyncStorage calls with proper try-catch in all calling code; add user-facing error notifications (toasts/alerts)

**Over-Reliance on `get()` from Lodash:**
- Issue: Heavy use of `get()` for nullable route params and object access obscures actual data flow
- Files: `screens/AddFood/AddFoodScreen.tsx` (lines 42-52), `screens/InfoModal/screens/BasicInfoScreen.tsx`
- Impact: Makes it harder to track what properties are actually required vs. optional; masks missing data scenarios
- Fix approach: Replace with explicit optional chaining (`?.`) or null checks; refine route params to guarantee required fields

**Navigation Listener Without Cleanup:**
- Issue: `useEffect()` in `DietHistoryScreen.tsx`, `DietTodayScreen.tsx`, `DailyDietScreen.tsx` subscribe to `focus` events but never unsubscribe
- Files: `screens/Diet/DietHistoryScreen.tsx` (line 21-28), `screens/Diet/screens/Today/DietTodayScreen.tsx` (line 42-51), `screens/Diet/screens/DailyDiet/DailyDietScreen.tsx` (line 28-35)
- Impact: Memory leaks accumulate over navigation cycles; old listeners fire on subsequent navigations; state can become stale
- Fix approach: Return cleanup function from useEffect that calls unsubscribe: `return () => subscription.remove()`

## Known Bugs

**MacroGraph Component Signature Mismatch:**
- Issue: `MacroGraph.tsx` destructures props incorrectly; function signature has both positional and props parameter
- Files: `components/MacroGraph.tsx` (lines 54-64)
- Impact: Component always receives `undefined` for `carbsUnit`, `proteinUnit`, `fatUnit` — these are never passed from callers but are used in calculations; conversions may fail silently
- Trigger: Calling `<MacroGraph carbs={n} protein={n} fat={n} />` without unit params
- Workaround: Add default units in the destructure, currently only `g` is defaulted

**Division by Zero in Macro Calculations:**
- Issue: `MacroGraph.tsx` lines 69-71 divide by `calories` without checking if it's zero
- Files: `components/MacroGraph.tsx`
- Impact: Results in `NaN` percentages when no meals are logged; pie chart may render incorrectly
- Trigger: View daily stats with zero meals; observe macro percentages
- Workaround: Caller (`DailyDietScreen.tsx` line 46) passes 0,0,0 and component has `|| 0` fallback, but doesn't prevent NaN from intermediate division

**Typo in Type Definition:**
- Issue: `HistoryContext.tsx` line 15 has `protien` instead of `protein`
- Files: `context/HistoryContext.tsx`
- Impact: Type mismatch if HistoryContext state is ever used to store meal data; not currently causing runtime errors because context is underused
- Trigger: Attempt to use `history.state[date].protein`

**Unhandled Null Meal Data:**
- Issue: `getMealData()` can return `undefined` but calling code doesn't always check
- Files: `screens/Diet/screens/DailyDiet/DailyDietScreen.tsx` (line 31-32), `context/MealContext.tsx` (line 79-96)
- Impact: Setting meals from potentially undefined `dietDay.meals` can crash if `dietDay` is null
- Trigger: Navigate to a date with no stored meals
- Workaround: Calling code has conditional `if (dietDay)` but not all callers check

## Security Considerations

**No Input Validation for Numeric Fields:**
- Risk: Meal macro values (carbs, protein, fat) accept any numeric string but no range validation
- Files: `screens/AddFood/AddFoodScreen.tsx`, `screens/AddFood/components/MacroInput.tsx`
- Current mitigation: Numeric regex in `MealContext.tsx` line 167 rejects non-digits, so extreme values still allowed
- Recommendations: Add min/max bounds (e.g., 0-9999g per macro); sanitize BMR/BMI calculations to handle edge cases (negative weight, invalid height)

**Unrestricted AsyncStorage Access:**
- Risk: All data persisted locally to device storage with no encryption
- Files: `utils.ts` (AsyncStorage calls), all context files
- Current mitigation: None — data is plaintext
- Recommendations: For production, use `react-native-keychain` for sensitive user profile data (weight, age, goals); consider sqlite for encrypted local DB

**No Data Backup or Recovery:**
- Risk: User can lose all meal history and profile data by clearing app data or uninstalling
- Files: No backup mechanism exists
- Current mitigation: None
- Recommendations: Implement cloud sync option or local file export; add data export/import screens

## Performance Bottlenecks

**Linear Meal Lookup on Every Screen Focus:**
- Problem: `getAllMealData()` iterates all AsyncStorage keys, filters, parses JSON, and sorts every time a screen gains focus
- Files: `context/MealContext.tsx` (lines 105-127)
- Cause: No caching; repeated full scans of storage
- Improvement path:
  1. Add in-memory cache in MealContext reducer
  2. Invalidate cache only on `storeMeal`, `updateMeal`, `deleteMeal`
  3. Fall back to AsyncStorage only on app startup

**PieChart Rendering Without Memoization:**
- Problem: `MacroGraph` and `DailyDietScreen` recreate pie chart data on every render
- Files: `components/MacroGraph.tsx`, `screens/Diet/screens/DailyDiet/DailyDietScreen.tsx`
- Cause: No React.memo or useMemo wrapping
- Improvement path: Wrap `MacroGraph` with `React.memo()` and memoize data array in `DailyDietScreen`

**Svg Rendering Loop in MealTimeGraph:**
- Problem: Creates D3Circle components for every meal on every render (line 53-77)
- Files: `components/MealTimeGraph/index.tsx`
- Cause: No key optimization or virtual scrolling for large meal lists
- Improvement path: Ensure `key` prop is stable (currently uses index `i` which breaks reconciliation); consider lazy rendering if >50 meals per day

**Date String Parsing in Loop:**
- Problem: `getMealTimeMealsWithColor()` and graph rendering create new Date objects for every meal
- Files: `components/MealTimeGraph/index.tsx` (line 54)
- Cause: Repeated parsing of date strings
- Improvement path: Memoize date parsing or store meal dates as timestamps

## Fragile Areas

**AddFoodScreen Edit/Create Logic:**
- Files: `screens/AddFood/AddFoodScreen.tsx` (lines 138-182)
- Why fragile: Complex branching based on whether `meal.id` exists; calls to `storeMeal()` and `updateMeal()` are not awaited properly; no loading state shown to user during async operations
- Safe modification: Extract meal saving logic into a custom hook `useSaveMeal()` that handles both cases; add loading indicator; ensure error dialogs are shown
- Test coverage: No tests for edit vs. create flows; no tests for date parameter edge cases

**MealSection Delete Handler:**
- Files: `screens/Diet/screens/DailyDiet/components/MealSection.tsx` (lines 69-78)
- Why fragile: Calls `deleteMeal()` without awaiting, then immediately calls `getMealData()` which may race; if delete fails, UI updates anyway
- Safe modification: Make async, await deleteMeal(), handle errors, show user feedback
- Test coverage: No tests for delete operations

**MacroGraph with Zero Data:**
- Files: `components/MacroGraph.tsx`
- Why fragile: Division by zero, missing unit parameters, relies on caller to handle NaN; no error boundary
- Safe modification: Add explicit null checks and return fallback UI when data is invalid; add PropTypes or Zod validation
- Test coverage: No unit tests for edge cases (zero calories, null carbs)

**Navigation Context Stack:**
- Files: `navigation/index.tsx`, `screens/InfoModal/ModalScreen.tsx`
- Why fragile: Modal screen wraps its own InfoProvider, but HistoryProvider is at root; inconsistent context hierarchy
- Safe modification: Ensure all providers are at consistent levels; document which providers are needed for which screens
- Test coverage: No integration tests for navigation flows

## Missing Critical Features

**Data Validation on Input:**
- Problem: No schema validation for user profile input (BasicInfoScreen)
- Blocks: Cannot ensure data consistency; calculations with invalid BMR/TDEE can be wrong
- Add: Use Zod or Yup schemas for all form inputs; validate before storing

**Error Boundary:**
- Problem: No global error boundary; crashes propagate to user
- Blocks: One bad meal calculation can crash entire app
- Add: Wrap app with Error Boundary component; log errors to console/analytics

**Loading States:**
- Problem: AsyncStorage calls have no loading indicators
- Blocks: Users can't tell if app is frozen or just loading; can trigger duplicate saves by tapping repeatedly
- Add: Add loading state to MealContext; show spinners during save operations

**Search Functionality:**
- Problem: SearchBar in AddFoodScreen is defined but not wired up
- Blocks: Users must remember exact meal names; no meal database lookup
- Add: Connect search to a meal database (local JSON or online API); populate suggestions

## Test Coverage Gaps

**No Tests for Context Reducers:**
- What's not tested: All reducer functions in `HistoryContext.tsx`, `InfoContext.tsx`, `MealContext.tsx`
- Files: `context/HistoryContext.tsx`, `context/InfoContext.tsx`, `context/MealContext.tsx`
- Risk: State mutations can break silently; refactoring reducers has no safety net
- Priority: High

**No Tests for AsyncStorage Interactions:**
- What's not tested: `storeData()`, `getStoredData()`, `removeStoredData()`, `getAllStoredData()` in `utils.ts`
- Files: `utils.ts`
- Risk: Data persistence bugs go undetected; new changes can break meal storage
- Priority: High

**No Tests for Screen Navigation:**
- What's not tested: Focus listeners, navigation params, screen lifecycle in Diet screens
- Files: `screens/Diet/**/*.tsx`
- Risk: Navigation bugs compound across screens; refactoring navigation becomes dangerous
- Priority: Medium

**No Tests for Calculation Functions:**
- What's not tested: BMR, BMI, macro conversions with edge cases (zero, negative, very large)
- Files: `utils.ts`, `screens/Diet/screens/Today/DietTodayScreen.tsx`
- Risk: Health calculations could be wrong without detection; only basic utils.test.ts exists
- Priority: High

**No Integration Tests:**
- What's not tested: Full user flows like "add meal → view today → check graph"
- Risk: Multiple components can fail together in ways unit tests don't catch
- Priority: Medium

---

*Concerns audit: 2026-03-10*
