# Phase 2: Infrastructure Upgrade - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Rewrite native layers (iOS AppDelegate.mm using RCTAppDelegate, Android MainApplication with updated SoLoader init), enable New Architecture (`newArchEnabled=true`), and upgrade all JS dependencies to target versions from DEPS-MATRIX.md. App must build and launch on both iOS and Android at RN 0.76.x with no bridge-mode warnings. This phase does NOT upgrade to 0.84.1 — that's Phase 3.

</domain>

<decisions>
## Implementation Decisions

### @rneui/themed replacement
- **Do it in Phase 2** — full replacement, not a minimal patch
- Replace with `react-native-paper@5` (stable, actively maintained, Material Design 3)
- **Functional parity only** — swap Input → TextInput, SearchBar → Searchbar, ListItem → List.Item with matching behavior; no redesign, keep all existing styles/logic
- Affected screens: BasicInfoScreen, MoreInfoScreen, AddFoodScreen, DietHistoryList
- **PaperProvider goes in App.tsx root** alongside GestureHandlerRootView and SafeAreaProvider
- **Theme respects device color scheme** — thread existing `useColorScheme()` result into PaperProvider so paper components follow the app's dark/light mode (existing Colors.ts constants apply)

### Native infrastructure
- iOS: Rewrite AppDelegate.mm inheriting from RCTAppDelegate (per NATV-01)
- iOS: Update Podfile to platform iOS 15.1 using RN 0.76 template (per NATV-02)
- Android: Update MainApplication SoLoader init to OpenSourceMergedSoMapping (per NATV-03)
- Android: Update build.gradle — minSdk 24, Kotlin 2.0, updated Gradle (per NATV-04)
- Enable `newArchEnabled=true` in gradle.properties (per NATV-05)
- Note: Bootsplash customizeRootView hook currently uses Obj-C; replace with Swift in AppDelegate.mm rewrite

### JS dependency upgrades (from DEPS-MATRIX.md)
- React Navigation: v6 → v7 bundle (@react-navigation/native, stack, bottom-tabs — all to v7)
- react-native-screens: 3.x → 4.24.0 (required by Nav v7)
- react-native-safe-area-context: 4.x → 5.7.0 (required by Nav v7)
- react-native-reanimated: 3.6.0 → 4.2.2 + react-native-worklets peer dep
- Babel plugin path: `react-native-reanimated/plugin` → `react-native-worklets/plugin`
- react-native-gesture-handler: 2.14.0 → 2.30.0
- @react-native-async-storage/async-storage: 1.24.0 → 3.0.1 (verify API against utils.ts before upgrading)
- react-native-vector-icons: 10.2.0 → 10.3.0 (trim Info.plist to Ionicons.ttf, Feather.ttf, FontAwesome.ttf only)

### Claude's Discretion
- Plan breakdown strategy (one coordinated plan vs. staged plans)
- React Navigation v7 API migration depth (minimum compat vs. adopt new patterns)
- Rollback/verification approach
- Exact react-native-paper theme configuration using existing Colors.ts

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `App.tsx` — existing provider chain: `GestureHandlerRootView` → `SafeAreaProvider` → `HistoryProvider`; PaperProvider slots in here
- `useColorScheme()` — already used in `App.tsx` and passed to NavigationContainer; thread same value into PaperProvider
- `constants/Colors.ts` — existing dark/light color definitions; inform react-native-paper theme customization
- `context/createDataContext.tsx` — factory pattern unaffected by any of these upgrades

### Screens Affected by @rneui/themed Removal
- `screens/InfoModal/BasicInfoScreen.tsx` — uses `Input` from @rneui/themed
- `screens/InfoModal/MoreInfoScreen.tsx` — uses `Input` from @rneui/themed
- `screens/AddFood/AddFoodScreen.tsx` — uses `Input` + `SearchBar` from @rneui/themed
- `components/MacroInput/` — uses `Input` from @rneui/themed
- `screens/Diet/` (DietHistoryList area) — uses `ListItem` from @rneui/themed

### Established Patterns
- `utils.ts` helpers (`storeData`, `getStoredData`, `getAllStoredData`, `removeStoredData`) — blast radius for AsyncStorage 3.x upgrade; verify each function's API compatibility before upgrading
- Meal key format `meals@MM/DD/YYYY` — must survive the AsyncStorage upgrade unchanged
- Custom graph components (BarGraph, MealTimeGraph, TotalCaloriesGraph) use react-native-svg + D3 directly — unaffected by any of these upgrades
- `babel.config.js` — currently references `react-native-reanimated/plugin`; must change to `react-native-worklets/plugin`

### Integration Points
- `ios/macromaker/AppDelegate.mm` — full rewrite needed; currently uses Obj-C customizeRootView hook for bootsplash; migrate to Swift pattern
- `ios/Podfile` — update platform target to iOS 15.1
- `android/gradle.properties` — set `newArchEnabled=true`
- `android/app/build.gradle` — minSdk 24, Kotlin 2.0
- `android/app/src/main/java/.../MainApplication` — SoLoader init change

### Known Issue to Monitor
- `react-native-svg@15.15.3` — Android build currently broken (uses BaseReactPackage not in RN 0.73 Android API); resolves automatically when RN 0.76 is installed; do not downgrade

</code_context>

<specifics>
## Specific Ideas

- No specific visual references — functional parity is the goal; the UI should look the same after the @rneui/themed swap
- iOS is the primary verification platform; Android is secondary

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-infrastructure-upgrade*
*Context gathered: 2026-03-10*
