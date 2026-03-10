# Requirements: macromaker

**Defined:** 2026-03-10
**Core Value:** A fast, offline-first macro tracker where adding a meal and seeing your day's intake takes under 10 seconds.

## v1 Requirements

Requirements for this milestone: upgrade to RN 0.84.1 + onboarding UX polish.

### Dependency Audit

- [ ] **DEPS-01**: All npm dependencies audited for New Architecture (Fabric/TurboModules) compatibility
- [ ] **DEPS-02**: `react-native-splash-screen` replaced with `react-native-bootsplash@7.1.0`
- [ ] **DEPS-03**: Target versions locked for all libraries before any RN version bump begins

### Native Infrastructure

- [ ] **NATV-01**: iOS AppDelegate.m fully rewritten to AppDelegate.mm inheriting from RCTAppDelegate
- [ ] **NATV-02**: iOS Podfile updated to platform iOS 15.1 using new RN 0.76 template
- [ ] **NATV-03**: Android MainApplication SoLoader init updated to OpenSourceMergedSoMapping
- [ ] **NATV-04**: Android build.gradle updated (minSdk 24, Kotlin 2.0, updated Gradle)
- [ ] **NATV-05**: New Architecture enabled (`newArchEnabled=true` in gradle.properties)
- [ ] **NATV-06**: App builds and launches on iOS and Android at RN 0.76.x

### JavaScript Dependencies

- [ ] **JSDP-01**: React Navigation upgraded to v7 bundle (@react-navigation/native, stack, bottom-tabs all v7)
- [ ] **JSDP-02**: react-native-screens upgraded to v4 and react-native-safe-area-context to v5 (required with Nav v7)
- [ ] **JSDP-03**: react-native-reanimated upgraded from 3.x to 4.x with react-native-worklets peer dependency
- [ ] **JSDP-04**: Reanimated Babel plugin updated from `react-native-reanimated/plugin` to `react-native-worklets/plugin`
- [ ] **JSDP-05**: @react-native-async-storage/async-storage upgraded from 1.x to 3.x with API compatibility verified
- [ ] **JSDP-06**: All existing animated/gesture code verified working after Reanimated 4 migration

### RN Version Upgrade

- [ ] **RNUP-01**: React Native upgraded to 0.84.1 with React and Hermes at matching versions
- [ ] **RNUP-02**: Node.js 22.11+ and Xcode 16.1+ confirmed as build environment
- [ ] **RNUP-03**: App runs on iOS simulator and physical device without crashes
- [ ] **RNUP-04**: App runs on Android emulator and physical device without crashes
- [ ] **RNUP-05**: All existing features (meal entry, history, graphs, tabs) work correctly on 0.84.1

### Onboarding UX

- [ ] **ONBR-01**: Progress step indicator visible on all 3 onboarding screens (Welcome, BasicInfo, MoreInfo)
- [ ] **ONBR-02**: CTA button on BasicInfo screen reads "Next" or "Continue" (not "Calculate BMI")
- [ ] **ONBR-03**: BasicInfoScreen uses KeyboardAvoidingView so inputs remain visible when keyboard is open
- [ ] **ONBR-04**: All numeric input fields show unit labels ("lbs", "ft", "in") in placeholder or suffix
- [ ] **ONBR-05**: Numeric input fields have sensible non-zero defaults (e.g., weight 150 lbs, height 5'10")

## v2 Requirements

Deferred to future milestone.

### History Views

- **HIST-01**: 7-day rolling average summary card in DietHistoryScreen (data layer `getAveragesFromDietDays` already exists)
- **HIST-02**: Trend arrow comparing this week's average to last week

### Notifications

- **NOTF-01**: Daily notification when calorie deficit reached
- **NOTF-02**: Daily notification when calorie surplus reached
- **NOTF-03**: Weekly macro imbalance notification

### Food Discovery

- **FOOD-01**: Food search via nutrition API
- **FOOD-02**: Barcode scanning for packaged foods

## Out of Scope

| Feature | Reason |
|---------|--------|
| Cloud sync / backend | Local-only architecture; no revenue model for infrastructure |
| Apple Health / HealthKit | Significant native work; not core to v1 |
| Social / sharing | Out of scope for MVP |
| React Navigation v7 advanced features | Upgrade for compatibility only; no new nav patterns needed |
| Macro % slider sum validation | Nice-to-have; defer until onboarding polish is shipped |
| Animated slide transitions in onboarding | Blocked until Reanimated 4 is stable; P2 polish |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DEPS-01 | Phase 1 | Pending |
| DEPS-02 | Phase 1 | Pending |
| DEPS-03 | Phase 1 | Pending |
| NATV-01 | Phase 2 | Pending |
| NATV-02 | Phase 2 | Pending |
| NATV-03 | Phase 2 | Pending |
| NATV-04 | Phase 2 | Pending |
| NATV-05 | Phase 2 | Pending |
| NATV-06 | Phase 2 | Pending |
| JSDP-01 | Phase 3 | Pending |
| JSDP-02 | Phase 3 | Pending |
| JSDP-03 | Phase 3 | Pending |
| JSDP-04 | Phase 3 | Pending |
| JSDP-05 | Phase 3 | Pending |
| JSDP-06 | Phase 3 | Pending |
| RNUP-01 | Phase 4 | Pending |
| RNUP-02 | Phase 4 | Pending |
| RNUP-03 | Phase 4 | Pending |
| RNUP-04 | Phase 4 | Pending |
| RNUP-05 | Phase 4 | Pending |
| ONBR-01 | Phase 5 | Pending |
| ONBR-02 | Phase 5 | Pending |
| ONBR-03 | Phase 5 | Pending |
| ONBR-04 | Phase 5 | Pending |
| ONBR-05 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-10*
*Last updated: 2026-03-10 after initial definition*
