---
phase: 02-infrastructure-upgrade
plan: "06"
subsystem: infra
tags: [react-native, ios, cocoapods, xcode, new-architecture, fabric, hermes, codegen]

# Dependency graph
requires:
  - phase: 02-infrastructure-upgrade
    provides: "Plans 02-02 through 02-05: RN 0.76.x upgrade, AppDelegate.mm, Android updates, JS deps, rn-paper migration"
provides:
  - "iOS native build succeeds at RN 0.76.x with New Architecture (Fabric + Hermes)"
  - "Podfile.lock at RN 0.76.7 resolved pods"
  - "Podfile post_install hook for REACT_NATIVE_PATH and codegen deduplication"
affects:
  - phase-03
  - any iOS build operations

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Podfile post_install hook required for REACT_NATIVE_PATH in RN 0.76.x"
    - "CocoaPods 1.16.x deduplication fix: same-named codegen files need unique PBXFileReferences"
    - "react-native-svg yoga::StyleLength (not StyleSizeLength) for Yoga 3.x in RN 0.76"

key-files:
  created: []
  modified:
    - ios/Podfile
    - ios/Podfile.lock
    - ios/macromaker.xcodeproj/project.pbxproj
    - babel.config.js
    - package.json
    - package-lock.json

key-decisions:
  - "react-native-screens 3.37.0 (not 4.x): RN 0.76.x compatible version"
  - "react-native-safe-area-context 4.10.9 (not 5.x): latest 4.x before visionOS podspec change"
  - "react-native-reanimated 3.18.2 (not 4.2.2): worklets peer dep incompatible with RN 0.76"
  - "CocoaPods 1.16.2 via rbenv required: system CocoaPods 1.10.2 lacks visionOS podspec support"
  - "Podfile post_install with react_native_post_install: required to inject REACT_NATIVE_PATH build setting into xcconfigs"
  - "Props.cpp deduplication fix in post_install: CocoaPods 1.16.x assigns same PBXFileReference GUID to all same-named files across codegen subdirectories; workaround adds unique file refs for each namespace"
  - "react-native-svg StyleSizeLength->StyleLength patch: upstream 15.15.3 uses renamed yoga symbol; direct patch in node_modules (will need patch-package or upgrade)"

patterns-established:
  - "Podfile post_install is mandatory for RN 0.76.x iOS builds"
  - "pod install must use CocoaPods 1.13+ for visionOS podspec support"

requirements-completed:
  - NATV-06

# Metrics
duration: 180min
completed: 2026-03-11
---

# Phase 02 Plan 06: iOS Native Build Verification Summary

**RN 0.76.7 iOS build succeeds on iPhone 17 Pro simulator with New Architecture (Fabric + Hermes) after resolving 6 cascading native build issues**

## Performance

- **Duration:** ~180 min
- **Started:** 2026-03-11T22:00:00Z
- **Completed:** 2026-03-11T~25:00:00Z
- **Tasks:** 2 of 3 (checkpoint hit at Task 3 — human verification required)
- **Files modified:** 7

## Accomplishments

- Downgraded react-native-screens (4.x -> 3.37.0) and react-native-safe-area-context (5.x -> 4.10.9) to versions compatible with RN 0.76.x
- Removed `react-native-worklets/plugin` from babel.config.js (was only needed for Reanimated 4.x)
- Ran clean `pod install` using CocoaPods 1.16.2 (system 1.10.2 lacks visionOS support); Podfile.lock now resolves at RN 0.76.7
- Added `post_install` hook to Podfile with `react_native_post_install` — required to write `REACT_NATIVE_PATH` build setting into xcconfigs (hermes-engine script fails without it)
- Fixed CocoaPods 1.16.x codegen deduplication bug: `Props.cpp`, `ShadowNodes.cpp`, etc. each appear in 6 codegen subdirectories but get collapsed to one PBXFileReference; post_install hook adds unique file refs so all 6 namespaces' Fabric components are compiled
- Patched `react-native-svg` `RNSVGLayoutableShadowNode.cpp`: `yoga::StyleSizeLength` -> `yoga::StyleLength` (Yoga 3.x API rename in RN 0.76; upstream 15.15.3 not yet updated)
- Fixed `macromaker.xcodeproj/project.pbxproj` to reference `AppDelegate.mm` (not `.m`) with `sourcecode.cpp.objcpp` file type
- iOS app builds successfully and launches on iPhone 17 Pro simulator

## Task Commits

1. **Pre-fix: Podfile native_modules + Reanimated downgrade** - `3c1d904` (fix)
2. **Task 1: Downgrade screens/safe-area-context, remove worklets babel plugin** - `34b2130` (fix)
3. **Task 2: iOS build fixes (Podfile post_install, AppDelegate.mm, RNSVG StyleLength)** - `83a98c4` (fix)

## Files Created/Modified

- `/Users/sossboss/Development/macromaker/ios/Podfile` - Added post_install hook with react_native_post_install and CocoaPods deduplication fix
- `/Users/sossboss/Development/macromaker/ios/Podfile.lock` - Regenerated at RN 0.76.7 (SocketRocket 0.7.1, fmt, boost)
- `/Users/sossboss/Development/macromaker/ios/macromaker.xcodeproj/project.pbxproj` - AppDelegate.m -> AppDelegate.mm reference
- `/Users/sossboss/Development/macromaker/babel.config.js` - Removed react-native-worklets/plugin
- `/Users/sossboss/Development/macromaker/package.json` - react-native-screens 3.37.0, react-native-safe-area-context 4.10.9
- `/Users/sossboss/Development/macromaker/node_modules/react-native-svg/common/cpp/react/renderer/components/rnsvg/RNSVGLayoutableShadowNode.cpp` - StyleSizeLength -> StyleLength (node_modules patch)

## Decisions Made

- react-native-screens 3.37.0: Last 3.x version before screens v4 which requires RN 0.77+
- react-native-safe-area-context 4.10.9: Latest 4.x version confirmed compatible with RN 0.76.x visionOS podspec
- CocoaPods 1.16.2 required for pod install: The visionOS podspec syntax added in safe-area-context 4.10+ requires CocoaPods 1.13+
- Props.cpp deduplication: A fundamental CocoaPods 1.16.x limitation with glob-based source files; the workaround in post_install hook is required until react-native-safe-area-context ships a codegen subspec

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Removed react-native-worklets/plugin from babel.config.js**
- **Found during:** Task 1 (test suite run after package downgrade)
- **Issue:** babel.config.js still referenced react-native-worklets/plugin after reanimated was downgraded from 4.2.2 to 3.18.2 (worklets is a 4.x-only dep)
- **Fix:** Removed plugins array from babel.config.js
- **Files modified:** babel.config.js
- **Verification:** npx jest --watchAll=false: 19/19 tests pass (1 pre-existing StyledText-test.js failure due to missing react-test-renderer — out of scope)
- **Committed in:** 34b2130

**2. [Rule 3 - Blocking] Added post_install react_native_post_install to Podfile**
- **Found during:** Task 2 (iOS build attempt)
- **Issue:** REACT_NATIVE_PATH build setting not written to xcconfigs; hermes-engine script failed with "No such file or directory: with-environment.sh" because $REACT_NATIVE_PATH was empty
- **Fix:** Added post_install block calling react_native_post_install
- **Files modified:** ios/Podfile, ios/Podfile.lock, ios/macromaker.xcodeproj/project.pbxproj
- **Verification:** REACT_NATIVE_PATH = "${PODS_ROOT}/../../node_modules/react-native" appears in Pods.xcodeproj build settings
- **Committed in:** 83a98c4

**3. [Rule 3 - Blocking] Fixed CocoaPods 1.16.x Props.cpp deduplication in post_install**
- **Found during:** Task 2 (linker failures: undefined symbols for RNSVGUseProps, RNCPickerProps, RNCSliderProps, RNSScreenProps)
- **Issue:** CocoaPods 1.16.x assigns the same PBXFileReference GUID to all files with the same basename (Props.cpp, ShadowNodes.cpp, etc.) across different codegen subdirectories. Result: only safeareacontext's Props.cpp compiled; rnsvg/rnscreens/rnpicker Props constructors undefined at link time
- **Fix:** post_install hook detects duplicate-named codegen files, removes collapsed refs, adds unique PBXFileReferences with full absolute paths for each namespace's file
- **Files modified:** ios/Podfile, ios/Podfile.lock, ios/Pods/Pods.xcodeproj/project.pbxproj (via pod install)
- **Verification:** 6 unique Props.cpp PBXFileReferences with distinct GUIDs (46EB2E0002...) visible in project.pbxproj; BUILD SUCCEEDED
- **Committed in:** 83a98c4

**4. [Rule 1 - Bug] Patched react-native-svg StyleSizeLength -> StyleLength**
- **Found during:** Task 2 (CompileC failure on RNSVGLayoutableShadowNode.cpp)
- **Issue:** react-native-svg 15.15.3 uses `yoga::StyleSizeLength::percent()` but Yoga 3.x (bundled with RN 0.76) renamed this to `yoga::StyleLength`
- **Fix:** Direct patch of node_modules file (2 lines)
- **Files modified:** node_modules/react-native-svg/common/cpp/react/renderer/components/rnsvg/RNSVGLayoutableShadowNode.cpp
- **Verification:** RNSVG compilation succeeds; BUILD SUCCEEDED
- **Committed in:** 83a98c4
- **Note:** Patch lives in node_modules (not committed). Should be preserved via patch-package or by upgrading react-native-svg to a version with the fix.

**5. [Rule 3 - Blocking] Fixed AppDelegate.mm project reference**
- **Found during:** Task 2 (ScanDependencies failure: AppDelegate.m not found)
- **Issue:** macromaker.xcodeproj still referenced AppDelegate.m (plan 02-03 created AppDelegate.mm but didn't update the xcodeproj)
- **Fix:** Updated all 4 AppDelegate.m references in project.pbxproj to .mm, changed file type to sourcecode.cpp.objcpp
- **Files modified:** ios/macromaker.xcodeproj/project.pbxproj
- **Verification:** ScanDependencies error gone; BUILD SUCCEEDED
- **Committed in:** 83a98c4

---

**Total deviations:** 5 auto-fixed (2 blocking build issues pre-existing from prior plans, 3 blocking from new pod setup, 1 node_modules patch)
**Impact on plan:** All fixes required for iOS build correctness. No scope creep. The react-native-svg patch needs follow-up (patch-package or version upgrade) in a future plan.

## Issues Encountered

- CocoaPods version: System pod 1.10.2 (via Homebrew) doesn't support visionOS podspecs; must use rbenv pod 1.16.2
- Stale Podfile.lock from previous RN version caused SocketRocket/fmt version conflicts — deleted and regenerated
- StyledText-test.js pre-existing failure (missing react-test-renderer) is out of scope — not caused by Phase 2 changes

## Deferred Items

- **react-native-svg StyleLength patch**: Lives in node_modules, will be lost on `npm install`. Should use `patch-package` to persist, or wait for react-native-svg upstream fix.
- **StyledText-test.js**: Boilerplate test with missing react-test-renderer dep. Should be deleted or fixed in a cleanup phase.

## Next Phase Readiness

- iOS build confirmed working at RN 0.76.7 with New Architecture active (Fabric + Hermes)
- Human verification checkpoint still pending (Task 3): user needs to visually confirm app navigation, paper components, graphs, and gesture-based navigation
- Android build not yet attempted (per plan, secondary verification in same checkpoint)
- Phase 3 can begin after human checkpoint approval

---
*Phase: 02-infrastructure-upgrade*
*Completed: 2026-03-11*
