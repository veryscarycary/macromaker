# Dependency Matrix

**Phase 1 audit complete:** 2026-03-11
**Locked for:** Phase 2 and Phase 3 execution

> This is the single source of truth for target versions. Phase 2 and Phase 3 cannot begin without this document. Every row has a confirmed New Architecture compatibility verdict and a locked target version.

---

## Core Runtime

| Library | Current | Target | New Arch | Phase | Action | Notes |
|---------|---------|--------|----------|-------|--------|-------|
| react-native | 0.73.6 | 0.84.1 | YES | 3 | Two-hop upgrade | 0.73→0.76 in Phase 2; 0.76→0.84.1 in Phase 3 |
| react | 18.2.0 | 18.3.x | YES | 3 | Matches RN target | React version pinned to whatever react-native 0.84.1 requires |

---

## Splash / Boot

| Library | Current | Target | New Arch | Phase | Action | Notes |
|---------|---------|--------|----------|-------|--------|-------|
| react-native-splash-screen | 3.3.0 | REMOVED | NO | 1 | REPLACE NOW | Dead (4 years unmaintained); blocks New Architecture build; UILaunchStoryboardName=SplashScreen in Info.plist must change to BootSplash |
| react-native-bootsplash | — | 7.1.0 | YES | 1 | INSTALL NOW | Replacement for splash screen; Plan 01-02 installs and configures |

---

## Navigation

| Library | Current | Target | New Arch | Phase | Action | Notes |
|---------|---------|--------|----------|-------|--------|-------|
| @react-navigation/native | 6.1.18 | 7.1.33 | YES | 2 | Major upgrade | API changes; execute in Phase 2 |
| @react-navigation/stack | 6.4.1 | 7.8.4 | YES | 2 | Major upgrade | Option renames; Phase 2 |
| @react-navigation/bottom-tabs | 6.6.1 | 7.15.5 | YES | 2 | Major upgrade | Option renames; Phase 2 |
| react-native-screens | 3.23.0 | 4.24.0 | YES | 2 | Major upgrade | Required by Navigation v7 |
| react-native-safe-area-context | 4.14.0 | 5.7.0 | YES | 2 | Major upgrade | Required by Navigation v7 |

---

## Animation / Gesture

| Library | Current | Target | New Arch | Phase | Action | Notes |
|---------|---------|--------|----------|-------|--------|-------|
| react-native-reanimated | 3.6.0 | 4.2.2 | YES (mandatory) | 2 | Major upgrade | Breaking API changes; Babel plugin path changes from `react-native-reanimated/plugin` to `react-native-worklets/plugin`; Phase 2 |
| react-native-gesture-handler | 2.14.0 | 2.30.0 | YES | 2 | Minor upgrade | New Arch supported in 2.x; requires GestureHandlerRootView at app root (already present) |

---

## Graphics / Charts

| Library | Current | Target | New Arch | Phase | Action | Notes |
|---------|---------|--------|----------|-------|--------|-------|
| react-native-svg | 15.15.3 | 15.15.3 | YES | — | No change | Already latest; monitor for RCTImage observer API change before executing Phase 3 (RN 0.84) |
| react-native-chart-kit | 6.12.0 | REMOVED | NO | 1 | REPLACE NOW | Unmaintained (4+ years); confirmed not New Arch compatible (RN Directory); active use in `components/MacroGraph.tsx` line 3 — `import { PieChart } from 'react-native-chart-kit'` — PieChart renders carbs/protein/fat percentages; replacement: custom SVG PieChart using react-native-svg + D3 (Plan 01-02) |

---

## Storage

| Library | Current | Target | New Arch | Phase | Action | Notes |
|---------|---------|--------|----------|-------|--------|-------|
| @react-native-async-storage/async-storage | 1.24.0 | 3.0.1 | YES | 2 | Major upgrade | API changes; verify against `utils.ts` helpers (storeData, getStoredData, getAllStoredData, removeStoredData) before upgrading; meal key format `meals@MM/DD/YYYY` must be tested |

---

## UI Components

| Library | Current | Target | New Arch | Phase | Action | Notes |
|---------|---------|--------|----------|-------|--------|-------|
| @rneui/themed | 4.0.0-rc.8 | REPLACED | UNKNOWN | 2 | Evaluate migration to react-native-paper@5 | Not stable (RC release); known peer dep issues with React 18.3.x; used in BasicInfoScreen (Input), MacroInput (Input), AddFoodScreen (Input+SearchBar), DietHistoryList (ListItem); react-native-paper v5 equivalents: TextInput → TextInput, SearchBar → Searchbar, ListItem → List.Item |

---

## Form Controls

| Library | Current | Target | New Arch | Phase | Action | Notes |
|---------|---------|--------|----------|-------|--------|-------|
| @react-native-community/slider | 4.5.5 | 4.5.5 | YES | — | No change | Maintained; New Arch compatible; check actual installed version matches |
| @react-native-picker/picker | 2.9.0 | 2.9.0 | YES | — | No change | Maintained; New Arch compatible; check actual installed version matches |

---

## Icons

| Library | Current | Target | New Arch | Phase | Action | Notes |
|---------|---------|--------|----------|-------|--------|-------|
| react-native-vector-icons | 10.2.0 | 10.3.0 | YES | 2 | Minor upgrade | Info.plist lists all 15 RNVI fonts; trim to Ionicons.ttf, Feather.ttf, FontAwesome.ttf only during Phase 2 pod install |

---

## Pure JS (no native code — no action needed)

| Library | Current | Target | New Arch | Phase | Action | Notes |
|---------|---------|--------|----------|-------|--------|-------|
| d3 | 5.15.1 | 5.15.1 | N/A | — | No change | Pure JS; used in BarGraph, MealTimeGraph, TotalCaloriesGraph |
| d3-scale | 3.2.1 | 3.2.1 | N/A | — | No change | Pure JS |
| lodash | 4.17.21 | 4.17.21 | N/A | — | No change | Pure JS |
| dayjs | 1.11.13 | 1.11.13 | N/A | — | No change | Pure JS |
| uuid | 9.0.1 | 9.0.1 | N/A | — | No change | Pure JS; requires react-native-get-random-values shim |
| react-native-get-random-values | 1.11.0 | 1.11.0 | YES | — | No change | Small native shim for uuid; maintained |
| execa | 5.1.1 | REMOVED | N/A | 1 | Remove now | Process execution utility in production deps (unusual for mobile app); grep of all .ts/.tsx/.js/.jsx source files found zero imports — confirmed unused; remove from package.json in Plan 01-02 |

---

## Phase 2 Native Notes (document now, execute in Phase 2)

These changes are required before building against RN 0.76+. Do not execute until Phase 2.

- **SoLoader:** `android/app/src/main/java/com/carymeskell/macrotracker/MainApplication.java` has `SoLoader.init(this, false)` — must change to `SoLoader.init(this, new OpenSourceMergedSoMapping())` before building against RN 0.76+
- **iOS platform version:** Podfile currently `platform :ios, '13.4'` — must become `15.1` per RN 0.76 template requirements
- **Hermes:** Podfile has `hermes_enabled: false` — must be removed (Hermes is enabled by default in RN 0.73+; this flag is a no-op but signals confusion; RN 0.76 template does not include it)
- **UIAppFonts:** Info.plist lists all 15 RNVI fonts — trim to Ionicons.ttf, Feather.ttf, FontAwesome.ttf only during Phase 2 pod install run
- **UILaunchStoryboardName:** Currently `SplashScreen` — will be changed to `BootSplash` in Plan 01-02 as part of splash screen replacement

---

## Blockers Resolved This Phase

| Library | Status |
|---------|--------|
| react-native-splash-screen | Replaced with react-native-bootsplash@7.1.0 in Plan 01-02 |
| react-native-chart-kit | Replaced with custom SVG PieChart in MacroGraph.tsx in Plan 01-02 |
| execa | Removed from package.json (confirmed unused by source grep) in Plan 01-02 |

---

## Dependency Count Summary

| Category | Count | Action Required |
|----------|-------|-----------------|
| Core Runtime | 2 | Upgrade in Phase 2-3 |
| Splash/Boot | 2 | Replace in Phase 1 (Plan 01-02) |
| Navigation | 5 | Upgrade in Phase 2 |
| Animation/Gesture | 2 | Upgrade in Phase 2 |
| Graphics/Charts | 2 | Replace chart-kit in Phase 1 (Plan 01-02) |
| Storage | 1 | Upgrade in Phase 2 |
| UI Components | 1 | Evaluate/replace in Phase 2 |
| Form Controls | 2 | No change |
| Icons | 1 | Minor upgrade in Phase 2 |
| Pure JS | 7 | No change (1 remove: execa) |
| **Total** | **25** | **3 removals, 10 upgrades, 1 replace** |
