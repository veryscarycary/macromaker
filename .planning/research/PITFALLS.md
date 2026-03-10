# Pitfalls Research

**Domain:** React Native major version upgrade (0.73.6 → 0.78.x)
**Researched:** 2026-03-10
**Confidence:** HIGH (verified against official RN release notes, library issue trackers, community post-mortems)

---

## Critical Pitfalls

### Pitfall 1: New Architecture Enabled by Default at 0.76 — Library Ecosystem Not Fully Ready

**What goes wrong:**
React Native 0.76 enables the New Architecture (Fabric + TurboModules) by default for all projects. The project's current stack includes libraries that have varying levels of New Architecture readiness. If you upgrade to 0.76+ without auditing and updating every native dependency, the build may succeed but runtime crashes occur — often only on specific interactions or platforms.

**Why it happens:**
Developers treat the New Architecture interop layer as a complete safety net. RN 0.74+ ships an interop layer that makes old-arch libraries "mostly work," but the interop layer does not cover all cases. Libraries with heavy C++ native code, custom JSI modules, or rendering hooks break silently or crash at runtime rather than compile time.

**How to avoid:**
Audit every native library against New Architecture compatibility before upgrading the RN version:
- `react-native-reanimated`: v3.x works on old arch; v4.x is required for New Architecture with RN 0.78+ (see Pitfall 3)
- `react-native-svg`: v15 has New Architecture support but specific minor versions have had build failures on iOS (check releases carefully)
- `react-native-vector-icons`: v10.x works with New Architecture; font registration method changed (see Pitfall 6)
- `react-native-gesture-handler`: v2.x supports New Architecture; must stay ≥2.14 for RN 0.76+
- `@rneui/themed`: v4.0.0-rc.8 has known peer dependency mismatches; v5.0.0-beta is available but unstable
- `react-native-splash-screen`: v3.3.0 is not New Architecture compatible — requires replacement or manual patch

Use the [React Native Directory](https://reactnative.directory/) to check the New Architecture column for each dependency before upgrading.

**Warning signs:**
- "RCT_NEW_ARCH_ENABLED" or "newArchEnabled" referenced in build errors
- Crashes on screens that use native modules immediately after an upgrade that "built successfully"
- `undefined is not an object` errors at runtime on components that previously worked
- Build succeeds but app silently falls back to bridge for some modules

**Phase to address:**
Phase 1 (dependency audit before any version bump). Do not increment the RN version until every library is confirmed compatible or a replacement is identified.

---

### Pitfall 2: SoLoader Init Change on Android — App Crashes at Startup

**What goes wrong:**
React Native 0.76 merged many native libraries into a single `libreactnative.so` file. The `SoLoader.init()` call in `MainApplication.java` must be updated to pass `OpenSourceMergedSoMapping` instead of `false`. The current `MainApplication.java` in this project uses `SoLoader.init(this, false)` — the old pattern. Without this change, the Android app crashes at startup with a `UnsatisfiedLinkError` or `NullPointerException` in native code.

**Why it happens:**
The upgrade helper shows this change, but developers often focus on `package.json` version bumps and miss native file changes. The error only manifests at runtime, not at compile time.

**How to avoid:**
Apply this exact change to `android/app/src/main/java/.../MainApplication.java` (or migrate to Kotlin):

```kotlin
// Before (0.73 pattern — currently in this project):
SoLoader.init(this, false);

// After (0.76+ required):
import com.facebook.react.soloader.OpenSourceMergedSoMapping
SoLoader.init(this, OpenSourceMergedSoMapping)
```

Use the [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) diff between 0.73 and 0.78 as the authoritative reference for all native file changes.

**Warning signs:**
- `java.lang.UnsatisfiedLinkError` on Android startup after upgrade
- App opens then immediately crashes before any JS runs
- Crash stacktrace references `SoLoader` or `libreactnative.so`

**Phase to address:**
Phase 1 (native template file updates), immediately after dependency audit.

---

### Pitfall 3: Reanimated 3.x vs 4.x Version Matrix Confusion

**What goes wrong:**
`react-native-reanimated` has a strict version matrix that breaks if mismatched. The current project uses `~3.6.0`. Reanimated 4.x is required for New Architecture with React Native 0.78 but is **not** backward compatible with Reanimated 3.x APIs. Reanimated 3.x supports New Architecture via an interop layer on RN 0.76-0.77, but upgrading to RN 0.78 while still on Reanimated 3.x can trigger a `parentShadowView` build error (confirmed in issue #7076 on the Reanimated repo).

**Why it happens:**
The version matrix is not clearly surfaced during `npm install`. The peer dependency range for reanimated is wide enough that npm/yarn does not error — the mismatch only appears during the native build or at runtime.

**How to avoid:**
Follow this decision tree:
- Targeting RN 0.76–0.77 → Reanimated 3.x (≥3.16) is sufficient with New Architecture interop
- Targeting RN 0.78 → **upgrade to Reanimated 4.x** (4.0.x supports RN 0.78, 0.79, 0.80, 0.81; Reanimated 4.1+ for RN 0.82+)

Check the [Reanimated compatibility table](https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/) and pin an exact minor version, not a range.

Review Reanimated 4's migration guide for API changes before upgrading — there are breaking changes from 3.x to 4.x in animation APIs.

**Warning signs:**
- Build error mentioning `parentShadowView` or `ShadowViewMutation` in native Reanimated files
- Metro bundles successfully but animations are broken at runtime
- `Couldn't determine the version of the native part of Reanimated` warning in logs

**Phase to address:**
Phase 1 (dependency audit). Treat the Reanimated version decision as a gate on the RN target version choice.

---

### Pitfall 4: iOS Podfile Is Incompatible With RN 0.76+

**What goes wrong:**
The current Podfile is a minimal 0.73-era configuration:
```ruby
platform :ios, '13.4'
use_react_native!(:path => ..., :hermes_enabled => false)
```
React Native 0.76 raises the minimum iOS deployment target to **15.1**. The Podfile `platform :ios, '13.4'` line will cause pod install to fail or produce an archive that is rejected. Additionally, the 0.76+ Podfile template adds `use_frameworks!`, `flipper` removal, `RCTAppDependencyProvider` setup, and modified `post_install` hooks that are required for the New Architecture.

**Why it happens:**
Developers bump the npm version and run `pod install` without updating the Podfile to the new template. The `react_native_pods` script changes between versions, and using the old Podfile with new scripts causes mismatched configuration.

**How to avoid:**
1. Use the [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) to get the exact Podfile diff between 0.73.6 and 0.78.x.
2. Update `platform :ios, min_ios_version_supported` (this macro resolves to 15.1 in 0.76+).
3. Remove Hermes disable flag — Hermes is required for New Architecture.
4. Add `RCTAppDependencyProvider` dependency per 0.77 requirements.
5. Update `post_install` to include the new `react_native_post_install` hooks.
6. Delete `Pods/`, `Podfile.lock`, and run `pod install --repo-update` after every Podfile change.

**Warning signs:**
- `pod install` fails with "platform version must be >= 15.1" or similar deployment target errors
- Xcode archive fails with "unsupported minimum deployment target"
- `RCTAppDependencyProvider` not found at runtime (crash on launch on iOS)
- Hermes error about bridge-mode not supported when `hermes_enabled => false` is kept

**Phase to address:**
Phase 1 (iOS native configuration). Must be done before any iOS build attempt after the RN version bump.

---

### Pitfall 5: React 19 PropTypes Removal Breaks Silent — No Compile Error

**What goes wrong:**
React Native 0.78 ships React 19. React 19 removes `propTypes` validation entirely — using `propTypes` on components no longer throws, it is **silently ignored**. Third-party libraries that ship with `propTypes` will stop validating. More critically, `defaultProps` for function components is also deprecated. If `@rneui/themed` or other libraries use `propTypes` internally, their prop validation disappears without warning. The real risk is libraries that rely on `defaultProps` for function components — those default values stop being applied in React 19, which can cause `undefined` prop bugs at runtime.

**Why it happens:**
There is no compile-time error. Tests pass, the app launches, and the regression only appears under specific conditions where a prop relied on `defaultProps` to supply a value that is now `undefined`.

**How to avoid:**
1. Run `npx react-native-upgrade-helper` to identify all places where `propTypes` / `defaultProps` are used in app code.
2. Grep the `node_modules` of every native library for `defaultProps` usage on function components — these are potential runtime landmines post-upgrade.
3. Follow the [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) to update app code before targeting RN 0.78.
4. Pin `react` to exactly the version shipped with the target RN release to avoid React version drift.

**Warning signs:**
- Components that previously had defaults now render with `undefined` values
- `@rneui/themed` `Button` or `Input` components behave unexpectedly after upgrade
- No error thrown but UI element styling or behavior changes after upgrade

**Phase to address:**
Phase 2 (RN 0.78 upgrade step, after libraries are confirmed compatible).

---

### Pitfall 6: react-native-vector-icons Font Registration Duplicated or Missing on iOS

**What goes wrong:**
The current project has `Ionicons.ttf`, `Feather.ttf`, and `FontAwesome.ttf` listed under `UIAppFonts` in `Info.plist`. When CocoaPods autolinking copies fonts into the bundle via `Copy Pods Resources` AND `Info.plist` also lists them, the fonts are registered twice. This causes icons to render as question marks (`?`) or boxes on iOS. Conversely, if the `Info.plist` entries are removed but CocoaPods autolinking is not configured correctly, the fonts are not registered at all and the same symptom appears.

**Why it happens:**
The manual `Info.plist` registration approach worked before autolinking was robust. Now, `react-native-vector-icons` v10's CocoaPods podspec copies fonts via `Build Phases`. Developers keep the old `Info.plist` entries without realizing they are now duplicating the font registration.

**How to avoid:**
Choose one registration method and disable the other:

Option A (CocoaPods autolink, preferred for RN 0.76+):
1. Create `react-native.config.js` at project root with `fonts: { "react-native-vector-icons": { platforms: { ios: null } } }` to prevent duplicate copy
2. Remove `UIAppFonts` entries from `Info.plist`
3. Verify fonts appear in Xcode's `Copy Pods Resources` build phase

Option B (manual `Info.plist`, disable CocoaPods copy):
1. Keep `UIAppFonts` in `Info.plist`
2. Exclude fonts from CocoaPods copy via the `react-native.config.js` asset exclusion

**Warning signs:**
- Icons render as `?` or empty boxes on iOS immediately after pod install
- Fonts appear twice in Xcode's `Build Phases → Copy Bundle Resources`
- Changing `Info.plist` font list has no effect on icon rendering

**Phase to address:**
Phase 1 (iOS native configuration, alongside Podfile update).

---

### Pitfall 7: Android minSdkVersion 23 Incompatible With RN 0.76+ Requirement of 24

**What goes wrong:**
React Native 0.76 raised the Android minimum SDK from 23 to 24 (Android 7.0). The current `android/build.gradle` sets `minSdkVersion = 23`. Building with 0.76+ against minSdk 23 produces a Gradle build error or a Play Store rejection. Libraries that have also bumped their minSdk to 24 will cause dependency resolution errors even earlier.

**Why it happens:**
The `ext` block in `android/build.gradle` is not automatically updated when RN is upgraded via npm. It must be manually changed.

**How to avoid:**
Update `android/build.gradle` ext block:
```groovy
minSdkVersion = 24       // was 23, RN 0.76+ requires 24
compileSdkVersion = 35   // already correct in this project
targetSdkVersion = 35    // already correct
kotlinVersion = "2.0.21" // 0.77 moved to Kotlin 2.0; upgrade from 1.8.0
ndkVersion = "27.1.12297006" // update to match RN 0.78 template
```

Also update `classpath("com.android.tools.build:gradle:8.6.0")` — verify this matches the RN 0.78 template gradle plugin version.

**Warning signs:**
- Gradle sync error: "minSdkVersion X < Y required by..."
- Google Play Console rejection for minimum API level
- Kotlin version mismatch errors in Android build

**Phase to address:**
Phase 1 (Android native configuration).

---

### Pitfall 8: MainApplication.java Must Be Migrated (Java → Kotlin) for RN 0.76+

**What goes wrong:**
The current project still uses `MainApplication.java` (Java). React Native 0.76+ templates use Kotlin, and the RN 0.77 template moved `MainActivity` to Kotlin as well. While Java continues to compile, the 0.76+ template introduces `ReactActivity.currentActivity` and other APIs in ways that assume Kotlin nullability contracts. Additionally, `DefaultNewArchitectureEntryPoint.load()` pattern in `MainApplication.java` is being replaced by the Kotlin template's approach. Keeping Java may cause runtime issues with Kotlin-native RN APIs that assume non-nullable types.

**Why it happens:**
The Upgrade Helper shows Kotlin equivalents but does not force migration — it appears optional. Developers skip the migration thinking Java still compiles, which it does, but correctness issues emerge over time.

**How to avoid:**
Migrate `MainApplication.java` to `MainApplication.kt` using the [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) diff for 0.73 → 0.78 as a guide. Key changes in the Kotlin version:
1. `SoLoader.init(this, OpenSourceMergedSoMapping)` (the 0.76 fix from Pitfall 2)
2. Remove `DefaultNewArchitectureEntryPoint.load()` — no longer needed in 0.76+
3. `ReactHost` replaces `ReactNativeHost` as the primary entry point under New Architecture

**Warning signs:**
- Kotlin nullability crash logs in production from RN internals
- `ClassCastException` at startup related to `ReactNativeHost` vs `ReactHost`
- Intermittent Android crashes after upgrade that don't reproduce consistently

**Phase to address:**
Phase 1 (Android native configuration, alongside SoLoader fix).

---

### Pitfall 9: react-native-splash-screen Is Not New Architecture Compatible

**What goes wrong:**
`react-native-splash-screen` v3.3.0 (currently installed) is a pre-New Architecture library with no TurboModule support. Under the interop layer it may function, but the library has had no meaningful updates since 2022 and is not officially listed as New Architecture compatible. On RN 0.76+ with New Architecture enabled, the splash screen may either not dismiss or crash on app launch.

**Why it happens:**
It's an easy library to overlook in a dependency audit because it "just works" on old arch and only runs at startup. The failure mode is also ambiguous — a white screen on launch looks like a JS bundle issue, not a native module issue.

**How to avoid:**
Replace `react-native-splash-screen` with one of:
- `expo-splash-screen` (works in bare RN, New Architecture compatible)
- `react-native-bootsplash` v5+ (actively maintained, New Architecture compatible, better API)

Plan the replacement in the dependency audit phase, not as an afterthought.

**Warning signs:**
- App hangs on white/splash screen after upgrade to 0.76+
- `SplashScreen.hide()` call has no effect
- Build warning about `RNSplashScreen` module not found in turbo modules registry

**Phase to address:**
Phase 1 (dependency audit — flag as a required replacement, not an optional upgrade).

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Disabling New Architecture (`newArchEnabled=false` in gradle.properties) | Fixes build quickly, app ships | Old arch frozen as of June 2025; RN 0.82 removes it entirely; libraries drop old arch support | Never — legacy arch has an expiry date |
| Keeping Hermes disabled (`hermes_enabled: false` in Podfile) | Avoids Hermes-specific bugs | New Architecture requires Hermes; disabling blocks the full upgrade | Never for 0.76+ with New Arch |
| Pinning `react-native-reanimated` to 3.x after targeting RN 0.78 | Avoids Reanimated 4 migration work | `parentShadowView` build errors; will need to upgrade anyway | Never — pin to 4.x once on RN 0.78 |
| Skipping Kotlin migration for MainApplication | Saves ~1 hour | Kotlin nullability mismatches with RN APIs compound over subsequent upgrades | Acceptable as a temporary bridge for Phase 1, must be done in Phase 2 |
| Incrementally upgrading one minor version at a time (0.73 → 0.74 → 0.75 → ...) | Smaller diffs per step | Takes significantly longer; intermediate versions are not supported | Acceptable if any intermediate version is needed for library compatibility validation |

---

## Integration Gotchas

Common mistakes when connecting the upgrade across platform layers.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| CocoaPods + New Arch | Running `pod install` without clearing `Pods/` and `Podfile.lock` after RN version bump | Always: `rm -rf Pods/ Podfile.lock && pod install --repo-update` |
| Android Gradle + New Arch | Forgetting to update `gradle-wrapper.properties` Gradle version alongside `classpath` AGP version | Match Gradle wrapper version to AGP version per the [compatibility matrix](https://developer.android.com/build/releases/gradle-plugin#updating-gradle) |
| react-native-vector-icons + autolinking | Keeping `UIAppFonts` in `Info.plist` after switching to CocoaPods font copy | Remove `Info.plist` entries OR disable CocoaPods copy — never both |
| React Navigation v6 + New Arch 0.77 | Safe area context not applied to bottom tabs/native stack | Ensure `react-native-safe-area-context` ≥4.10 and wrap root in `SafeAreaProvider` |
| `@rneui/themed` + React 19 | Using `@rneui/themed` v4.0.0-rc.8 with React 19 without testing Button/Input edge cases | Test all form inputs and buttons on both platforms after upgrade; consider v5 beta |
| Metro + 0.77 debugging | Expecting `console.log` output in Metro terminal (removed in 0.77) | Use React Native DevTools or a CDP-compatible debugger instead |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Leaving `hermes_enabled: false` on RN 0.76+ | App launches slower, higher memory use, no New Arch benefit | Enable Hermes as part of the 0.76 upgrade; run full regression on both platforms | Immediately upon 0.76 upgrade |
| Not enabling New Architecture after upgrade | App runs in compatibility mode, no performance gain, libraries start requiring New Arch | Enable New Architecture explicitly; audit libraries first | When libraries drop old-arch support (ongoing, accelerating in 2025–2026) |
| `getAllMealData()` scanning all AsyncStorage keys on every screen focus (existing) | Perceptible lag as meal history grows | Cache in MealContext reducer (documented in CONCERNS.md) | ~500+ meal entries |
| D3/SVG graphs rerendering without memoization (existing) | UI jank on navigation | `React.memo` + `useMemo` on graph data (documented in CONCERNS.md) | Visible immediately on lower-end devices |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **RN version bumped in package.json**: Verify native files (Podfile, build.gradle, MainApplication, AppDelegate) are ALSO updated to match the new version's template
- [ ] **`pod install` ran**: Verify with `pod install --repo-update`, not just `pod install`; verify Podfile.lock shows the new RN version's pod versions
- [ ] **New Architecture "enabled"**: Verify `IS_NEW_ARCHITECTURE_ENABLED=true` in `android/gradle.properties` AND New Architecture is working — build a release APK and test, not just dev
- [ ] **Icons display correctly on iOS after pod changes**: Check icons on a real device or simulator after every Podfile/Info.plist change
- [ ] **Reanimated build version matches runtime version**: Check Metro logs for "Reanimated native version mismatch" on first launch after upgrade
- [ ] **`react-native-splash-screen` replaced**: Confirm the app dismisses the splash screen correctly on both cold and warm launches
- [ ] **React 19 `defaultProps` regression check**: Manually test all forms (`BasicInfoScreen`, `MoreInfoScreen`, `AddFoodScreen`) for undefined prop values
- [ ] **Android minSdk updated**: Confirm Google Play Console accepts the APK without API level rejection

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| New Architecture library incompatibility crashes | MEDIUM | Temporarily set `newArchEnabled=false` in `gradle.properties` + `use_frameworks!` off in Podfile to isolate which library is broken; then upgrade or replace that library |
| SoLoader crash on Android startup | LOW | Add the `OpenSourceMergedSoMapping` import and update `SoLoader.init()` call; clean build cache with `cd android && ./gradlew clean` |
| Podfile/pod install failures | LOW-MEDIUM | `rm -rf ios/Pods ios/Podfile.lock` + `pod install --repo-update`; if still failing, check for iOS deployment target mismatch between Podfile and Xcode project settings |
| Reanimated version mismatch build error | MEDIUM | Pin exact compatible version per the compatibility table; `npm install react-native-reanimated@X.Y.Z --save-exact`; clean build directories on both platforms |
| Icons showing `?` on iOS | LOW | Choose one registration method (Pitfall 6), clean derived data in Xcode, rebuild |
| React 19 `undefined` prop bugs from `defaultProps` removal | MEDIUM-HIGH | Audit every component using `defaultProps`; add explicit default parameter values in function signatures; takes time if third-party libraries are affected |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| New Architecture library compatibility | Phase 1: Dependency Audit | Every native library confirmed New Arch compatible before first RN version bump |
| SoLoader init change (Android) | Phase 1: Native template updates | Android cold start completes without crash on debug build |
| Reanimated 3.x vs 4.x mismatch | Phase 1: Dependency Audit | Reanimated version chosen matches RN target version per compatibility table |
| iOS Podfile incompatible | Phase 1: iOS native configuration | `pod install` succeeds; iOS simulator builds and launches |
| React 19 propTypes/defaultProps removal | Phase 2: RN 0.78 + React 19 upgrade | All form screens tested manually; no `undefined` prop regressions |
| RNVI font duplication/missing on iOS | Phase 1: iOS native configuration | Icons render correctly on iOS simulator after pod update |
| Android minSdk 23 incompatible | Phase 1: Android native configuration | `./gradlew assembleDebug` succeeds; minSdk in build.gradle = 24 |
| MainApplication Java → Kotlin migration | Phase 1 or Phase 2 | No Kotlin nullability crashes in Android logcat after upgrade |
| react-native-splash-screen incompatibility | Phase 1: Dependency Audit (replacement identified) | Splash screen dismisses cleanly on both platforms in cold start |

---

## Sources

- [React Native 0.76 Release — New Architecture by default](https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture) — HIGH confidence (official)
- [React Native 0.77 Release — Swift template, Kotlin 2.0, API removals](https://reactnative.dev/blog/2025/01/21/version-0.77) — HIGH confidence (official)
- [React Native 0.78 Release — React 19, breaking changes](https://reactnative.dev/blog/2025/02/19/react-native-0.78) — HIGH confidence (official)
- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) — HIGH confidence (official tool)
- [Reanimated compatibility table](https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/) — HIGH confidence (official)
- [Reanimated #7076: parentShadowView build error on RN 0.78](https://github.com/software-mansion/react-native-reanimated/issues/7076) — HIGH confidence (official issue tracker)
- [react-native-vector-icons #1460: New Architecture support issue](https://github.com/oblador/react-native-vector-icons/issues/1460) — MEDIUM confidence (community)
- [React Navigation #12455: Safe area ignored in RN 0.77 New Arch](https://github.com/react-navigation/react-navigation/issues/12455) — MEDIUM confidence (community issue tracker)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) — HIGH confidence (official)
- [Beyond the Version Bump: Lessons from RN 0.72.7 → 0.82](https://blogs.perficient.com/2025/12/24/beyond-the-version-bump-lessons-from-upgrading-react-native-0-72-7-%E2%86%92-0-82/) — MEDIUM confidence (practitioner post-mortem)
- [react-native-community upgrade-support #338: 0.72 to 0.76 issues](https://github.com/react-native-community/upgrade-support/issues/338) — MEDIUM confidence (community)
- Project's own `android/build.gradle` and `ios/Podfile` (current state observed directly) — HIGH confidence

---

*Pitfalls research for: React Native 0.73.6 → 0.78.x upgrade (macromaker)*
*Researched: 2026-03-10*
