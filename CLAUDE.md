# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start Metro bundler
npm run start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests (watch mode)
npm run test

# Run a single test file
npx jest __tests__/utils.test.ts
```

## Architecture Overview

**macromaker** is a bare React Native app (previously an Expo project, now fully ejected and Expo-free) for tracking macronutrient intake and managing fitness goals. It stores all data locally using AsyncStorage — no backend or remote services.

### Navigation Structure

The app uses React Navigation with a modal-first root stack:
- `RootNavigator` (Stack, modal mode) → renders `BottomTabNavigator` as "Root"
- `BottomTabNavigator` → two tabs: **Diet** and **Fitness**
- **Diet tab** has its own stack: `DietTodayScreen` → `DietHistoryScreen` → `AddFoodScreen` / `EditFoodScreen` / `DailyDietScreen`
- On first launch (no `basicInfo` in storage), the app automatically navigates to the `Modal` (onboarding info flow: Welcome → BasicInfo → MoreInfo)

### State Management

Contexts use a custom `createDataContext` factory (`context/createDataContext.tsx`) that wraps `useReducer` and binds action creators to dispatch. The pattern:

```ts
export const { Provider, Context } = createDataContext(reducer, actionCreators, defaultValue);
```

Active contexts:
- **HistoryContext** — tracks `DietHistory` keyed by date string
- **MealContext** (`context/MealContext.tsx`) — manages form state for adding/editing meals; also exports standalone async functions (`storeMeal`, `updateMeal`, `deleteMeal`, `getAllMealData`, `getMealData`) that directly read/write AsyncStorage
- **InfoContext** — user profile and fitness info (BMR, TDEE, macro targets)

### Data Persistence

All data goes through `utils.ts` helpers wrapping AsyncStorage:
- `storeData(key, value)` / `getStoredData(key)` — JSON serialize/deserialize automatically
- `getAllStoredData()` — fetches all keys; meal records are filtered by key prefix `meals@<date>`
- `removeStoredData(key)` — removes a single key

Meal storage key format: `meals@MM/DD/YYYY`
User info storage key: `basicInfo`

### Core Types (`types.tsx`)

- `Meal` — individual meal entry with carbs/protein/fat (amount + unit + calories for each macro)
- `DietDay` — `{ date, day, meals: Meal[] }`
- `Info` — user profile including BMR, TDEE, and target macro percentages

### Utility Functions (`utils.ts`)

- `convertCarbsToCalories` / `convertProteinToCalories` / `convertFatToCalories` — macro-to-calorie conversion supporting `g` and `oz` units
- `calculateBMR` — Mifflin-St Jeor equation (male/female variants via constants)
- `calculateBMI` — imperial input (lbs, inches)
- `getMacrosFromMeals` / `getAveragesFromDietDays` — aggregate helpers

### Data Visualization

Custom D3-based graph components in `components/`:
- **BarGraph** — horizontal bar chart using D3 scales and react-native-svg
- **MealTimeGraph** — scatter/bubble plot showing meals across time of day with calorie-scaled circles and a daytime gradient background
- **TotalCaloriesGraph** — stacked macro bar

### Icons

Icons use `react-native-vector-icons`. After `npm install`, iOS requires `pod install` and the font files must be listed in `ios/macromaker/Info.plist` under `UIAppFonts`. The fonts used are `Ionicons.ttf`, `Feather.ttf`, and `FontAwesome.ttf`.

### Key Libraries

| Library | Purpose |
|---|---|
| `@react-navigation/native` v6, `@react-navigation/stack` v6, `@react-navigation/bottom-tabs` v6 | Navigation |
| `react-native-gesture-handler` v2 | Gesture handling (requires `GestureHandlerRootView` at root) |
| `react-native-reanimated` v3 | Animations |
| `react-native-svg` v15 | SVG rendering for all custom graph components |
| `react-native-vector-icons` v10 | Icon library (replaces `@expo/vector-icons`) |
| `@rneui/themed` v4 | UI components (`Input`, `SearchBar`, `ListItem`) |
| `@react-native-async-storage/async-storage` | Local persistence |
