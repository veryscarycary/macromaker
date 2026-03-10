# Stack Research

**Domain:** React Native bare app upgrade (0.73.6 → 0.84.x)
**Researched:** 2026-03-10
**Confidence:** MEDIUM-HIGH (npm versions confirmed via search; compatibility details verified via official docs and swmansion docs)

---

## Current vs Target Versions

| Package | Current | Target | Notes |
|---------|---------|--------|-------|
| react-native | 0.73.6 | 0.84.1 | 11 minor versions; New Architecture mandatory from 0.82 |
| react | 18.2.0 | 18.3.x | React 19 shipped with RN 0.78+; 0.84 ships with React 18.3.x |
| @react-navigation/native | 6.1.18 | 7.1.33 | Major version change; breaking API changes |
| @react-navigation/stack | 6.4.1 | 7.8.4 | Major version change; option renames |
| @react-navigation/bottom-tabs | 6.6.1 | 7.15.5 | Major version change; option renames |
| react-native-gesture-handler | 2.14.0 | 2.30.0 | Minor bump; no major breaking changes |
| react-native-reanimated | 3.6.0 | 4.2.2 | Major version change; New Arch required; new dependency |
| react-native-svg | 15.15.3 | 15.15.3 | Already latest; potential 0.84 RCTImage observer issue |
| react-native-vector-icons | 10.2.0 | 10.3.0 | Minor bump |
| @rneui/themed | 4.0.0-rc.8 | 4.0.0-rc.8 | Unchanged; v5 beta exists but not stable |
| @react-native-async-storage/async-storage | 1.24.0 | 3.0.1 | Major version change; breaking API changes |
| react-native-safe-area-context | 4.14.0 | 5.7.0 | Major version change; required for RN Navigation v7 |
| react-native-screens | 3.23.0 | 4.24.0 | Major version change; required for react-navigation v7 |
| react-native-splash-screen | 3.3.0 | REPLACE | Dead library (4 years no update); replace with react-native-bootsplash |

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| react-native | 0.84.1 | Mobile framework | Latest stable (Feb 2026); Hermes V1 default; 8x faster iOS builds |
| react | 18.3.x | UI library | Bundled with RN 0.84; React 19 ships with 0.78+ (optional upgrade path) |
| TypeScript | 5.7.3+ | Language | Already in use; no change needed |
| Node.js | 22.11+ | Build tooling | **Required minimum** for RN 0.84; was 18+ for RN 0.73 |

### Navigation

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| @react-navigation/native | 7.1.33 | Navigation core | v7 is stable, actively maintained; v6 EOL |
| @react-navigation/stack | 7.8.4 | JS-based stack navigator | App uses modal-first stack pattern; stack navigator retained |
| @react-navigation/bottom-tabs | 7.15.5 | Tab navigator | Current navigator; v7 API is a superset of v6 |
| react-native-screens | 4.24.0 | Native screen management | **Required by react-navigation v7**; v3 is incompatible |
| react-native-safe-area-context | 5.7.0 | Safe area insets | Required peer dep; v4 incompatible with v7 stack |

### Gesture and Animation

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| react-native-gesture-handler | 2.30.0 | Gesture handling | Required by react-navigation; minor bump from 2.14 |
| react-native-reanimated | 4.2.2 | Animations | v4 supports RN 0.80–0.84; New Arch only |
| react-native-worklets | latest | Worklet runtime | **New required dep for Reanimated 4**; worklets extracted to separate package |

### Graphics

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| react-native-svg | 15.15.3 | SVG rendering for D3 graphs | Latest in 15.x line; potential 0.84 RCTImage patch may be needed |

### UI Components

| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| react-native-vector-icons | 10.3.0 | Icons (Ionicons, Feather, FontAwesome) | Minor bump from 10.2; font setup unchanged |
| @rneui/themed | 4.0.0-rc.8 | Input, SearchBar, ListItem | No stable v4 yet; v5 beta exists but untested; stay on rc.8 |

### Native Modules

| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| @react-native-async-storage/async-storage | 3.0.1 | Local data persistence (all meals, user info) | **Major version bump**; breaking API changes from 1.x |
| @react-native-picker/picker | 2.9.0+ | Native picker | Check for patch update; no major change expected |
| @react-native-community/slider | 4.5.5+ | Native slider | Check for patch update; no major change expected |
| react-native-bootsplash | 7.1.0 | Splash screen | **Replaces react-native-splash-screen** (dead library) |
| react-native-get-random-values | 1.11.0+ | Crypto random (dep of uuid) | Minor update likely available |

### Unchanged Dependencies (no action needed)

| Library | Version | Notes |
|---------|---------|-------|
| d3 | 5.15.1 | Pure JS; no native code; no change needed |
| d3-scale | 3.2.1 | Pure JS; no change needed |
| lodash | 4.17.21 | Pure JS; no change needed |
| dayjs | 1.11.13 | Pure JS; no change needed |
| uuid | 9.0.1 | Pure JS; no change needed |

---

## Upgrade Path

The jump from 0.73.6 to 0.84.1 crosses a critical architectural boundary. **React Native 0.82 permanently removed the Legacy (Bridge) Architecture** — it cannot be disabled from 0.82 onward. The upgrade is not a simple dependency version bump; it requires native code changes, Babel plugin updates, and API migrations across multiple libraries.

### Recommended Sequence

**Phase 1: Native infrastructure (0.73.6 → 0.82 milestone)**

The native project files (AppDelegate, MainApplication, build.gradle, Podfile) have changed significantly across these versions. Use the [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) to diff 0.73.6 → 0.84.1 and apply changes manually. Key native changes:

- iOS AppDelegate converted to Swift template in 0.77
- Android MainApplication moved to Kotlin; Java templates removed by 0.80
- `newArchEnabled=true` in gradle.properties (mandatory from 0.82; setting it earlier is safe)
- `RCT_NEW_ARCH_ENABLED=1` in Podfile (mandatory from 0.82; opt-in safe earlier)
- Node.js minimum bumped to 22.11 (required for 0.84)
- iOS minimum deployment target: 15.1 (bumped from 12+ at 0.76)
- Android minSdkVersion: 24 / API 24 Android 7.0 (bumped at 0.75/0.76)

**Phase 2: JavaScript dependencies**

Upgrade navigation stack together (all v7 packages must move as a unit):
```
@react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
react-native-screens react-native-safe-area-context
```

Upgrade animation stack together:
```
react-native-reanimated react-native-worklets
```

Upgrade storage:
```
@react-native-async-storage/async-storage (1.24.0 → 3.0.1)
```

Replace splash screen:
```
remove react-native-splash-screen
add react-native-bootsplash
```

**Phase 3: Code migration**

Apply breaking API changes (see sections below). Run iOS pod install and Android Gradle sync after each native dep change.

---

## Breaking Changes Per Library

### React Native 0.73.6 → 0.84.1

| Version | Breaking Change | Action Required |
|---------|----------------|-----------------|
| 0.75/0.76 | minSdkVersion bumped to API 24 | Update android/build.gradle |
| 0.76 | iOS minimum target bumped to 15.1 | Update ios/Podfile |
| 0.76 | New Architecture enabled by default | Enable in native config |
| 0.77 | iOS template switched to Swift AppDelegate | Native template diff and apply |
| 0.77 | `console.log` streaming removed from Metro | Use `--client-logs` flag to restore (0.78 opt-in) |
| 0.78 | PropTypes removed | No usage detected in this codebase |
| 0.80 | Android template Kotlin-only | Native template diff and apply |
| 0.81 | `SafeAreaView` from RN deprecated | Already using `react-native-safe-area-context`; no action |
| 0.81 | Node.js minimum raised to 20.19.4 | Upgrade Node (will need 22.11 for 0.84) |
| 0.81 | Xcode 16.1 minimum | Upgrade Xcode |
| 0.81 | Android 16 / edge-to-edge display | Handle via `react-native-safe-area-context` |
| 0.82 | Legacy Architecture permanently removed | All deps must be New Arch compatible |
| 0.84 | Node.js minimum raised to 22.11 | Upgrade Node |
| 0.84 | Hermes V1 default | No action needed; already using Hermes |
| 0.84 | RCTImage observer API changed | May require react-native-svg patch; monitor |
| 0.84 | `BridgeDevSupportManager` removed (Android) | Only matters if directly using it (unlikely) |

### React Navigation 6 → 7

| Breaking Change | Old API | New API |
|----------------|---------|---------|
| `navigate()` no longer reaches nested screens | `navigate('ChildScreen')` | `navigate('ParentScreen', { screen: 'ChildScreen' })` |
| Back to existing screen | `navigate('Screen')` | `popTo('Screen')` |
| `headerBackTitleVisible` removed | `headerBackTitleVisible: false` | `headerBackButtonDisplayMode: 'minimal'` |
| `animationEnabled: false` removed | `animationEnabled: false` | `animation: 'none'` |
| `sceneContainerStyle` → `sceneStyle` | `sceneContainerStyle` | `sceneStyle` |
| `dangerouslyGetParent()` removed | `navigation.dangerouslyGetParent()` | `navigation.getParent()` |
| Custom theme requires `fonts` | no fonts | add `fonts: DefaultTheme.fonts` |
| All packages use ESM exports | internal imports worked | only use public API surface |
| `react-native-screens` v4 required | v3 | v4 |

### react-native-reanimated 3 → 4

| Breaking Change | Old | New |
|----------------|-----|-----|
| New Arch required | Optional | Mandatory (hard requirement) |
| New required dependency | none | `react-native-worklets` |
| Babel plugin | `react-native-reanimated/plugin` | `react-native-worklets/plugin` in babel.config.js |
| `runOnJS` | `runOnJS(fn)(args)` | `scheduleOnRN(fn, args)` |
| `runOnUI` | `runOnUI(fn)(args)` | `scheduleOnUI(fn, args)` |
| `executeOnUIRuntimeSync` | old | `runOnUISync` |
| `withSpring` duration | actual ms | perceptual ms (multiply by 1.5 for actual) |
| `useAnimatedGestureHandler` | supported | removed; use Gesture Handler 2 Gesture API |
| `useWorkletCallback` | supported | use `useCallback` + `'worklet';` directive |
| React Native compatibility | RN 0.80–0.84 supported | v4.2.2 supports RN 0.80–0.84 only |

**Critical:** If using `useAnimatedGestureHandler` anywhere (likely via gesture-based navigation), must migrate to Gesture Handler 2's `Gesture` API.

### @react-native-async-storage/async-storage 1.x → 3.x

The major version bump (1.24.0 → 3.0.1) is a breaking change. Verify against official changelog. The public API (`getItem`, `setItem`, `removeItem`, `multiGet`, etc.) is expected to be stable, but check for any configuration or initialization changes. The current codebase wraps all access through `utils.ts` helper functions (`storeData`, `getStoredData`, `removeStoredData`), which limits blast radius — only those helpers need to be verified.

**Action:** Read the AsyncStorage 3.0 changelog before upgrading. The storage API surface in this app is thin and centralized.

### react-native-splash-screen (dead library) → react-native-bootsplash

`react-native-splash-screen` (crazycodeboy) has not been updated in 4 years and has known issues with RN 0.73+. It will not work with the New Architecture.

**Action:** Remove `react-native-splash-screen`; install `react-native-bootsplash@7.1.0`. The APIs differ — bootsplash provides a CLI to generate assets and a `hide()` method. Native integration in AppDelegate and MainActivity also differs.

---

## Installation Commands

```bash
# Core React Native (handled via Upgrade Helper native diffs + package.json update)
npm install react-native@0.84.1

# Navigation (upgrade as a unit)
npm install @react-navigation/native@7.1.33 \
  @react-navigation/stack@7.8.4 \
  @react-navigation/bottom-tabs@7.15.5 \
  react-native-screens@4.24.0 \
  react-native-safe-area-context@5.7.0

# Animation (upgrade as a unit; new worklets dep)
npm install react-native-reanimated@4.2.2 react-native-worklets

# Gesture handling
npm install react-native-gesture-handler@2.30.0

# SVG
npm install react-native-svg@15.15.3

# Icons
npm install react-native-vector-icons@10.3.0

# Storage (major version bump)
npm install @react-native-async-storage/async-storage@3.0.1

# Splash screen replacement
npm uninstall react-native-splash-screen
npm install react-native-bootsplash@7.1.0

# After all native dep changes
cd ios && pod install && cd ..
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| @react-navigation/stack v7 | @react-navigation/native-stack v7 | Native stack has better perf but less JS-level control; modal-first pattern is easier with JS stack |
| react-native-reanimated v4 | Stay on v3 | If any dep or third-party lib is still New Arch incompatible; v3 supports New Arch but also legacy |
| react-native-bootsplash | Build native splash manually | For maximum control with zero deps; requires more native work per platform |
| @rneui/themed rc.8 | Switch to another UI lib | If RNEUI v5 stable releases during the upgrade window; otherwise not worth the churn |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| react-native-splash-screen (crazycodeboy) | Dead; 4 years no update; breaks with New Architecture | react-native-bootsplash@7.1.0 |
| Reanimated 3 with RN 0.84 | v3.x supports RN 0.78–0.81 only (not 0.84) | Reanimated 4.2.2 |
| react-navigation v6 with v7 deps | Screen native APIs incompatible across major versions | Must upgrade all navigation deps as a unit |
| Setting `newArchEnabled=false` after 0.82 | Flag is silently ignored; behavior undefined | Embrace New Architecture — it is the only option from 0.82+ |
| Jumping directly 0.73 → 0.84 in one step | Risks missing critical native file changes across 11 minor versions | Use Upgrade Helper diff and consider intermediate waypoints at 0.76 and 0.82 |
| `useAnimatedGestureHandler` (Reanimated) | Removed in Reanimated 4 | Use Gesture Handler 2's `Gesture` API (`Gesture.Pan()`, etc.) |

---

## Version Compatibility Matrix

| react-native | react-native-reanimated | react-native-worklets | react-native-screens | react-navigation |
|-------------|------------------------|----------------------|---------------------|-----------------|
| 0.73.6 | 3.6.0 (old arch OK) | none | 3.x | v6 |
| 0.80–0.81 | 4.0.x–4.1.x | required | 4.x | v7 |
| 0.82–0.84 | 4.2.x | required | 4.x | v7 |

| react-native | react-native-gesture-handler | react-native-safe-area-context |
|-------------|------------------------------|-------------------------------|
| 0.73.x | 2.14.x | 4.x |
| 0.84.x | 2.30.0 | 5.7.0 |

**Key constraint:** Reanimated 4.2.2 supports **only RN 0.80–0.84**. There is no version of Reanimated 4 that supports RN 0.73–0.79. The upgrade must target RN 0.80 minimum to use Reanimated 4; RN 0.84 is preferred (latest stable).

---

## Platform Requirement Changes

| Requirement | RN 0.73.6 | RN 0.84.1 |
|-------------|-----------|-----------|
| Node.js minimum | 18+ | 22.11+ |
| Xcode minimum | 14.x | 16.1+ |
| iOS deployment target | 12.4+ | 15.1+ |
| Android minSdkVersion | 21 | 24 (API 24, Android 7.0) |
| Android target SDK | 33 | 35+ |
| New Architecture | Optional | Mandatory |
| JavaScript engine | Hermes (default) | Hermes V1 (default) |

---

## Sources

- [React Native 0.84 Release Blog](https://reactnative.dev/blog/2026/02/11/react-native-0.84) — Hermes V1, breaking changes, platform requirements (HIGH confidence)
- [React Native Versions](https://reactnative.dev/versions) — Confirmed 0.84 latest stable, 0.83 active (HIGH confidence)
- [React Navigation Upgrading from 6.x](https://reactnavigation.org/docs/upgrading-from-6.x/) — Navigation breaking changes (HIGH confidence)
- [Reanimated Compatibility Table](https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/) — RN version matrix (HIGH confidence)
- [Reanimated 3→4 Migration Guide](https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/) — Breaking changes, Babel plugin change (HIGH confidence)
- npm search results — @react-navigation/native 7.1.33, @react-navigation/stack 7.8.4, @react-navigation/bottom-tabs 7.15.5, react-native-screens 4.24.0, react-native-safe-area-context 5.7.0, react-native-gesture-handler 2.30.0, react-native-vector-icons 10.3.0, @react-native-async-storage/async-storage 3.0.1, react-native-bootsplash 7.1.0 (MEDIUM confidence — search-reported, not directly fetched from npm registry)
- [React Native 0.82 New Architecture Era](https://reactnative.dev/blog/2025/10/08/react-native-0.82) — New Arch mandatory from 0.82 (HIGH confidence)
- WebSearch — react-native-svg 15.15.3 potential 0.84 RCTImage issue (LOW confidence — unverified; monitor before shipping)

---

*Stack research for: React Native bare app upgrade 0.73.6 → 0.84.x*
*Researched: 2026-03-10*
