# Coding Conventions

**Analysis Date:** 2026-03-10

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `AddFoodScreen.tsx`, `MacroInput.tsx`)
- Utility functions: camelCase (e.g., `utils.ts`, `calculateBMR`)
- Constants: UPPER_SNAKE_CASE (e.g., `DAILY_RECOMMENDED_CALORIES`, `BMR_MALE_BASE`)
- Directories: kebab-case (e.g., `AddFood`, `Diet`, `InfoModal`)
- Test files: `<filename>.test.ts` or `<filename>.test.tsx`

**Functions:**
- Utility functions: camelCase (`getTodaysDate`, `calculateBMI`, `convertCarbsToCalories`)
- Action creators: camelCase (`setCarbs`, `setDailyProgress`, `storeMeal`, `updateMeal`)
- Event handlers: camelCase (`setSearch`, `setValue`, `setUnit`)
- React hooks: `use` prefix camelCase (`useCachedResources`, `useColorScheme`, `useContext`, `useReducer`)

**Variables:**
- Regular variables: camelCase (`isLoadingComplete`, `colorScheme`, `dietHistory`, `carbsNum`)
- Boolean flags: `is`/`are`/`has` prefix (e.g., `isDisabled`, `areMeals`, `isNumber`, `isLoadingComplete`)
- State setters: `set` + PascalCase property (`setCarbs`, `setMealName`, `setDietHistory`)

**Types:**
- Type aliases: PascalCase (e.g., `Props`, `State`, `TextProps`, `ViewProps`)
- Interface names: PascalCase (e.g., `DietDay`, `Meal`, `Info`, `GenericAction`)
- Generic param names: Single uppercase letter or descriptive (e.g., `S`, `State`)
- Type discriminants: UPPER_SNAKE_CASE strings (e.g., `SET_CARBS`, `SET_DAILY_PROGRESS`)

## Code Style

**Formatting:**
- No explicit formatter configured (eslint/prettier not detected in project)
- Indentation: 2 spaces (standard React Native convention observed)
- Line length: No strict enforced limit observed
- Semicolons: Present in most code, required

**Linting:**
- No eslint or prettier configuration detected
- TypeScript strict mode: Enabled (`"strict": true` in tsconfig.json)
- JSX: Set to `react-native` mode in tsconfig

## Import Organization

**Order (observed pattern):**
1. React and React Native imports
2. Third-party library imports (navigation, icons, UI libraries)
3. Local module imports (utils, types, components, context)
4. Style imports (StyleSheet)

**Example from `AddFoodScreen.tsx`:**
```typescript
import React, { useContext, useState } from 'react';
import { SearchBar } from '@rneui/themed';
import { Text, View } from '../../components/Themed';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Spacer from '../../components/Spacer';
import { Context as MealContext, storeMeal, updateMeal } from '../../context/MealContext';
import { v4 as uuidv4 } from 'uuid';
import MacroInput from './components/MacroInput';
import { convertCarbsToCalories, getTodaysDate } from '../../utils';
```

**Path Aliases:**
- Relative paths used throughout (../../ patterns observed)
- No configured path aliases detected in tsconfig.json

## Error Handling

**Patterns:**
- Try-catch blocks for async operations (`.storeMeal()`, `.updateMeal()`, AsyncStorage operations)
- Console.error for logging errors: `console.error(`Error: ${e}. Could not store meal!`)`
- Errors often caught but action proceeds (error logged, UI callback still executes)
- Validation before operations: `areFieldsValid()` function checks form state before allowing submission
- Null/undefined checks with fallback values: `get(meal, 'id') ? ... : ...`

**Example from `AddFoodScreen.tsx`:**
```typescript
try {
  await storeMeal(shortDate || getTodaysDate(), {
    // meal object
  });
} catch (e) {
  console.error(`Error: ${e}. Could not store meal!`);
}
```

**Example from `MealContext.tsx`:**
```typescript
export const updateMeal = async (date: string, updatedMeal: Meal) => {
  const mealKey = `meals@${date}`;
  const meals = await getStoredData(mealKey);
  const areMeals = meals !== null && meals.length;

  if (areMeals) {
    // update logic
  } else {
    throw new Error('Cannot update a meal that does not exist yet!');
  }
};
```

## Logging

**Framework:** `console` (no dedicated logging library)

**Patterns:**
- `console.error()` for error logging
- `console.warn()` for warnings (observed in `useCachedResources.ts`)
- Template literals for message formatting: `console.error(`Error: ${e}`)`
- Error context included in messages: `Error: ${e}. Could not store meal!`

**Example:**
```typescript
console.error(`Error: Encountered an error while removing an item from AsyncStorage: ${error}`);
```

## Comments

**When to Comment:**
- JSDoc comments on exported types and interfaces
- Link documentation in comments (e.g., React Navigation TypeScript guide)
- Inline comments for non-obvious logic or workarounds
- Commented-out code blocks are present (e.g., in `AddFoodScreen.tsx` lines 55-64)

**JSDoc/TSDoc:**
- Minimal JSDoc usage observed
- Comments include reference links for complex concepts
- Example from `types.tsx`: Link to React Navigation TypeScript docs

**Example from code:**
```typescript
/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
```

## Function Design

**Size:**
- Utility functions: Typically 1-15 lines (single-purpose conversions, date helpers)
- Component screens: 50-100+ lines (manage state, layout, navigation)
- Reducer functions: 10-20 lines (switch statements with type cases)

**Parameters:**
- Destructured props in React components: `({ route, navigation }: Props)`
- Explicit types for function parameters (all functions are typed)
- Default parameters used for optional values: `carbsUnit: string = 'g'`
- Props interface created for each component

**Return Values:**
- Functions return single values or objects
- Async functions return Promises (explicitly typed: `Promise<DietDay[]>`)
- Array methods use map/filter for transformations
- Reducer returns new state object using spread: `{ ...state, carbs: action.payload }`

**Example from `utils.ts`:**
```typescript
export const getTodaysDate = (): string =>
  new Date().toLocaleDateString('en-us');

export const calculateBMR = (
  gender: string,
  weight: number,
  height: number,
  age: number
) => {
  // calculation logic
  return result;
};
```

## Module Design

**Exports:**
- Named exports for most functions and components
- Default export for screens/main components
- Context exports: `export const { Provider, Context } = createDataContext(...)`
- Mixed export pattern in context files (named for utilities, default for Provider)

**Example from `MealContext.tsx`:**
```typescript
export const storeMeal = async (date: string, meal: Meal) => { /* ... */ };
export const updateMeal = async (date: string, updatedMeal: Meal) => { /* ... */ };
export const { Provider, Context } = createDataContext(...);
```

**Barrel Files:**
- Minimal barrel file usage observed
- No `index.ts` re-exports found in context or components directories
- Imports reference actual files: `import { Context as MealContext } from '../../context/MealContext'`

## React Component Patterns

**Functional Components:**
- All components are functional (no class components)
- Hooks used for state and effects: `useState`, `useEffect`, `useContext`, `useReducer`

**State Management:**
- Local state via `useState` for form inputs
- Context + useReducer for global state (meals, history, user info)
- Direct AsyncStorage calls from utils for persistence

**Props Pattern:**
- Explicit `Props` type interface created for each component
- Destructuring in function signature: `function Component({ prop1, prop2 }: Props)`

**Example from `DietHistoryScreen.tsx`:**
```typescript
type Props = {
  navigation: DietScreenNavigationProp;
};

const DietHistoryScreen = ({ navigation }: Props) => {
  // component logic
};
```

## TypeScript Usage

**Strict Mode:** Enabled globally

**Type Coverage:**
- All function parameters typed
- Component props interfaces created
- Return types specified (especially for async functions)
- Generic types used for context creation: `createDataContext<Info>(...)`

**Type Assertions:**
- Type casting used in calculateBMR: `const C = CONSTANTS as unknown as Record<string, number>`
- Minimal `any` usage (prefer proper types)

---

*Convention analysis: 2026-03-10*
