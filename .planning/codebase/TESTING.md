# Testing Patterns

**Analysis Date:** 2026-03-10

## Test Framework

**Runner:**
- Jest v29.5.14+
- Preset: `react-native` (configured in package.json)
- TypeScript support: via `@types/jest: ^29.5.14`

**Assertion Library:**
- Jest's built-in matchers (`expect()`, `.toEqual()`, `.toBe()`)

**Run Commands:**
```bash
npm run test              # Run all tests in watch mode (--watchAll)
npm run test:single      # Run tests once (single execution, no watch)
```

**Test file location:**
```
__tests__/
  └── utils.test.ts
```

## Test File Organization

**Location:**
- Tests co-located in `__tests__` directory at project root
- Pattern: `__tests__/[name].test.ts` for utility tests

**Naming:**
- Test files: `<module>.test.ts` (e.g., `utils.test.ts`)
- Match source file names

**Structure:**
```
__tests__/
└── utils.test.ts       # Tests for /utils.ts
```

## Test Structure

**Suite Organization:**
```typescript
describe('utils', () => {
  describe('getTodaysDate', () => {
    it("should get today's date in MM/DD/YYYY string format", () => {
      // test body
    });
  });

  describe('getDay', () => {
    it("should get today's day of the week", () => {
      // test body
    });
  });

  describe('convertCarbsToCalories', () => {
    it("should be able to handle grams", () => {
      // test body
    });

    it("should be able to handle oz", () => {
      // test body
    });

    it("should default to grams if no unit is provided", () => {
      // test body
    });
  });
});
```

**Patterns:**
- Top-level `describe()` wraps entire module
- Secondary `describe()` blocks group tests by function
- `it()` tests individual cases (behavior or parameter variation)
- Arrange-Act-Assert pattern: setup → call function → verify result

**Setup/Teardown:**
- Not currently used (tests are stateless)
- No `beforeEach()` or `afterEach()` hooks observed

**Assertion Pattern:**
```typescript
it("should convert carbs to calories in grams", () => {
  const grams = 10;
  const caloriesPerCarbGram = CALORIES_PER_MACRO_UNIT_MAPPING.carbs.g;

  const actual = convertCarbsToCalories(grams, 'g');

  expect(actual).toEqual(grams * caloriesPerCarbGram);
});
```

## Mocking

**Framework:**
- Not currently used in existing tests
- Jest allows manual mocks if needed via `jest.mock()`

**Current Approach:**
- Tests use real constants and utilities
- No mock implementation for AsyncStorage or external libraries
- No mock functions for testing interactions

**What to Mock (if needed):**
- `@react-native-async-storage/async-storage` for persistence layer tests
- Date dependencies (use real `Date` object in current tests)
- Network calls (none exist - local-only app)

**What NOT to Mock:**
- Utility functions and calculation helpers (test with real implementations)
- Constants (test uses real `CALORIES_PER_MACRO_UNIT_MAPPING`)
- Pure functions like conversions (no side effects to mock)

## Fixtures and Factories

**Test Data:**
- Inline literal values (e.g., `const grams = 10`)
- Constants pulled from actual codebase: `CALORIES_PER_MACRO_UNIT_MAPPING.carbs.g`
- No fixture files or factory functions currently used

**Location:**
- Test data embedded in individual test cases
- Shared constants imported from `../constants`

**Example:**
```typescript
it("should be able to handle grams", () => {
  const grams = 10;
  const caloriesPerCarbGram = CALORIES_PER_MACRO_UNIT_MAPPING.carbs.g;

  const actual = convertCarbsToCalories(grams, 'g');

  expect(actual).toEqual(grams * caloriesPerCarbGram);
});
```

## Coverage

**Requirements:**
- No coverage threshold enforced
- No coverage reporting configured

**View Coverage:**
- Not configured; would use: `npm run test:single -- --coverage`
- Jest can generate coverage reports if needed

## Test Types

**Unit Tests:**
- Primary test type: utility function tests
- File: `__tests__/utils.test.ts`
- Scope: Individual pure functions (conversions, date helpers)
- Approach: Inline test data, real constants, direct assertions

**Examples from `utils.test.ts`:**
```typescript
describe('convertCarbsToCalories', () => {
  it("should be able to handle grams", () => {
    const grams = 10;
    const caloriesPerCarbGram = CALORIES_PER_MACRO_UNIT_MAPPING.carbs.g;

    const actual = convertCarbsToCalories(grams, 'g');

    expect(actual).toEqual(grams * caloriesPerCarbGram);
  });

  it("should be able to handle oz", () => {
    const oz = 2;
    const caloriesPerCarbOz = CALORIES_PER_MACRO_UNIT_MAPPING.carbs.oz;

    const actual = convertCarbsToCalories(oz, 'oz');

    expect(actual).toEqual(oz * caloriesPerCarbOz);
  });

  it("should default to grams if no unit is provided", () => {
    const grams = 10;
    const caloriesPerCarbGram = CALORIES_PER_MACRO_UNIT_MAPPING.carbs.g;

    const actual = convertCarbsToCalories(grams);

    expect(actual).toEqual(grams * caloriesPerCarbGram);
  });
});
```

**Integration Tests:**
- Not currently implemented
- Would test context + reducer + persistence layer interactions
- Would test meal storage/retrieval flow

**E2E Tests:**
- Not used
- Testing approach for React Native components would typically use Detox or similar

## Common Patterns

**Testing Utility Functions:**
```typescript
describe('getTodaysDate', () => {
  it("should get today's date in MM/DD/YYYY string format", () => {
    const today = new Date().toLocaleDateString('en-us');
    const maxLength = 'MM/DD/YYYY'.length;

    const actual = getTodaysDate();

    expect(actual).toEqual(today);
    expect(actual.length <= maxLength).toBe(true);
  });
});
```

**Testing with Multiple Assertions:**
- Single `it()` block tests one behavior
- Multiple assertions verify all aspects of that behavior
- Example: date format + length validation in one test

**Testing Default Parameters:**
```typescript
it("should default to grams if no unit is provided", () => {
  const grams = 10;
  const caloriesPerCarbGram = CALORIES_PER_MACRO_UNIT_MAPPING.carbs.g;

  const actual = convertCarbsToCalories(grams);

  expect(actual).toEqual(grams * caloriesPerCarbGram);
});
```

## Test Coverage Gaps

**Currently Untested Areas:**

**Context and State Management (`context/`):**
- Files: `HistoryContext.tsx`, `MealContext.tsx`, `InfoContext.tsx`
- What's not tested: Reducer logic, action creators, provider setup
- Reason: No component tests or context tests configured
- Priority: **High** - these drive app state

**Async Storage Operations:**
- Files: `context/MealContext.tsx`, `utils.ts`
- What's not tested: `storeMeal()`, `updateMeal()`, `deleteMeal()`, `getAllMealData()`, `getMealData()`
- Reason: Would require AsyncStorage mock
- Priority: **High** - data persistence is critical

**Component Tests:**
- Files: `screens/**/*.tsx`, `components/**/*.tsx`
- What's not tested: Screen rendering, form submission, navigation
- Reason: Would require React Native testing library + navigation mocks
- Priority: **Medium** - UI layer testing

**React Hooks:**
- Files: `hooks/useCachedResources.ts`, `hooks/useColorScheme.ts`
- What's not tested: Hook behavior, effects
- Reason: Would require hooks testing library
- Priority: **Low** - hooks are thin wrappers

**Error Handling in Async Functions:**
- Files: `context/MealContext.tsx`, `utils.ts`
- What's not tested: Try-catch blocks, error throwing
- Reason: Would need mock AsyncStorage to simulate failures
- Priority: **Medium** - error paths are not verified

## Recommendations for Expansion

**Priority 1: Mock AsyncStorage and test persistence layer**
```typescript
// Example structure for future tests
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
}));

describe('storeMeal', () => {
  it('should store meal in AsyncStorage with correct key', async () => {
    const meal = { id: '1', /* ... */ };
    await storeMeal('03/10/2026', meal);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'meals@03/10/2026',
      JSON.stringify([meal])
    );
  });
});
```

**Priority 2: Add reducer tests for context files**
- Test `historyReducer`, `mealReducer`, `infoReducer`
- Verify action types produce correct state mutations
- Test default cases

**Priority 3: Test validation and error scenarios**
- Test `areFieldsValid()` with various inputs
- Test error conditions in meal storage (already existing data, missing data)

---

*Testing analysis: 2026-03-10*
