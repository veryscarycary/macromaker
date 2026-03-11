---
phase: 02-infrastructure-upgrade
plan: "02"
subsystem: infra
tags: [ios, objc, rctappdelegate, podfile, react-native, new-architecture]

# Dependency graph
requires:
  - phase: 02-infrastructure-upgrade
    provides: Research on RN 0.76 upgrade requirements and iOS native infra changes
provides:
  - AppDelegate.mm with RCTAppDelegate inheritance and bootsplash customizeRootView hook
  - AppDelegate.h declaring RCTAppDelegate base class
  - Podfile targeting iOS 15.1 without hermes_enabled
  - Info.plist UIAppFonts trimmed to 3 used fonts
affects:
  - 02-infrastructure-upgrade (pod install, build steps in subsequent plans)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "RCTAppDelegate pattern: AppDelegate inherits RCTAppDelegate, sets moduleName and initialProps, delegates lifecycle to super"
    - "Obj-C++ extension (.mm): required for New Architecture C++ interop; replaces old .m file"
    - "customizeRootView hook: override on RCTAppDelegate subclass to initialize react-native-bootsplash"

key-files:
  created:
    - ios/macromaker/AppDelegate.mm
  modified:
    - ios/macromaker/AppDelegate.h
    - ios/Podfile
    - ios/macromaker/Info.plist

key-decisions:
  - "AppDelegate.mm (.mm extension): Obj-C++ required for New Architecture C++ headers; old .m file deleted"
  - "RCTLinkingManager handlers omitted: app does not use deep links; RCTAppDelegate handles standard lifecycle internally"
  - "hermes_enabled removed from Podfile: no-op since RN 0.73, its presence signals outdated config"
  - "UIAppFonts trimmed to 3: only Ionicons, Feather, FontAwesome are imported in codebase — removes 12 unused font file declarations"

patterns-established:
  - "RCTAppDelegate inheritance: the canonical AppDelegate pattern for RN 0.76+ New Architecture"

requirements-completed: [NATV-01, NATV-02]

# Metrics
duration: 2min
completed: 2026-03-11
---

# Phase 02 Plan 02: iOS AppDelegate and Native Config Summary

**RCTAppDelegate-based AppDelegate.mm with bootsplash hook, Podfile at iOS 15.1, Info.plist trimmed to 3 fonts**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-11T06:33:43Z
- **Completed:** 2026-03-11T06:35:12Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Replaced old UIResponder-based AppDelegate.m with RCTAppDelegate-based AppDelegate.mm for New Architecture compatibility
- Updated Podfile from iOS 13.4 to 15.1 and removed the no-op hermes_enabled flag
- Trimmed Info.plist UIAppFonts from 15 RNVI families to the 3 actually used (Ionicons, Feather, FontAwesome)

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite AppDelegate.h and rename AppDelegate.m to AppDelegate.mm** - `919188d` (feat)
2. **Task 2: Update Podfile to iOS 15.1 and trim Info.plist UIAppFonts** - `92ab1af` (feat)

**Plan metadata:** (see final docs commit)

## Files Created/Modified

- `ios/macromaker/AppDelegate.mm` - New Obj-C++ delegate; inherits RCTAppDelegate, sets moduleName/initialProps, has bundleURL method and customizeRootView bootsplash hook
- `ios/macromaker/AppDelegate.h` - Interface declaration: `@interface AppDelegate : RCTAppDelegate` — no UIWindow property, no RCTBridgeDelegate protocol
- `ios/Podfile` - iOS 15.1 minimum, hermes_enabled flag removed
- `ios/macromaker/Info.plist` - UIAppFonts reduced from 15 entries to 3

## Decisions Made

- Used .mm extension (Obj-C++) instead of .m: required for New Architecture C++ interop headers
- Omitted RCTLinkingManager and URL continuation handlers: app has no deep links; RCTAppDelegate handles standard lifecycle
- Removed hermes_enabled: it was a no-op since RN 0.73 and its presence signals outdated configuration to any tooling that reads the Podfile
- Trimmed font list to 3: Ionicons, Feather, FontAwesome are the only RNVI icon families imported in the codebase; unused font file declarations add no value and increase app bundle size

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- iOS native files are in RN 0.76 template state
- AppDelegate.mm is ready for New Architecture
- `pod install` must be run before any iOS build (covered in Plan 02-06 build verification checkpoint)
- No build attempted in this plan — build verification happens at the checkpoint in Plan 02-06

---
*Phase: 02-infrastructure-upgrade*
*Completed: 2026-03-11*

## Self-Check: PASSED

All created/modified files confirmed present. Both task commits verified in git log.
