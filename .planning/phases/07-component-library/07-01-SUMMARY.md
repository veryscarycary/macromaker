---
phase: 07-component-library
plan: 01
subsystem: testing
tags: [react-native, testing-library, jest, design-system, tdd]

# Dependency graph
requires:
  - phase: 05-token-foundation-font-integration
    provides: design/tokens/ barrel with colors, typeScale, spacing, radius constants
  - phase: 06-paper-theme-integration
    provides: paperTheme.ts with no hex literals pattern established
provides:
  - Behavioral test contracts (RED) for Text, NumericText, Button, Card, MacroProgressBar
  - testID requirements documented for each component
  - Props interface specs documented for all five components
  - Zero-hex structural test for MacroProgressBar
affects:
  - 07-02 (component implementation — must make these tests GREEN)
  - 07-03, 07-04 (downstream component plans)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "TDD RED-first: test files import from barrel that does not exist yet (module-not-found = correct RED)"
    - "Style flattening pattern: Array.isArray(node.props.style) ? Object.assign({}, ...style.filter(Boolean)) : style"
    - "testID convention: ds-{component} for outer element, macro-{role}-{macro} for MacroProgressBar internals"
    - "Structural test: fs.readFileSync to assert no hex literals in component source"

key-files:
  created:
    - __tests__/components/Text.test.tsx
    - __tests__/components/NumericText.test.tsx
    - __tests__/components/Button.test.tsx
    - __tests__/components/Card.test.tsx
    - __tests__/components/MacroProgressBar.test.tsx
  modified: []

key-decisions:
  - "All component tests import from '../../design/components' barrel only — never individual file paths"
  - "Style inspection uses array flatten pattern (Object.assign + filter(Boolean)) to handle RN style arrays"
  - "MacroProgressBar requires 7 distinct testIDs: macro-bar-container plus 3 segment containers plus 3 fill views"
  - "Structural no-hex-literals test uses fs.readFileSync against source path — also fails RED since file doesn't exist"

patterns-established:
  - "RED state: import fails with Cannot find module, not SyntaxError — valid TypeScript with broken runtime dependency"
  - "testID comments: each test file documents the testID requirements implementers must add to components"

requirements-completed: [COMP-01, COMP-02, COMP-03, COMP-04, COMP-05]

# Metrics
duration: 2min
completed: 2026-03-20
---

# Phase 7 Plan 01: Component Library Test Stubs Summary

**Five RED-state TDD test files establishing behavioral contracts for Text, NumericText, Button, Card, and MacroProgressBar components before any implementation exists**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-20T17:02:51Z
- **Completed:** 2026-03-20T17:05:26Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Created 5 test files with 28 total test cases covering all five design system components
- Each file documents the required testIDs and props interface in comments for Plan 07-02 implementers
- All 5 new files fail RED with "Cannot find module '../../design/components'" — no SyntaxErrors
- MacroProgressBar includes a structural test asserting no hardcoded hex literals in the source file

## Task Commits

Each task was committed atomically:

1. **Task 1: Text and NumericText test stubs (RED)** - `5ee3013` (test)
2. **Task 2: Button and Card test stubs (RED)** - `a2a6b6e` (test)
3. **Task 3: MacroProgressBar test stub (RED)** - `74c0d0a` (test)

## Files Created/Modified

- `__tests__/components/Text.test.tsx` - 12 cases: all 9 type variants, default/custom color, style spread, numberOfLines passthrough
- `__tests__/components/NumericText.test.tsx` - 6 cases: tabular-nums enforcement on all variants, color inheritance
- `__tests__/components/Button.test.tsx` - 6 cases: all 3 variants render label, onPress fires, disabled blocks press, opacity 0.4
- `__tests__/components/Card.test.tsx` - 4 cases: children render, backgroundColor, bordered=false no border, bordered=true border tokens
- `__tests__/components/MacroProgressBar.test.tsx` - 5 cases: zero-target guard, valid props, normal fill color, overflow error color, no hex literals structural

## Decisions Made

- Import path always uses barrel `'../../design/components'` — never individual file paths. This future-proofs tests against internal refactors.
- Style assertions use the array-flatten pattern `Object.assign({}, ...styles.filter(Boolean))` to handle both plain objects and arrays uniformly.
- MacroProgressBar structural test (`fs.readFileSync`) will also fail RED since the source file doesn't exist yet — that is expected and documented.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All 5 test files are in place and fail RED
- Plan 07-02 can now implement the components and turn these tests GREEN
- testID requirements and props interfaces are documented in each test file's header comment

---
*Phase: 07-component-library*
*Completed: 2026-03-20*
