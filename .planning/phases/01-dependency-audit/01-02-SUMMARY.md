---
phase: 01-dependency-audit
plan: 02
subsystem: ui
tags: [react-native-bootsplash, react-native-svg, d3-shape, splash-screen, pie-chart, dependency-removal]

# Dependency graph
requires:
  - phase: 01-dependency-audit plan 01
    provides: "Confirmed list of blocking/removable libraries: react-native-splash-screen, react-native-chart-kit, execa"
provides:
  - "react-native-splash-screen removed from package.json and native files"
  - "react-native-chart-kit removed from package.json"
  - "react-native-bootsplash@7.1.0 installed with iOS/Android native wiring and JS-layer dismiss"
  - "MacroGraph.tsx custom SVG pie chart using D3 + react-native-svg (no chart-kit)"
  - "execa removed from production deps"
  - "AsyncStorage jest mock configured in package.json (fixes test infrastructure)"
affects:
  - phase-2-version-upgrade
  - phase-3-new-architecture

# Tech tracking
tech-stack:
  added:
    - react-native-bootsplash@7.1.0 (replaces react-native-splash-screen)
  patterns:
    - D3 pie/arc generators + react-native-svg for charts (established in BarGraph, now also MacroGraph)
    - BootSplash.hide({ fade: true }) in App.tsx root useEffect for JS-layer dismiss
    - RNBootSplash.initWithStoryboard in AppDelegate.m customizeRootView for iOS native hook
    - Granular d3 subpackage imports (d3-shape, d3-scale) instead of full d3 bundle — Metro compatible

key-files:
  created:
    - __tests__/MacroGraph.test.tsx
    - ios/macromaker/BootSplash.storyboard
    - ios/macromaker/Colors.xcassets/BootSplashBackground-ea7b4e.colorset/Contents.json
    - ios/macromaker/Images.xcassets/BootSplashLogo-ea7b4e.imageset/Contents.json
    - android/app/src/main/res/values/styles.xml (BootTheme)
    - assets/bootsplash/manifest.json
  modified:
    - components/MacroGraph.tsx (SVG pie chart, no chart-kit)
    - App.tsx (BootSplash.hide useEffect)
    - ios/macromaker/AppDelegate.m (RNBootSplash import + customizeRootView)
    - ios/macromaker/Info.plist (UILaunchStoryboardName: BootSplash)
    - android/app/src/main/java/com/carymeskell/macrotracker/MainActivity.java (RNBootSplash.init)
    - package.json (removed 3 packages, added bootsplash, added AsyncStorage jest mock)

key-decisions:
  - "Used customizeRootView Obj-C hook in AppDelegate.m for bootsplash init — AppDelegate.m is legacy Obj-C (will be replaced in Phase 2)"
  - "JS dismiss placed in App.tsx root component useEffect (empty deps) — fires once on mount, after resources loaded"
  - "All-zeros pie chart state renders equal gray slices instead of crashing on divide-by-zero"
  - "AsyncStorage jest mock added to package.json jest config — fixes pre-existing broken test infrastructure (Rule 2)"
  - "Import pie/arc from d3-shape (not d3 bundle) — Metro cannot resolve full d3 ES module bundle; matches pattern of all other graph components using d3-scale"

patterns-established:
  - "Pie chart pattern: d3pie/d3arc generators with PIE_RADIUS=90, centered G transform, Path per slice"
  - "TDD pattern: write failing test first (chart-kit import causes fail), rewrite component, confirm green"
  - "d3 subpackage imports: always import from specific subpackage (d3-shape, d3-scale) not the d3 bundle — Metro ESM compatibility"

requirements-completed:
  - DEPS-02

# Metrics
duration: 65min
completed: 2026-03-10
---

# Phase 01 Plan 02: Dependency Replacement Summary

**Replaced react-native-splash-screen with react-native-bootsplash@7.1.0 (iOS/Android native + JS dismiss) and rewrote MacroGraph as a D3+SVG pie chart — both blocking libraries removed before RN version bump; human-verified working**

## Performance

- **Duration:** ~65 min (including human verification and post-checkpoint fixes)
- **Started:** 2026-03-10T21:47Z
- **Completed:** 2026-03-10T22:47Z
- **Tasks:** 3 (all complete, including checkpoint:human-verify)
- **Files modified:** 27

## Accomplishments

- Removed react-native-splash-screen, react-native-chart-kit, and execa from package.json
- Installed react-native-bootsplash@7.1.0 with full iOS native wiring (AppDelegate.m, Info.plist, BootSplash.storyboard) and Android wiring (MainActivity.java, BootTheme styles)
- Added JS-layer dismiss (BootSplash.hide with fade) in App.tsx root useEffect
- Rewrote MacroGraph.tsx as custom D3 + react-native-svg pie chart — zero chart-kit imports
- Generated bootsplash assets for both platforms from existing app logo
- Fixed pre-existing broken jest infrastructure (AsyncStorage mock) while adding MacroGraph tests
- Human-verified: splash screen dismisses cleanly on cold start, MacroGraph pie chart renders colored slices, no red screen errors

## Task Commits

Each task was committed atomically:

1. **TDD RED — MacroGraph failing test** - `073b2e3` (test)
2. **TDD GREEN — MacroGraph SVG pie chart** - `21ddc85` (feat)
3. **Task 2 — Remove blocking deps, install bootsplash, wire native + JS** - `453836c` (feat)
4. **Task 3 — checkpoint:human-verify** - approved by user (no code commit)

**Post-checkpoint auto-fixes:**
- `7b9e44b` — fix(MacroGraph): import pie/arc from d3-shape instead of d3 bundle (Metro ESM error)
- `552fb5a` — fix(hooks): remove stale react-native-splash-screen import from useCachedResources.ts

_Note: Task 1 (TDD) produced two commits: RED test, then GREEN implementation._

## Files Created/Modified

- `components/MacroGraph.tsx` - Custom SVG pie chart using d3pie/d3arc + react-native-svg, 3-macro legend
- `__tests__/MacroGraph.test.tsx` - TDD test suite verifying no chart-kit dependency, percentage math
- `App.tsx` - Added BootSplash import and hide({ fade: true }) useEffect
- `ios/macromaker/AppDelegate.m` - Added RNBootSplash.h import and customizeRootView hook
- `ios/macromaker/Info.plist` - UILaunchStoryboardName changed from SplashScreen to BootSplash
- `ios/macromaker/BootSplash.storyboard` - Generated by bootsplash CLI
- `android/app/src/main/java/com/carymeskell/macrotracker/MainActivity.java` - Added RNBootSplash.init before super.onCreate
- `android/app/src/main/res/values/styles.xml` - BootTheme for Android splash
- `package.json` - Removed 3 packages, added bootsplash, added AsyncStorage jest mock config
- `assets/bootsplash/` - Generated logo assets at multiple densities
- `hooks/useCachedResources.ts` - Removed stale react-native-splash-screen import and call

## Decisions Made

- Used `customizeRootView` Obj-C hook pattern for iOS since AppDelegate is legacy Obj-C (will be replaced with Swift in Phase 2 when upgrading to RN 0.76+)
- Placed JS dismiss in App.tsx root useEffect (not in useCachedResources hook) so it fires regardless of loading state
- All-zeros pie state shows equal gray slices instead of error or crash — safe fallback
- AsyncStorage jest mock added to package.json jest config (fixes pre-existing broken test infra — Rule 2 auto-fix)
- Import pie/arc from `d3-shape` (not `d3` bundle) — Metro cannot resolve full d3 ES module; matches pattern of all other graph components

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added AsyncStorage jest mock to package.json**
- **Found during:** Task 1 (MacroGraph TDD test setup)
- **Issue:** Jest suite failed with "Cannot find module" on AsyncStorage native code — pre-existing infrastructure broken, affects all current and future tests
- **Fix:** Added `moduleNameMapper` to package.json jest config pointing to `@react-native-async-storage/async-storage/jest/async-storage-mock` (built-in mock provided by the library)
- **Files modified:** package.json
- **Verification:** `npm run test` shows utils.test.ts now passes (12 tests); was previously 0 tests run
- **Committed in:** `073b2e3` (TDD RED commit)

---

**2. [Rule 1 - Bug] Fixed Metro bundler crash: d3 bundle import in MacroGraph.tsx**
- **Found during:** Task 3 (human verification — app failed to launch after Task 2 commit)
- **Issue:** MacroGraph imported `pie, arc` from `'d3'` (the full bundle); Metro cannot resolve d3's ES module format and threw a bundler error on launch
- **Fix:** Changed import to `from 'd3-shape'` — the specific subpackage containing pie/arc, which Metro can resolve. Matches pattern of all other graph components (BarGraph, MealTimeGraph, TotalCaloriesGraph all use d3-scale directly).
- **Files modified:** `components/MacroGraph.tsx`
- **Verification:** App launched; human confirmed no red screen errors
- **Committed in:** `7b9e44b`

**3. [Rule 1 - Bug] Removed stale react-native-splash-screen import from useCachedResources.ts**
- **Found during:** Task 3 (post-checkpoint investigation after Metro error)
- **Issue:** `hooks/useCachedResources.ts` still imported SplashScreen from react-native-splash-screen and called `SplashScreen.hideAsync()` — the package had been uninstalled, causing an import resolution error
- **Fix:** Removed the import and the `SplashScreen.hideAsync()` call. Bootsplash dismiss is now handled exclusively in App.tsx.
- **Files modified:** `hooks/useCachedResources.ts`
- **Verification:** App launched with no import errors; splash dismiss confirmed working via App.tsx path
- **Committed in:** `552fb5a`

---

**Total deviations:** 3 auto-fixed (1 missing critical — test infrastructure, 2 bugs found during human verification)
**Impact on plan:** All auto-fixes necessary for correct operation. The d3-shape and useCachedResources fixes were migration gaps found during human verification. No scope creep.

## Issues Encountered

- **pod install fails:** `react-native-safe-area-context` podspec calls `visionos` method not supported by installed CocoaPods version. Pre-existing issue — unrelated to bootsplash changes. Bootsplash iOS native linking is handled via Xcode project file (updated by `bootsplash generate` CLI). Note logged to deferred-items.
- **App failed to launch during human verification:** Two bugs caused launch failure after Task 2 commit — Metro could not bundle the d3 ES module, and a stale splash-screen import in useCachedResources caused a second error. Both diagnosed and fixed (see Deviations). Human approval was given after fixes were in place.

## User Setup Required

None — human verification is complete. User confirmed: splash screen dismissed cleanly, pie chart renders with colored slices and legend, no red screen errors.

## Next Phase Readiness

- All confirmed-blocking libraries removed from JS dependency tree — human-verified working
- react-native-bootsplash wired on both platforms; splash dismiss confirmed on iOS cold start
- MacroGraph using only New Architecture-compatible libraries (react-native-svg + d3-shape)
- Package.json is clean for Phase 2 version upgrade work
- Blocker: pod install fails on pre-existing CocoaPods visionOS compatibility issue with react-native-safe-area-context — must resolve before Phase 2 iOS builds
- Phase 2 concern: AppDelegate.m Obj-C customizeRootView hook will be replaced with Swift in Phase 2 RN migration

---
*Phase: 01-dependency-audit*
*Completed: 2026-03-10*
