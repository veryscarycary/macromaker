# Architecture

**Analysis Date:** 2026-03-10

## Pattern Overview

**Overall:** Layered Context-Based Architecture with Modal-First Navigation

**Key Characteristics:**
- Context-based state management (custom useReducer factory pattern)
- Three-layer navigation: root modal stack → bottom tab navigator → per-tab stacks
- Local-only persistence via AsyncStorage (no backend/network layer)
- Declarative D3-based visualization components for macronutrient tracking
- Functional component architecture with hooks throughout

## Layers

**Presentation Layer:**
- Purpose: React Native components rendering UI and handling user interactions
- Location: `components/`, `screens/`
- Contains: Screen components, UI components (graphs, inputs, buttons), styled views
- Depends on: Context layer (for state), Navigation layer (for routing), Utilities (for calculations)
- Used by: Navigation layer (screens routed by navigators)

**Navigation Layer:**
- Purpose: Orchestrates screen transitions and modal flows via React Navigation
- Location: `navigation/`
- Contains: RootNavigator (modal stack), BottomTabNavigator, DietNavigator, FitnessNavigator, screen stacks, linking configuration
- Depends on: Presentation layer (screens), Context layer (state for navigation decisions)
- Used by: App root entry point

**State Management / Context Layer:**
- Purpose: Manages application state through custom reducer-based contexts
- Location: `context/`
- Contains: Three active contexts (HistoryContext, MealContext, InfoContext), context factory utility, data persistence operations
- Depends on: Utilities layer (AsyncStorage helpers)
- Used by: Presentation layer (screens/components access via useContext)

**Persistence Layer:**
- Purpose: Handles all data serialization/deserialization and AsyncStorage operations
- Location: `utils.ts`, referenced by contexts
- Contains: Storage helpers (storeData, getStoredData, getAllStoredData, removeStoredData), calculation utilities
- Depends on: React Native AsyncStorage, types
- Used by: Context layer, screens

**Utility Layer:**
- Purpose: Pure functions for calculations, conversions, date handling
- Location: `utils.ts`, `constants.ts`, component-specific utils
- Contains: Macro conversions (carbs/protein/fat to calories), BMR/BMI calculations, date utilities, aggregation helpers
- Depends on: Types, constants
- Used by: All layers (especially context, screens, components)

## Data Flow

**Meal Creation Flow:**

1. User navigates to `AddFoodScreen` via header button in `DietNavigator`
2. User enters meal data (name, carbs, protein, fat, units)
3. Component calculates calories in real-time using `convertCarbsToCalories()`, `convertProteinToCalories()`, `convertFatToCalories()` from `utils.ts`
4. On "Add Meal" button press:
   - Component calls `storeMeal()` from `MealContext.tsx`
   - `storeMeal()` calls `getStoredData()` to fetch existing meals for date
   - Creates new meal object with UUID, appends to array, calls `storeData()` to persist AsyncStorage
   - Returns to previous screen via `navigation.pop()`
5. When screen regains focus (e.g., `DietTodayScreen`):
   - `focus` event listener in `useEffect` triggers
   - Calls `getMealData(getTodaysDate())` to fetch today's meals
   - Updates local state with `setTodaysMeals()`
   - Component renders with updated meal data

**Meal Editing Flow:**

1. User navigates to `AddFoodScreen` with route params: `{ meal: Meal }`
2. Component pre-populates form fields using meal object values
3. On "Edit Meal" button press:
   - Calls `updateMeal(getTodaysDate(), { ...updatedMealObject, id: meal.id })`
   - `updateMeal()` fetches existing meals, finds meal by ID, splices update, persists via `storeData()`
4. Navigation back syncs via focus listener

**User Info Initialization Flow:**

1. App launches, renders `RootNavigator` (modal stack)
2. Bottom tab navigator checks if `basicInfo` exists in AsyncStorage via `getStoredData('basicInfo')`
3. If missing, navigates to `Modal` screen (onboarding stack)
4. User completes: `WelcomeScreen` → `BasicInfoScreen` (height, weight, age, gender) → `MoreInfoScreen` (activity level, macro targets)
5. `BasicInfoScreen` and `MoreInfoScreen` use `InfoContext`:
   - Call `setInfoState()` action to update local form state
   - Call `setBasicInfoCalculations()` to trigger BMR/TDEE/BMI calculation
   - On completion, call `storeBasicInfo()` to persist to AsyncStorage
6. Navigation closes modal, returns to root
7. Bottom tab checks again, `basicInfo` now exists, flow continues normally

**Daily View Data Assembly:**

1. `DietTodayScreen` mounted with focus listener
2. Fetches `basicInfo` (TDEE, macro percentages) from AsyncStorage
3. Fetches today's meals via `getMealData(getTodaysDate())` from AsyncStorage
4. Aggregates macros: `getMacrosFromMeals(todaysMeals)` → `{ totalCarbs, totalProtein, totalFat }`
5. Calculates target calories per macro: `targetPercentage * tdee`
6. Passes aggregated data to visualization components:
   - `BarGraph` displays actual vs. target for each macro
   - `MealTimeGraph` plots meals across 24-hour timeline with bubble radius = meal calories
   - `TotalCaloriesGraph` shows stacked macro bars for total consumed vs. target

**State Management:**

- **HistoryContext**: Lightweight, stores daily aggregates for UI purposes (keyed by date string)
- **MealContext**: Dual purpose:
  - Reducer-based state for form inputs during meal creation (`carbs`, `protein`, `fat`, units)
  - Standalone async functions (`storeMeal`, `updateMeal`, `deleteMeal`, `getAllMealData`, `getMealData`) for direct AsyncStorage manipulation
- **InfoContext**: Holds user profile (name, age, weight, height, gender, activity level) and derived calculations (BMR, TDEE, BMI, macro percentages)
- All contexts use custom `createDataContext()` factory which binds action creators to dispatch automatically

## Key Abstractions

**Meal Object:**
- Purpose: Represents a single food entry with macronutrient and calorie data
- Examples: `context/MealContext.tsx`, `types.tsx` (Meal interface)
- Pattern: Immutable within AsyncStorage (updated via new array splice), mutable during form editing

**DietDay Object:**
- Purpose: Groups meals by calendar date for history views
- Examples: `types.tsx` (DietDay interface), `context/MealContext.tsx` (getAllMealData returns DietDay[])
- Pattern: Constructed on-demand from AsyncStorage keyed tuples

**BarGraphData Type:**
- Purpose: Abstraction for any macro-based chart (current, target, color)
- Examples: `components/BarGraph/types.ts`, constructed in `DietTodayScreen.tsx`
- Pattern: Passed to visualization components to decouple data shape from rendering

**Context Factory Pattern:**
- Purpose: Reduces boilerplate for reducer + action creator binding
- Examples: `context/createDataContext.tsx`
- Pattern: Takes reducer, actionCreators map, and default state → returns { Context, Provider } with automatic dispatch binding

## Entry Points

**App Root:**
- Location: `App.tsx`
- Triggers: React Native app initialization
- Responsibilities: Wraps app in GestureHandlerRootView, SafeAreaProvider, HistoryProvider; loads cached resources and color scheme; renders Navigation component

**Navigation Root:**
- Location: `navigation/index.tsx`
- Triggers: On App component render
- Responsibilities: Creates NavigationContainer with RootNavigator; applies theme (dark/light); configures deep linking via LinkingConfiguration

**RootNavigator:**
- Location: `navigation/index.tsx` (RootNavigator function)
- Triggers: NavigationContainer creation
- Responsibilities: Manages modal stack with presentation: 'modal'; routes to Root (BottomTabNavigator), NotFound, Modal (onboarding), MenuModal (menu overlay)

**BottomTabNavigator:**
- Location: `navigation/BottomTabNavigator.tsx`
- Triggers: Rendered as Root screen in RootNavigator
- Responsibilities: Checks for `basicInfo` on focus; navigates to Modal if missing; creates two tab stacks (DietNavigator, FitnessNavigator); applies tab bar icons

**DietTodayScreen:**
- Location: `screens/Diet/screens/Today/DietTodayScreen.tsx`
- Triggers: Initial route in DietNavigator, or user focuses Diet tab
- Responsibilities: Fetches basicInfo and today's meals on focus; aggregates macros; passes data to BarGraph, MealTimeGraph, TotalCaloriesGraph; displays comprehensive macro tracking for current day

**AddFoodScreen:**
- Location: `screens/AddFood/AddFoodScreen.tsx`
- Triggers: User taps "Add Meal" header button or "Edit" on meal from daily view
- Responsibilities: Manages meal form state (carbs, protein, fat, units, name); calculates calories in real-time; persists new meal or updates existing meal via MealContext functions; navigates back on success

**ModalScreen:**
- Location: `screens/InfoModal/ModalScreen.tsx`
- Triggers: BottomTabNavigator navigates to Modal if basicInfo missing
- Responsibilities: Wraps InfoProvider (provides InfoContext); creates nested stack for onboarding sequence (Welcome → BasicInfo → MoreInfo)

## Error Handling

**Strategy:** Try-catch blocks in async AsyncStorage operations; console.error logging; silent failures for most operations

**Patterns:**
- AsyncStorage operations in `utils.ts` wrapped in try-catch with error logged to console
- Meal update/delete in `MealContext.tsx` throws Error if meal doesn't exist, caller wraps in try-catch
- Navigation operations assume success; no explicit error handling for routing failures
- Form validation in `AddFoodScreen.tsx` uses `areFieldsValid()` to disable submit button, preventing invalid state submission

## Cross-Cutting Concerns

**Logging:** Console.log and console.error used throughout; no logging framework. Examples: meal data in `DietTodayScreen.tsx` (line 74), error logs in utils and contexts.

**Validation:** Input validation primarily at UI level (numeric regex for macro inputs, disabled submit for invalid fields). No schema validation layer (e.g., Zod, Yup).

**Authentication:** Not applicable — no user auth, all data stored locally on device.

**Theming:** Color scheme determined by device settings via `useColorScheme()` hook; theme passed to NavigationContainer; color constants in `constants/Colors.ts`.

---

*Architecture analysis: 2026-03-10*
