---
phase: 02-infrastructure-upgrade
plan: "01"
subsystem: testing
tags: [jest, asyncstorage, react-native, unit-tests]

# Dependency graph
requires: []
provides:
  - "Unit tests for removeStoredData covering correct key call and no-throw behavior"
  - "Manual AsyncStorage v3 jest mock replacing removed jest/async-storage-mock.js"
  - "jest installed as local devDependency for deterministic test runs"
affects: [02-04]

# Tech tracking
tech-stack:
  added: ["jest@29.7.0 (devDependency)"]
  patterns: ["AsyncStorage v3 manual mock at __mocks__/@react-native-async-storage/async-storage.js", "Spy on AsyncStorage methods in tests using jest.spyOn + mockRestore"]

key-files:
  created:
    - "__mocks__/@react-native-async-storage/async-storage.js"
  modified:
    - "__tests__/utils.test.ts"
    - "package.json"

key-decisions:
  - "AsyncStorage v3 manual mock created at __mocks__ directory because v3.0.1 removed the jest/async-storage-mock.js path that v1.x provided"
  - "jest moduleNameMapper updated to point to local __mocks__ file instead of removed v1.x mock path"
  - "Spy assertion uses toHaveBeenCalledWith(key) (no callback arg) matching the promise-based API already in place from plan 02-04"

patterns-established:
  - "AsyncStorage spy pattern: jest.spyOn(AsyncStorage, 'removeItem') with spy.mockRestore() in teardown"
  - "Manual mock for v3 AsyncStorage: __mocks__/@react-native-async-storage/async-storage.js"

requirements-completed: [JSDP-05]

# Metrics
duration: 15min
completed: 2026-03-11
---

# Phase 2 Plan 01: Add removeStoredData Unit Tests Summary

**Two removeStoredData tests added to utils.test.ts plus AsyncStorage v3 manual mock created to replace removed v1.x jest mock path**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-11
- **Completed:** 2026-03-11
- **Tasks:** 1 (+ 1 Rule 3 deviation fix)
- **Files modified:** 3

## Accomplishments
- Added `removeStoredData` import to `__tests__/utils.test.ts`
- Added `AsyncStorage` import for spy assertions
- Added `describe('removeStoredData', ...)` block with two tests inside the outer `describe('utils', ...)` wrapper
- Created `__mocks__/@react-native-async-storage/async-storage.js` manual mock for AsyncStorage v3.0.1 (v3 removed the jest/async-storage-mock.js path)
- Updated `package.json` jest moduleNameMapper to point to the new manual mock
- Installed `jest@29.7.0` as devDependency for local binary execution
- Full test suite green: 14 tests passing (12 existing + 2 new)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add removeStoredData tests to utils.test.ts** - `9e146bc` (test)
2. **Deviation fix: AsyncStorage v3 manual mock** - `3f5e94f` (fix)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `__tests__/utils.test.ts` - Added AsyncStorage import, removeStoredData import, and new describe block with two tests
- `__mocks__/@react-native-async-storage/async-storage.js` - Manual jest mock for AsyncStorage v3.0.1
- `package.json` - Updated jest moduleNameMapper to use local mock; added jest devDependency

## Decisions Made
- AsyncStorage v3.0.1 removed the `jest/async-storage-mock.js` subdirectory that v1.x provided. Created a manual mock at the standard Jest `__mocks__` path to replace it.
- Spy assertion uses `toHaveBeenCalledWith(key)` without callback argument, consistent with the promise-based `removeStoredData` implementation already in place from plan 02-04.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created AsyncStorage v3 manual mock and updated jest config**
- **Found during:** Task 1 verification (test run)
- **Issue:** `@react-native-async-storage/async-storage` v3.0.1 removes the `jest/async-storage-mock.js` that was used in moduleNameMapper. Jest failed to resolve the mock, preventing tests from running.
- **Fix:** Created `__mocks__/@react-native-async-storage/async-storage.js` with a full manual mock (setItem, getItem, removeItem, clear, getAllKeys, multiGet, etc.); updated `package.json` moduleNameMapper to `<rootDir>/__mocks__/@react-native-async-storage/async-storage.js`; installed jest as local devDependency for deterministic test execution.
- **Files modified:** `__mocks__/@react-native-async-storage/async-storage.js` (created), `package.json`
- **Verification:** All 14 tests pass with local jest binary
- **Committed in:** `3f5e94f`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix was necessary — without it the entire test suite failed to run. No scope creep; the mock is minimal and accurate for the v3 API.

## Issues Encountered
- The npx jest global cache used an older babel host that masked the missing mock issue on first run. Switching to local jest binary (`node_modules/.bin/jest`) resolved the environment inconsistency.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- removeStoredData is covered by tests with the current promise-based API
- AsyncStorage v3 mock is in place for any future async-storage test additions
- `node_modules/.bin/jest` (local binary) should be used for test runs going forward

---
*Phase: 02-infrastructure-upgrade*
*Completed: 2026-03-11*
