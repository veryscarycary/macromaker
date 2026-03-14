# Phase 1: Dependency Audit - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Audit every npm dependency for New Architecture (Fabric/TurboModules) compatibility, replace dead/incompatible libraries, and produce a locked dependency matrix before any RN version number changes. This phase ends with a documented DEPS-MATRIX.md and no blocking libraries remaining. No native code changes, no version bumps to React Native itself.

</domain>

<decisions>
## Implementation Decisions

### react-native-splash-screen replacement
- Replace with `react-native-bootsplash@7.1.0`
- Splash screen style: static logo only (no animation, no Lottie)
- Match existing visual output — app logo on background, fast dismiss on app load

### react-native-chart-kit
- Claude's discretion: if the library is old/sunsetting or worse than existing D3 custom components, remove it
- The app already has custom D3-based graph components (BarGraph, MealTimeGraph, TotalCaloriesGraph) that cover all current functionality
- Constraint: any removed library's functionality must be confirmed already covered or replaced before removal
- If uncertain, keep it and document in DEPS-MATRIX.md

### @rneui/themed replacement
- Evaluate replacing with `react-native-paper` (stable v5, Material Design 3, actively maintained)
- @rneui/themed rc.8 is not stable and has known peer dep issues with React 18.3.x
- react-native-paper has equivalents for all three used components: Input → TextInput, SearchBar → Searchbar, ListItem → List.Item
- During audit phase: confirm which screens use these components and document replacement plan for execution in Phase 2 or as a standalone plan

### Audit documentation
- Produce `.planning/DEPS-MATRIX.md` — markdown table with: library name, current version, target version, New Arch compatible (yes/no/pending), notes
- This file must be complete and committed before Phase 2 begins (satisfies DEPS-03)

### Claude's Discretion
- Specific splash screen image/asset to use (use existing app assets if available)
- Whether to remove react-native-chart-kit now vs. in Phase 2 (whichever is cleaner)
- Exact format of DEPS-MATRIX.md
- Which other libraries (if any) should be evaluated for replacement using the same criteria: old/sunsetting, not New Arch compatible, or better alternatives exist

</decisions>

<code_context>
## Existing Code Insights

### Current Dependencies of Note
- `react-native-splash-screen@3.3.0` — dead (4 years unmaintained), blocks New Architecture; REPLACE with bootsplash
- `react-native-chart-kit@6.12.0` — in package.json; not used by main graph components (custom D3 SVG components used instead: BarGraph.tsx, MealTimeGraph.tsx, TotalCaloriesGraph.tsx); candidate for removal
- `@rneui/themed@4.0.0-rc.8` — used in: Input (BasicInfoScreen, MoreInfoScreen, AddFoodScreen), SearchBar (AddFoodScreen), ListItem (likely DailyDietScreen/history lists); evaluate replacement with react-native-paper
- `react-native-reanimated@~3.6.0` — must upgrade to 4.x before RN 0.82; Babel plugin will change from `react-native-reanimated/plugin` to `react-native-worklets/plugin`
- `d3@5.15.1`, `d3-scale@3.2.1` — pure JS, no native code, no upgrade needed
- `lodash@4.17.21`, `dayjs@1.11.13`, `uuid@9.0.1` — pure JS, no native code, no upgrade needed

### Integration Points
- `ios/Podfile` — will reference react-native-splash-screen; must update to bootsplash during this phase's removal step
- `ios/macromaker/AppDelegate.mm` — currently calls splash screen hide; will need bootsplash API after replacement
- `android/app/src/main/java/` — MainApplication may reference splash screen; audit needed

### Established Patterns
- Custom graph components (components/BarGraph.tsx, components/MealTimeGraph.tsx, components/TotalCaloriesGraph.tsx) use react-native-svg + D3 directly — no dependency on chart-kit
- All storage accessed through utils.ts helpers (storeData, getStoredData, removeStoredData) — these are the blast radius for AsyncStorage 3.x upgrade

</code_context>

<specifics>
## Specific Ideas

- User trusts Claude's judgement on removing/replacing old or sunsetting dependencies, provided current functionality is maintained
- react-native-paper preferred over raw native components for the @rneui/themed replacement — keep the component library layer
- Bootsplash: keep it simple — static logo, matches whatever the current splash screen shows

</specifics>

<deferred>
## Deferred Ideas

- Navigation v7 API changes — Phase 2 scope
- Reanimated 4 API migration (runOnJS/runOnUI renames) — Phase 2 scope
- AsyncStorage 3.x changelog verification — Phase 2 pre-work (flagged in STATE.md)
- @rneui/themed → react-native-paper actual component replacement — Phase 2 scope (audit only in Phase 1)

</deferred>

---

*Phase: 01-dependency-audit*
*Context gathered: 2026-03-10*
