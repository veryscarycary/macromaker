# Roadmap: macromaker

## Overview

This milestone upgrades macromaker from React Native 0.73.6 to 0.84.1 and polishes the onboarding UX. The work is strictly sequenced: audit and replace dependency blockers first, then rewrite native infrastructure (iOS AppDelegate, Android MainApplication) and upgrade JS libraries as a coordinated unit, then complete the final version hop to 0.84.1 with full verification on both platforms, and finally deliver the onboarding UX improvements that make the first-launch experience feel intentional.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Dependency Audit** - Identify and replace incompatible dependencies before any version bump begins (completed 2026-03-11)
- [ ] **Phase 2: Infrastructure Upgrade** - Rewrite native layers and upgrade JS dependencies to New Architecture targets
- [ ] **Phase 3: RN 0.84.1 Final Upgrade** - Complete the version hop and verify all features on both platforms
- [ ] **Phase 4: Onboarding UX Polish** - Fix six identified UX gaps in the first-launch onboarding flow

## Phase Details

### Phase 1: Dependency Audit
**Goal**: All dependencies are confirmed New Architecture compatible and blocking libraries are replaced before touching RN version
**Depends on**: Nothing (first phase)
**Requirements**: DEPS-01, DEPS-02, DEPS-03
**Success Criteria** (what must be TRUE):
  1. Every npm dependency has a confirmed compatible version for New Architecture (Fabric/TurboModules)
  2. react-native-splash-screen is removed and react-native-bootsplash@7.1.0 installs without conflicts
  3. Target versions for all libraries are written down and locked before any RN version bump begins
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Audit all dependencies and produce DEPS-MATRIX.md
- [ ] 01-02-PLAN.md — Replace react-native-splash-screen with bootsplash and rewrite MacroGraph SVG pie

### Phase 2: Infrastructure Upgrade
**Goal**: App builds and launches on both iOS and Android with New Architecture enabled, all JS dependencies at target versions
**Depends on**: Phase 1
**Requirements**: NATV-01, NATV-02, NATV-03, NATV-04, NATV-05, NATV-06, JSDP-01, JSDP-02, JSDP-03, JSDP-04, JSDP-05, JSDP-06
**Success Criteria** (what must be TRUE):
  1. iOS app builds and launches at RN 0.76.x using the new AppDelegate.mm / RCTAppDelegate pattern
  2. Android app builds and launches at RN 0.76.x with correct SoLoader init and minSdk 24
  3. New Architecture is enabled (newArchEnabled=true) and no bridge-mode warnings appear at startup
  4. All existing animated and gesture interactions (graphs, navigation transitions) work correctly after Reanimated 4 migration
  5. React Navigation v7, AsyncStorage 3.x, and all updated libraries are installed with no peer dependency errors
**Plans**: 6 plans

Plans:
- [ ] 02-01-PLAN.md — Add removeStoredData unit tests (Wave 0 test scaffold)
- [ ] 02-02-PLAN.md — iOS native infra: AppDelegate.mm rewrite + Podfile iOS 15.1 + Info.plist font trim
- [ ] 02-03-PLAN.md — Android native infra: SoLoader OpenSourceMergedSoMapping + minSdk 24 + newArchEnabled
- [ ] 02-04-PLAN.md — RN 0.76 bump + all JS dependency upgrades + utils.ts callback fix + babel plugin
- [ ] 02-05-PLAN.md — Replace @rneui/themed with react-native-paper across 5 files + PaperProvider
- [ ] 02-06-PLAN.md — pod install, iOS build + launch, human verification checkpoint

### Phase 3: RN 0.84.1 Final Upgrade
**Goal**: App runs on React Native 0.84.1 on iOS and Android with all existing features working correctly
**Depends on**: Phase 2
**Requirements**: RNUP-01, RNUP-02, RNUP-03, RNUP-04, RNUP-05
**Success Criteria** (what must be TRUE):
  1. React Native version is 0.84.1 with matching React and Hermes versions in package.json
  2. App launches and runs on iOS simulator and a physical iOS device without crashes
  3. App launches and runs on Android emulator and a physical Android device without crashes
  4. All existing features work correctly: meal entry, meal editing/deletion, diet history, macro graphs, tab navigation, and onboarding modal trigger
**Plans**: TBD

### Phase 4: Onboarding UX Polish
**Goal**: First-launch onboarding feels intentional and guides the user through setup without friction
**Depends on**: Phase 3
**Requirements**: ONBR-01, ONBR-02, ONBR-03, ONBR-04, ONBR-05
**Success Criteria** (what must be TRUE):
  1. A progress step indicator (e.g., dots or step counter) is visible on all three onboarding screens showing which step the user is on
  2. The BasicInfo screen CTA reads "Next" or "Continue" — not "Calculate BMI"
  3. Opening the keyboard on BasicInfo does not hide any input fields (keyboard-aware layout in effect)
  4. All numeric input fields show unit context ("lbs", "ft", "in") in placeholder text or as inline suffix labels
  5. Numeric fields open with sensible non-zero defaults (e.g., weight 150, height 5'10") so the form does not feel broken on first view
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Dependency Audit | 2/2 | Complete    | 2026-03-11 |
| 2. Infrastructure Upgrade | 0/6 | Not started | - |
| 3. RN 0.84.1 Final Upgrade | 0/TBD | Not started | - |
| 4. Onboarding UX Polish | 0/TBD | Not started | - |
