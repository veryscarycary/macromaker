# Project Research Summary

**Project:** macromaker — React Native macro/nutrition tracker
**Domain:** Mobile app upgrade (RN 0.73.6 → 0.84.1) + UX feature polish
**Researched:** 2026-03-10
**Confidence:** MEDIUM-HIGH

## Executive Summary

macromaker is a local-only React Native macro tracker that needs two parallel workstreams: a major version upgrade from RN 0.73.6 to RN 0.84.1, and targeted UX polish on onboarding and weekly data visualization. The upgrade is the larger undertaking by far. Spanning 11 minor versions, it crosses two critical architectural boundaries — New Architecture becomes the default at 0.76 and is permanently mandatory from 0.82 onward — which means the app must adopt Fabric/TurboModules before reaching the target version. The upgrade is not a dependency version bump; it requires native code rewrites on both iOS (AppDelegate) and Android (MainApplication, SoLoader initialization, Kotlin migration), plus coordinated upgrades of navigation, animation, and storage libraries that have breaking API changes.

The recommended upgrade approach is a two-hop strategy: 0.73.6 → 0.76.x (the highest-impact boundary for native files) then 0.76.x → 0.84.1 (completing navigation v7, Reanimated 4, and storage upgrades). The most dangerous single dependency is `react-native-splash-screen`, which is dead (4 years unmaintained), breaks the New Architecture build, and must be replaced with `react-native-bootsplash` before any RN version bump. The most dangerous library matrix decision is Reanimated: v3.x supports RN up to 0.81 at most, while v4.x is required for 0.82+ — and v4 has breaking API changes (Babel plugin rename, `runOnJS`/`runOnUI` renames, `useAnimatedGestureHandler` removed).

The UX milestone (onboarding polish and 7-day average view) is lower complexity than the upgrade. The data infrastructure for both already exists: `getAveragesFromDietDays` is in `utils.ts`, `HistoryContext` already holds the data, and Reanimated is already a dependency. The onboarding work is primarily fixing six clearly identified UX gaps (no progress indicator, misleading CTA labels, no keyboard avoidance, zero defaults, missing unit labels, and no validation on macro percentage sliders). These can proceed somewhat independently of the RN upgrade, though animation improvements will require the Reanimated 4 upgrade to be complete first.

## Key Findings

### Recommended Stack

The jump from 0.73.6 to 0.84.1 touches almost every major dependency. Navigation must be upgraded as a coordinated unit (all `@react-navigation/*` v7 packages plus `react-native-screens` v4 and `react-native-safe-area-context` v5 must move together). Animation requires a Reanimated 3 → 4 upgrade that includes a new peer dependency (`react-native-worklets`) and a Babel plugin change. Async storage has a major version bump (1.x → 3.x) with potential API changes. Pure-JS libraries (d3, lodash, dayjs, uuid) require no changes.

**Core technologies:**
- `react-native@0.84.1`: Target version — Hermes V1 default, 8x faster iOS builds, mandatory New Architecture from 0.82
- `@react-navigation/native@7.1.33` + stack/tabs v7: Navigation upgrade — breaking API changes, must upgrade as a unit with react-native-screens v4
- `react-native-reanimated@4.2.2` + `react-native-worklets`: Animation — New Arch mandatory; Babel plugin changes to `react-native-worklets/plugin`
- `@react-native-async-storage/async-storage@3.0.1`: Storage — major version bump; verify changelog before upgrading
- `react-native-bootsplash@7.1.0`: Splash screen — replaces dead `react-native-splash-screen`
- Node.js 22.11+, Xcode 16.1+: Platform minimums required by RN 0.84

**Do not use:**
- `react-native-splash-screen` (crazycodeboy) — incompatible with New Architecture, dead library
- Reanimated v3 with RN 0.82+ — version matrix mismatch; build will fail
- React Navigation v6 with v7 peer deps — incompatible across major versions

### Expected Features

**Must have (table stakes — table stakes missing from current state):**
- Progress step indicator across all 3 onboarding screens — most visible quality gap; prevents abandonment
- "Next" / "Continue" CTA labels replacing "Calculate BMI" — current label implies wrong action
- Keyboard-aware layout in BasicInfoScreen — inputs currently hidden behind keyboard
- Unit labels on inputs ("lbs", "ft", "in") — zero context on input fields
- Sensible non-zero defaults for numeric fields — current zero defaults feel broken

**Should have (differentiators already partially built):**
- 7-day rolling average summary card in DietHistoryScreen — data infrastructure (`getAveragesFromDietDays`) already exists; this is a UI-only build
- MoreInfoScreen TDEE/BMR explanatory text — existing result display needs framing to create an "aha" moment
- Animated horizontal slide transitions between onboarding screens — Reanimated already installed
- Macro percentage sum validation on sliders — prevent invalid configurations (e.g., 40/40/40)
- Trend arrow on 7-day view comparing this week to last week — requires 14 days of data

**Defer to v2+:**
- Barcode scanner / food database API — defeats offline-first architecture; significant cost and complexity
- Apple Health / HealthKit sync — requires entitlement, significant native work
- Cloud sync / multi-device — requires auth and backend, contradicts local-only design
- Split BasicInfo into 2 screens — acceptable UX with keyboard fix in place; restructuring is premature

### Architecture Approach

The upgrade follows a layered strategy: audit first, replace blockers before touching RN version, apply native changes by platform, enable New Architecture via the interop layer (no custom native modules means all third-party bridging is automatic), then verify on both platforms before the second hop. The existing app architecture (createDataContext pattern, AsyncStorage helpers in utils.ts, React Navigation modal-first root stack) requires no structural changes — it will work on the upgraded stack as-is.

**Major upgrade components:**
1. **Native iOS layer** — AppDelegate.m → AppDelegate.mm (full rewrite to RCTAppDelegate pattern); Podfile platform bump to 15.1; remove Flipper; pod install
2. **Native Android layer** — SoLoader.init() fix; build.gradle (minSdk 24, Kotlin 2.0); MainApplication.java → Kotlin migration; gradle.properties (newArchEnabled=true)
3. **JS dependency graph** — Navigation v7 bundle (upgrade as unit), Reanimated 4 + worklets, AsyncStorage 3.x, react-native-bootsplash

### Critical Pitfalls

1. **react-native-splash-screen blocks build before upgrade starts** — Replace with `react-native-bootsplash` in the dependency audit phase; do not attempt any RN version bump with this library installed
2. **SoLoader init crash on Android** — `SoLoader.init(this, false)` must become `SoLoader.init(this, OpenSourceMergedSoMapping)` in MainApplication; produces an unrecoverable startup crash on 0.76+ if missed
3. **Reanimated version matrix mismatch** — Reanimated 3.x does not support RN 0.82+; Reanimated 4.x requires RN 0.80+; pin to Reanimated 4.2.2 targeting RN 0.84 and read the migration guide for breaking API changes before touching any animated code
4. **iOS Podfile incompatibility** — `platform :ios, '13.4'` fails on 0.76+ which requires 15.1; must regenerate Podfile from Upgrade Helper diff and run `rm -rf Pods/ Podfile.lock && pod install --repo-update`
5. **react-native-vector-icons font double-registration** — `Info.plist` UIAppFonts entries conflict with CocoaPods autolinking font copy; choose one method and disable the other, or icons render as question marks on iOS

## Implications for Roadmap

Based on combined research, the project has two parallel workstreams that should be phased sequentially with the upgrade preceding the UX work (since Reanimated 4 API changes affect the animation work in onboarding polish).

### Phase 1: Dependency Audit and Blocker Replacement

**Rationale:** Research is unanimous — the dependency audit must happen before any version bump. Identifying `react-native-splash-screen` as a required replacement after starting the upgrade is the most common cause of wasted effort. Replace blockers while everything still compiles cleanly.
**Delivers:** A clean dependency graph with all libraries confirmed New Architecture compatible; splash screen replaced with react-native-bootsplash; Reanimated version decision locked based on RN 0.84 target
**Addresses:** All critical pitfalls are prevented at this phase
**Avoids:** Pitfalls 1 (splash screen), 3 (Reanimated mismatch)
**Research flag:** Standard patterns — library compatibility checking is well-documented

### Phase 2: Native Infrastructure Upgrade (0.73.6 → 0.76.x)

**Rationale:** 0.76 is the highest-impact version boundary: New Architecture becomes default, iOS minimum jumps to 15.1, Android minSdk goes to 24, SoLoader changes, AppDelegate modernization required. Hitting this boundary cleanly in isolation (before continuing to 0.84) gives a stable build to verify New Architecture interop against.
**Delivers:** App running on RN 0.76.x with New Architecture enabled; both iOS and Android building and launching
**Uses:** Upgrade Helper diff 0.73.6 → 0.76.x; `RCT_NEW_ARCH_ENABLED=1`
**Avoids:** Pitfalls 2 (SoLoader), 4 (Podfile), 7 (Android minSdk), 8 (Kotlin migration)
**Research flag:** Standard patterns — Upgrade Helper provides exact native file diffs

### Phase 3: JavaScript Dependency Upgrades

**Rationale:** Once native infrastructure is stable at 0.76, upgrade JS-layer dependencies in coordinated groups. Navigation must upgrade as a unit. Reanimated 4 must be coordinated with the worklets package and Babel config change.
**Delivers:** All dependencies at target versions with API migrations applied
**Uses:** react-navigation v7 bundle, Reanimated 4 + worklets, AsyncStorage 3.x
**Implements:** Navigation API changes (`popTo`, `headerBackButtonDisplayMode`, nested screen syntax), Reanimated 4 API (`scheduleOnRN`/`scheduleOnUI`, Babel plugin swap)
**Avoids:** Pitfall 3 (Reanimated mismatch), navigation v6/v7 API conflicts
**Research flag:** Needs focused research on AsyncStorage 3.x changelog before upgrading; the public API is expected stable but verify before executing

### Phase 4: Second Hop to RN 0.84.1

**Rationale:** With libraries updated and New Architecture verified at 0.76, the hop to 0.84 primarily applies the remaining native file changes (Kotlin-only Android templates from 0.80, Node 22.11 requirement, Hermes V1). The diff is smaller and library-level risk is already resolved.
**Delivers:** App running on RN 0.84.1 on both platforms; legacy architecture permanently removed
**Avoids:** Pitfall 5 (React 19 `defaultProps` removal — verify with manual form testing)
**Research flag:** Standard patterns — Upgrade Helper diff 0.76 → 0.84 is authoritative

### Phase 5: Onboarding UX Polish

**Rationale:** Once on Reanimated 4, the animation work in onboarding polish can use the stable API. The UX improvements are well-scoped and low-risk: six identified gaps, all with clear solutions, using existing libraries and data infrastructure.
**Delivers:** Progress step indicator on all 3 onboarding screens; "Next" CTA labels; keyboard-aware layout; unit labels; sensible defaults; macro percentage sum validation
**Uses:** `react-native-reanimated@4.x` for horizontal slide transitions; `KeyboardAvoidingView` + `ScrollView` pattern; `InfoContext` initial state defaults
**Research flag:** Standard patterns — UX fixes follow well-documented React Native patterns

### Phase 6: 7-Day Rolling Average View

**Rationale:** Data infrastructure already exists (`getAveragesFromDietDays` in utils.ts, HistoryContext with historical data). This is entirely a UI build. Separating it from onboarding polish keeps phases focused and testable.
**Delivers:** Rolling 7-day average summary card in DietHistoryScreen showing avg calories and avg macros; handles fewer than 7 days gracefully
**Implements:** Summary card component above history list; reuses existing graph style or simpler card; trend arrow as v1.x addition (requires 14 days)
**Research flag:** Standard patterns — existing data layer, existing graph patterns in codebase

### Phase Ordering Rationale

- Phases 1-4 are strictly sequenced by build dependency: you cannot test library compatibility before auditing, cannot upgrade native infra before knowing your library targets, cannot finalize JS deps before native infra compiles
- Phase 5 (onboarding) must follow Phase 3 (Reanimated 4 upgrade) because the Babel plugin change in Reanimated 4 breaks existing Reanimated 3 animation code; polishing animations against a moving target adds risk
- Phase 6 (7-day average) is independent of onboarding but grouped after to complete the milestone in logical UX order

### Research Flags

**Needs deeper research during planning:**
- **Phase 3 (AsyncStorage 3.x):** Read the official changelog for 1.x → 3.x before upgrading; public API stability is expected but unverified in this research
- **Phase 4 (react-native-svg @ 0.84):** The RCTImage observer API change in 0.84 may require a patch; monitor the react-native-svg release notes before the second hop

**Standard patterns (skip research-phase):**
- **Phase 1:** Library compatibility checking uses reactnative.directory and official docs
- **Phase 2:** Upgrade Helper generates the exact native file diff
- **Phase 5:** Keyboard avoidance, progress indicators, and CTA labeling are standard React Native patterns
- **Phase 6:** Data layer exists; UI component is additive

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core versions confirmed via official release blogs and npm; compatibility matrix verified against Reanimated/react-navigation official docs |
| Features | MEDIUM | Competitor feature patterns from practitioner sources; codebase analysis is direct and HIGH confidence; UX pattern sources are MEDIUM (UX agency blogs) |
| Architecture | HIGH | Official RN release blogs, Upgrade Helper tool, verified against actual project files |
| Pitfalls | HIGH | Critical pitfalls traced to official issue trackers and release notes; community post-mortems corroborate |

**Overall confidence:** HIGH for upgrade path; MEDIUM for feature prioritization

### Gaps to Address

- **AsyncStorage 1.x → 3.x changelog:** Not read during research. The three helper functions in `utils.ts` (`storeData`, `getStoredData`, `removeStoredData`) are the entire blast radius — read the changelog against these before Phase 3.
- **react-native-svg @ 0.84 RCTImage issue:** Noted as LOW confidence in STACK.md. Check react-native-svg GitHub releases when executing Phase 4; patch may or may not be needed.
- **@rneui/themed compatibility with React 18.3.x:** Research notes this library is on `rc.8` with known peer dep mismatches. Test all form inputs (BasicInfoScreen, MoreInfoScreen, AddFoodScreen) manually after every major dependency change.
- **ARCHITECTURE.md target version discrepancy:** ARCHITECTURE.md was researched targeting 0.78.x, while STACK.md targets 0.84.1. The architectural patterns (two-hop strategy, AppDelegate rewrite, SoLoader fix) are identical; the difference is that 0.84 adds Kotlin-only Android templates (0.80) and Node 22.11 requirement. Phase 4 covers this delta.

## Sources

### Primary (HIGH confidence)
- [React Native 0.84 Release Blog](https://reactnative.dev/blog/2026/02/11/react-native-0.84) — Hermes V1, breaking changes, platform requirements
- [React Native 0.82 New Architecture Era](https://reactnative.dev/blog/2025/10/08/react-native-0.82) — New Architecture mandatory from 0.82
- [React Native 0.78 Release Blog](https://reactnative.dev/blog/2025/02/19/react-native-0.78) — React 19, SoLoader, Android Kotlin
- [React Native 0.76 New Architecture Default](https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture) — New Architecture by default, iOS/Android minimums
- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) — authoritative native file diffs
- [React Navigation Upgrading from 6.x](https://reactnavigation.org/docs/upgrading-from-6.x/) — navigation breaking changes
- [Reanimated Compatibility Table](https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/) — RN version matrix
- [Reanimated 3→4 Migration Guide](https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/) — Babel plugin change, API renames
- [MacroFactor app](https://macrofactor.com/macrofactor/) — weekly running average as documented product feature
- [React Native Onboarding patterns](https://blog.swmansion.com/onboarding-in-react-native-doesnt-have-to-be-hard-d037cd383771) — Reanimated maintainers' official onboarding guide
- Project codebase (screens/InfoModal/, utils.ts, context/) — direct source of truth for current state

### Secondary (MEDIUM confidence)
- npm search results — confirmed latest package versions for navigation, gesture-handler, safe-area-context, bootsplash
- [Cronometer vs MyFitnessPal](https://www.katelymannutrition.com/blog/cronometer-vs-mfp) — competitor feature comparison
- [Mobile Onboarding UX Best Practices 2026](https://www.designstudiouiux.com/blog/mobile-app-onboarding-best-practices/) — UX pattern validation
- [react-native-vector-icons #1460](https://github.com/oblador/react-native-vector-icons/issues/1460) — font double-registration issue
- [Beyond the Version Bump: RN 0.72 → 0.82 post-mortem](https://blogs.perficient.com/2025/12/24/beyond-the-version-bump-lessons-from-upgrading-react-native-0-72-7-%E2%86%92-0-82/) — practitioner upgrade lessons

### Tertiary (LOW confidence)
- react-native-svg 15.x / RN 0.84 RCTImage observer issue — mentioned in STACK.md sources; unverified; monitor before Phase 4 execution

---
*Research completed: 2026-03-10*
*Ready for roadmap: yes*
