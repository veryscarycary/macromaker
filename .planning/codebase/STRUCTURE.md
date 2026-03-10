# Codebase Structure

**Analysis Date:** 2026-03-10

## Directory Layout

```
macromaker/
├── __tests__/                  # Test files (Jest)
│   └── utils.test.ts
├── android/                    # Android native project (ejected from Expo)
├── ios/                        # iOS native project (ejected from Expo)
├── components/                 # Reusable UI and visualization components
│   ├── BarGraph/              # Horizontal bar chart for macro tracking
│   ├── MealTimeGraph/         # D3-based scatter plot of meals across time
│   ├── TotalCaloriesGraph/    # Stacked macro bar chart
│   ├── DismissKeyboardView.tsx
│   ├── MacroGraph.tsx
│   ├── PercentageSlider.tsx
│   ├── Spacer.tsx
│   ├── StyledText.tsx
│   ├── Themed.tsx             # Themed View and Text wrappers
│   └── withProvider.tsx
├── context/                    # State management via custom Context factory
│   ├── createDataContext.tsx   # Reducer + action creator binding factory
│   ├── createUseStateContext.tsx
│   ├── HistoryContext.tsx      # Daily diet history aggregates
│   ├── MealContext.tsx         # Meal form state + AsyncStorage operations
│   └── InfoContext.tsx         # User profile and macro targets
├── hooks/                      # Custom React hooks
│   ├── useCachedResources.ts   # Splash screen and resource loading
│   └── useColorScheme.ts       # Device light/dark mode detection
├── navigation/                 # React Navigation configuration
│   ├── index.tsx               # RootNavigator (modal stack)
│   ├── BottomTabNavigator.tsx  # Tab navigator + nested diet/fitness stacks
│   ├── components/
│   │   └── ModalButton.tsx
│   ├── MenuModalScreen.tsx
│   └── LinkingConfiguration.ts # Deep linking routes
├── screens/                    # Screen components organized by feature
│   ├── Diet/                   # Diet tracking screens
│   │   ├── DietHistoryScreen.tsx
│   │   ├── screens/
│   │   │   ├── Today/
│   │   │   │   └── DietTodayScreen.tsx
│   │   │   └── DailyDiet/
│   │   │       ├── DailyDietScreen.tsx
│   │   │       └── components/
│   │   │           ├── AddMealSectionButton.tsx
│   │   │           ├── MealList.tsx
│   │   │           └── MealSection.tsx
│   │   ├── components/
│   │   │   ├── AddFoodHeaderButton.tsx
│   │   │   ├── DietHistoryList.tsx
│   │   │   ├── MenuButton.tsx
│   │   │   └── NoDataMacroGraph.tsx
│   ├── AddFood/                # Meal creation/editing
│   │   ├── AddFoodScreen.tsx
│   │   └── components/
│   │       └── MacroInput.tsx
│   ├── InfoModal/              # Onboarding flow
│   │   ├── ModalScreen.tsx
│   │   └── screens/
│   │       ├── BasicInfoScreen.tsx
│   │       ├── MoreInfoScreen.tsx
│   │       └── WelcomeScreen.tsx
│   ├── FitnessScreen.tsx       # Fitness tab placeholder
│   ├── MacroScreen.tsx
│   └── NotFoundScreen.tsx      # 404 route fallback
├── constants/                  # Theme and layout constants
│   ├── Colors.ts              # Light/dark theme color maps
│   └── Layout.ts
├── constants.ts                # BMR coefficients, calorie mappings
├── types.tsx                   # TypeScript type definitions
├── utils.ts                    # Utility functions (calculations, AsyncStorage)
├── App.tsx                     # Root app component
├── index.js                    # React Native entry point
├── app.json                    # Expo config (legacy, app is now ejected)
├── metro.config.js             # Metro bundler config
├── babel.config.js             # Babel transpiler config
├── package.json                # Dependencies and scripts
└── declarations.d.ts           # TypeScript declarations for assets
```

## Directory Purposes

**components/:**
- Purpose: Reusable presentation components and visualization widgets
- Contains: Graph components (D3-based), form inputs, theme-aware views, utility UI components
- Key files: `BarGraph/`, `MealTimeGraph/`, `TotalCaloriesGraph/`, `Themed.tsx`

**context/:**
- Purpose: State management and persistence layer
- Contains: Custom context factory, three active data contexts, AsyncStorage helper functions
- Key files: `createDataContext.tsx`, `MealContext.tsx`, `InfoContext.tsx`, `HistoryContext.tsx`

**hooks/:**
- Purpose: Custom React hooks for cross-cutting concerns
- Contains: Resource loading, color scheme detection
- Key files: `useCachedResources.ts`, `useColorScheme.ts`

**navigation/:**
- Purpose: React Navigation configuration and screen routing
- Contains: Navigator hierarchy (root modal → tabs → stacks), deep linking, modal button
- Key files: `index.tsx` (RootNavigator), `BottomTabNavigator.tsx`, `LinkingConfiguration.ts`

**screens/:**
- Purpose: Feature-organized screen containers
- Contains: Screen components, feature-specific sub-components
- Organized by: Feature (Diet, AddFood, InfoModal, Fitness)
- Key files: `Diet/screens/Today/DietTodayScreen.tsx`, `AddFood/AddFoodScreen.tsx`, `InfoModal/ModalScreen.tsx`

**constants/:**
- Purpose: Theme and layout constants used across app
- Contains: Color definitions for light/dark modes, layout dimensions
- Key files: `Colors.ts`, `Layout.ts`

**__tests__/:**
- Purpose: Jest test files co-located by feature
- Contains: Unit tests for utility functions
- Key files: `utils.test.ts`

**android/, ios/:**
- Purpose: Native platform projects (ejected from Expo)
- Contains: Platform-specific Java/Kotlin (Android) and Objective-C/Swift (iOS) code, native build config
- Maintenance: Modified for RN 0.73 compatibility (see git log); icon fonts listed in ios/macromaker/Info.plist

## Key File Locations

**Entry Points:**
- `index.js`: React Native app entry point; registers App component with AppRegistry
- `App.tsx`: Root component; wraps app in GestureHandlerRootView, SafeAreaProvider, HistoryProvider; renders Navigation
- `navigation/index.tsx`: Navigation entry point; creates NavigationContainer and RootNavigator

**Configuration:**
- `app.json`: Expo app manifest (app is now ejected, mostly legacy)
- `metro.config.js`: Metro bundler config for React Native
- `babel.config.js`: Babel transpiler config
- `package.json`: Dependencies and npm scripts (start, ios, android, test)
- `tsconfig.json`: TypeScript compiler options (if present)

**Core Logic:**
- `utils.ts`: Macro-to-calorie conversions, BMR/BMI calculations, date utilities, AsyncStorage wrapper functions
- `constants.ts`: BMR coefficients (Mifflin-St Jeor formula), calorie-per-unit mappings
- `types.tsx`: TypeScript definitions (Meal, DietDay, Info, navigation param lists)

**Context/State:**
- `context/MealContext.tsx`: Meal form state + standalone async meal operations
- `context/InfoContext.tsx`: User profile state + calculations (BMR, TDEE, BMI)
- `context/HistoryContext.tsx`: Daily diet history aggregates
- `context/createDataContext.tsx`: Context factory utility

**Screens (Primary Features):**
- `screens/Diet/screens/Today/DietTodayScreen.tsx`: Main daily tracking view (graphs, macros)
- `screens/AddFood/AddFoodScreen.tsx`: Meal creation and editing form
- `screens/InfoModal/ModalScreen.tsx`: Onboarding flow entry point
- `screens/Diet/DietHistoryScreen.tsx`: Historical meal data view

**Navigation:**
- `navigation/BottomTabNavigator.tsx`: Tab navigator + nested diet/fitness stacks
- `navigation/MenuModalScreen.tsx`: Overlay menu modal
- `navigation/LinkingConfiguration.ts`: Deep linking route config

**Testing:**
- `__tests__/utils.test.ts`: Jest tests for utility functions

## Naming Conventions

**Files:**
- **Screens:** PascalCase + "Screen" suffix (e.g., `DietTodayScreen.tsx`, `AddFoodScreen.tsx`)
- **Components:** PascalCase (e.g., `BarGraph.tsx`, `MealTimeGraph.tsx`, `MacroInput.tsx`)
- **Utilities/Helpers:** camelCase (e.g., `utils.ts`, `constants.ts`)
- **Contexts:** PascalCase + "Context" suffix (e.g., `MealContext.tsx`, `InfoContext.tsx`)
- **Hooks:** camelCase + "use" prefix (e.g., `useCachedResources.ts`, `useColorScheme.ts`)
- **Types/Interfaces:** Separate file `types.tsx` for all TypeScript types
- **Tests:** camelCase + ".test.ts" suffix (e.g., `utils.test.ts`)

**Directories:**
- **Feature directories:** PascalCase (e.g., `Diet/`, `AddFood/`, `InfoModal/`)
- **Component containers:** components/ (lowercase, general-purpose)
- **Nested feature components:** components/ subdirectory with PascalCase (e.g., `Diet/components/`)

**Functions:**
- **Async storage operations:** camelCase prefixed with get/set/store/remove (e.g., `getStoredData`, `storeData`, `removeStoredData`)
- **Calculation functions:** camelCase with "calculate" or "convert" prefix (e.g., `calculateBMR`, `convertCarbsToCalories`)
- **Context actions:** camelCase, map directly to action types (e.g., `setInfoState`, `setBasicInfoCalculations`)
- **Utility aggregators:** camelCase with "get" prefix (e.g., `getMacrosFromMeals`, `getAveragesFromDietDays`)

**Variables:**
- **State variables:** camelCase (e.g., `todaysMeals`, `basicInfo`, `carbs`, `proteinUnit`)
- **Constants:** UPPER_SNAKE_CASE for exported config values (e.g., `TDEE_LEVELS`, `CALORIES_PER_MACRO_UNIT_MAPPING`)
- **Type-based prefixes:** Minimal use; context objects unprefixed (e.g., `basicInfo` not `infoBasic`)

## Where to Add New Code

**New Feature (e.g., Workout Logging):**
- **Primary code:** `screens/Fitness/` (create new directory, parallel to Diet)
- **State management:** `context/FitnessContext.tsx` (new context following MealContext pattern)
- **Navigation:** Add new tab to `navigation/BottomTabNavigator.tsx`
- **Types:** Add new feature types to `types.tsx`
- **Tests:** `__tests__/fitness.test.ts`

**New Component/Module:**
- **Reusable UI component:** `components/ComponentName/index.tsx` + subcomponents in `components/ComponentName/`
- **Feature-specific component:** Colocate in feature directory, e.g., `screens/Diet/components/MyComponent.tsx`
- **Visualization component:** Create in `components/` with D3/SVG integration (follow BarGraph or MealTimeGraph pattern)

**Utilities:**
- **Calculation/conversion:** Add to `utils.ts` or create new file in root if domain-specific
- **Constants:** Add to `constants.ts` or create new constants file (e.g., `constants/Calculations.ts`)
- **Helpers:** Add inline to utils.ts or create new utility file following camelCase naming

**Tests:**
- **Unit tests for functions:** `__tests__/[feature].test.ts`
- **Component tests:** Can colocate in `__tests__/` with feature prefix or use React Native Testing Library
- **Configuration:** Jest configured in `package.json` or `jest.config.js` (if present)

## Special Directories

**node_modules/:**
- Purpose: Installed npm dependencies
- Generated: Yes (via npm install)
- Committed: No (listed in .gitignore)

**.git/:**
- Purpose: Git repository metadata
- Generated: Yes (via git init)
- Committed: No (excluded)

**.planning/:**
- Purpose: Documentation and planning artifacts (GSD tool output)
- Generated: Yes (by GSD tools)
- Committed: Depends on project policy; typically included for codebase guidance

**android/, ios/:**
- Purpose: Native platform build projects
- Generated: Partially (some files regenerated on build)
- Committed: Yes (source files must be committed; node_modules-like deps in Gradle/CocoaPods are not)

---

*Structure analysis: 2026-03-10*
