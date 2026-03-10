# Architecture Research

**Domain:** React Native bare app upgrade (0.73.6 → 0.78.x)
**Researched:** 2026-03-10
**Confidence:** HIGH (official RN release blog posts, confirmed against actual project files)

## Standard Architecture

### System Overview: Upgrade Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    JavaScript Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ package.json │  │  App source  │  │  metro.config.js │   │
│  │  (deps bump) │  │ (API changes)│  │  (no change req) │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Android Native Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  build.grade │  │ MainAppl.java│  │ gradle.properties│   │
│  │ (SDK/Kotlin) │  │(SoLoader fix)│  │ (newArchEnabled) │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    iOS Native Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ AppDelegate  │  │   Podfile    │  │   Info.plist     │   │
│  │ (full rewrite│  │  (platform   │  │   (unchanged)    │   │
│  │  required)   │  │   15.1 min)  │  │                  │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Current State (0.73.6) vs Target (0.78.x)

| Component | Current (0.73.6) | Target (0.78.x) | Change Required |
|-----------|------------------|-----------------|-----------------|
| React | 18.2.0 | 19.x | YES — React 19 API changes |
| Hermes | Enabled via flag | Enabled by default | Minimal |
| New Architecture | `newArchEnabled=false` | On by default in 0.76+ | Must decide opt-in/out |
| iOS AppDelegate | ObjC, manual bridge setup | ObjC++ with RCTAppDelegate | Full rewrite |
| Android MainApplication | Java, `SoLoader.init(this, false)` | Java/Kotlin, merged SoLoader | SoLoader call change |
| Min Android SDK | 23 | 24 (since 0.76) | Bump minSdkVersion |
| Min iOS | 13.4 | 15.1 (since 0.76) | Bump deployment target |
| Kotlin version | 1.8.0 | 2.0.21+ (0.77+) | Bump kotlinVersion |
| Metro config | `mergeConfig` pattern | Same — already correct | None |

## Recommended Upgrade Approach

### Strategy: Version-by-Version, Not a Single Leap

Do NOT jump directly from 0.73 to 0.78 in one step. The span crosses four major version bumps (0.74, 0.75, 0.76, 0.77, 0.78), each with independent native file changes. Attempting them all at once produces a pile of native errors with no clear attribution.

**Recommended path:** Upgrade in two hops.
1. 0.73.6 → 0.76.x (the most impactful boundary: New Architecture default, iOS/Android minimums)
2. 0.76.x → 0.78.x (React 19, Kotlin 2.0, smaller scope)

Use the [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) for the exact file diff at each hop.

### Phase 1: Pre-Upgrade Audit (before touching any code)

Run a library compatibility audit before touching `package.json`:

```bash
npx react-native-community/cli doctor
```

Assess each dependency against 0.78 New Architecture support. Problem libraries identified for this project:

| Library | Current | Risk Level | Action |
|---------|---------|-----------|--------|
| `react-native-splash-screen` 3.3 | Last release 4 years ago | HIGH — actively broken on 0.75+ | Replace with native implementation or `react-native-bootsplash` |
| `react-native-vector-icons` 10.x | Being deprecated in favor of per-family packages | MEDIUM | Upgrade to 10.3.0+ or migrate to `@react-native-vector-icons/*` |
| `react-native-reanimated` ~3.6 | Old 3.x series | MEDIUM | Upgrade to 3.18.x for full New Architecture support |
| `react-native-screens` 3.23 | Pre-v4 (v4 required by React Nav 7) | MEDIUM | Upgrade to 4.x if upgrading React Navigation |
| `react-native-chart-kit` 6.12 | No New Architecture support | LOW (no native code) | Likely fine, JS-only |
| `react-native-svg` 15.15.3 | Currently correct latest 15.x | LOW | No change needed |
| `@react-native-async-storage/async-storage` 1.24 | Supports New Architecture | LOW | No change needed |
| `react-native-gesture-handler` 2.14 | Old v2 series | LOW-MEDIUM | Upgrade to latest 2.x |

### Phase 2: JavaScript + Dependency Updates

```bash
npm install react-native@0.76.x react@19.0.0
npm install react-native-reanimated@3.18.x
npm install react-native-gesture-handler@latest
npm install react-native-screens@4.x  # if upgrading React Navigation to v7
```

**React 19 API removals that affect this project:**

- `propTypes` removed from React. This project uses TypeScript throughout, so `propTypes` are unlikely to be in use — verify with a search: `grep -r "propTypes" src/`
- `forwardRef` is no longer necessary (refs can be passed as props). No immediate action required; existing `forwardRef` usage still works via compatibility layer in React 19 initially.
- No class components were identified in this codebase, so lifecycle method removals do not apply.

### Phase 3: Android Native Changes

**File: `android/build.gradle`**

Three changes required:
1. `kotlinVersion` bump from `1.8.0` to `2.0.21` (required by RN 0.77+)
2. `minSdkVersion` bump from `23` to `24` (required by RN 0.76+)
3. Verify `compileSdkVersion` stays at 35 (already correct)

```groovy
// android/build.gradle
ext {
    buildToolsVersion = "35.0.0"
    minSdkVersion = 24          // was 23
    compileSdkVersion = 35
    targetSdkVersion = 35
    ndkVersion = "26.1.10909125"  // check upgrade helper for exact version
    kotlinVersion = "2.0.21"   // was 1.8.0
}
```

**File: `android/gradle.properties`**

New Architecture is enabled by default in 0.76+. The current value `newArchEnabled=false` will be overridden at build time by 0.76. Decide: keep old arch temporarily for smoother initial upgrade, or embrace it from the start.

For initial upgrade, temporarily keeping `newArchEnabled=false` is defensible — it gives you a working build before dealing with library compatibility. Re-enable after verifying everything builds.

**File: `android/app/src/main/java/.../MainApplication.java`**

The SoLoader initialization call must change. This is the single most commonly broken thing in 0.76 upgrades:

```java
// BEFORE (current — will cause native library errors on 0.76):
SoLoader.init(this, false);

// AFTER (required for 0.76+):
import com.facebook.react.soloader.OpenSourceMergedSoMapping;
SoLoader.init(this, OpenSourceMergedSoMapping);
```

The `flipper-integration` dependency in `app/build.gradle` should also be removed — Flipper support was dropped from the default template in 0.75+.

**File: `android/app/build.gradle`**

Remove the Flipper dependency:
```groovy
// Remove this line:
implementation("com.facebook.react:flipper-integration")
```

The Gradle wrapper version should be updated to match what the upgrade helper specifies for 0.78 (typically 8.8+).

### Phase 4: iOS Native Changes

**The iOS AppDelegate is the most significant native change.**

The current `AppDelegate.m` uses the legacy manual bridge pattern (`RCTBridge`, `RCTRootView`) which was deprecated starting with RN 0.74 and is incompatible with New Architecture. The upgrade to 0.77+ requires adopting `RCTAppDelegate`.

**Option A: Keep Objective-C, modernize to RCTAppDelegate (recommended for this project)**

This app has no custom C++ native modules, so the Swift migration is not required. Keep Objective-C++ and adopt `RCTAppDelegate`:

The new `AppDelegate.mm` pattern (Objective-C++, replaces both `.h` and `.m`):

```objc
// AppDelegate.h — simplified
#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : RCTAppDelegate
@end

// AppDelegate.mm — inheriting from RCTAppDelegate
#import "AppDelegate.h"
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"main";
  self.dependencyProvider = [RCTAppDependencyProvider new];  // Required in 0.77+
  self.initialProps = @{};
  return [super application:application
      didFinishLaunchingWithOptions:launchOptions];
}

@end
```

The `sourceURLForBridge:` method, `openURL:` handler, and `continueUserActivity:` handler all move into the `RCTAppDelegate` base class automatically. Deep linking via `RCTLinkingManager` is handled by the base class.

**File: `ios/Podfile`**

Minimum platform must be bumped:
```ruby
# Was: platform :ios, min_ios_version_supported  (evaluates to 13.4 on 0.73)
# Now must resolve to at least 15.1:
platform :ios, '15.1'
```

After modifying native iOS files:
```bash
cd ios && pod install && cd ..
```

**Option B: Migrate to Swift AppDelegate (0.77+ template default)**

The 0.77 template generates `AppDelegate.swift`. This option is viable but adds risk because the project has a `macromaker-Bridging-Header.h` and `noop-file.swift` already present (suggesting a historical mixed-language setup). Swift-C++ interoperability is explicitly flagged as unstable by the RN team. Stick with Option A.

### Phase 5: New Architecture Decision

**Verdict: Enable New Architecture, but use the interop layer initially.**

Starting with RN 0.76, the New Architecture is the default and the old architecture (Paper/Bridge) is on a deprecation path — it was removed entirely in 0.82. Running `newArchEnabled=false` is a short-term escape hatch, not a long-term strategy.

**How it works for this project:**

This app uses no custom native modules or components — all native code is in third-party libraries. The New Architecture ships with an automatic interoperability layer that bridges old-architecture libraries. Most apps "just work" after enabling it.

**Steps to enable:**

1. Set `newArchEnabled=true` in `android/gradle.properties`
2. Run `RCT_NEW_ARCH_ENABLED=1 bundle exec pod install` on iOS
3. Rebuild and test

**If a library breaks with New Architecture enabled:** Check [reactnative.directory](https://reactnative.directory) for the library's New Architecture support status. The primary risk in this project is `react-native-splash-screen` (unmaintained) and potentially `react-native-chart-kit`.

**Hermes:** Already enabled (`hermesEnabled=true`). Hermes is now bundled with each RN release and requires no additional configuration in 0.76+. The `hermesEnabled` flag in `gradle.properties` is still respected in 0.76-0.78 but the flag was removed from the template in 0.77 (Hermes is always on).

### Phase 6: Metro Config

The current `metro.config.js` already uses the correct 0.73+ pattern:

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const config = {};
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

No changes needed. The `@react-native/metro-config` package version in devDependencies (`^0.84.1`) will need to match the installed RN version — update it alongside `react-native`.

## Architectural Patterns

### Pattern 1: Use the Upgrade Helper for Every File Diff

**What:** The [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) generates a precise file-by-file diff between any two RN versions. It generates the diff against the RN template, which matches the expected state of generated files.

**When to use:** Before every hop in the two-hop strategy. Set the from/to versions, enter the package name (`com.carymeskell.macrotracker`) and app name, get the exact diff.

**Trade-offs:** The helper shows template files. If your files have project-specific customizations (this app's `AppDelegate.m` has custom deep-linking handlers), you must manually merge the template changes with your customizations rather than blindly applying the diff.

### Pattern 2: New Architecture via Interop Layer (Gradual)

**What:** Enable `newArchEnabled=true` and let the interoperability layer handle old-arch libraries. Do not rush to migrate everything to TurboModules/Fabric Components.

**When to use:** Right approach for this project — no custom native modules, so TurboModule migration is not applicable. The interop layer handles all third-party library bridging automatically.

**Trade-offs:** You get New Architecture rendering benefits without library rewrites. You do NOT get full concurrent React features (Suspense, Transitions) until all libraries are fully migrated. For a macro tracker app, concurrent features are not needed.

### Pattern 3: Hop Strategy Over Big Bang

**What:** Upgrade one or two minor versions at a time, build and test between each hop.

**When to use:** Always, for bare React Native apps with native code.

**Trade-offs:** Takes more time per version. Saves days of debugging by isolating which version introduced a specific breakage. RN patch releases within a minor are generally safe to jump across (e.g., 0.76.0 → 0.76.6 directly).

## Data Flow

### Upgrade Execution Order

```
1. Audit libraries (identify blockers BEFORE touching code)
         ↓
2. Replace/upgrade problem libraries (splash-screen, reanimated)
         ↓
3. Bump react-native + react in package.json
         ↓
4. Apply Android native file changes (build.gradle, MainApplication.java)
         ↓
5. Apply iOS native file changes (AppDelegate, Podfile)
         ↓
6. pod install && clean build
         ↓
7. Verify app runs on OLD arch (newArchEnabled=false)
         ↓
8. Enable New Architecture (newArchEnabled=true)
         ↓
9. Test all screens and flows
         ↓
10. Second hop to 0.78 (repeat steps 3-9 for smaller diff)
```

### Component Change Classification

```
JS-only changes (low risk, no build required):
  ├── package.json version bumps
  ├── React 19 API compatibility (propTypes removal check)
  └── metro.config.js (no changes needed)

Android native changes (medium risk, requires full rebuild):
  ├── android/build.gradle (minSdkVersion, kotlinVersion)
  ├── android/gradle.properties (newArchEnabled, hermesEnabled)
  ├── android/app/build.gradle (SoLoader import, remove Flipper)
  └── android/app/src/.../MainApplication.java (SoLoader.init call)

iOS native changes (higher risk, requires pod install + rebuild):
  ├── ios/macromaker/AppDelegate.h (new base class)
  ├── ios/macromaker/AppDelegate.mm (full rewrite from .m)
  └── ios/Podfile (platform version bump)
```

## Scaling Considerations

Not applicable — this is a local-only mobile app with no server scaling concerns. The architecture upgrade improves runtime performance rather than scale:

| Metric | 0.73 (Bridge) | 0.78 (New Arch) | Expected Delta |
|--------|---------------|-----------------|----------------|
| Cold start | Baseline | ~15% faster | SoLoader merge, Hermes improvements |
| JS-Native calls | Async bridge | Synchronous JSI | Smoother UI interactions |
| Memory usage | Baseline | ~20% reduction | Fabric renderer efficiency |
| App size (Android) | Baseline | ~3.8 MB smaller | libreactnative.so merge |

## Anti-Patterns

### Anti-Pattern 1: Jumping Directly from 0.73 to 0.78

**What people do:** Update `react-native` in `package.json` to `0.78.x`, run `pod install`, and try to build.

**Why it's wrong:** Five accumulated version boundary changes hit simultaneously. The SoLoader error, iOS AppDelegate incompatibility, minSdkVersion mismatch, and Kotlin version issue all appear at once with no way to isolate which is which.

**Do this instead:** Two-hop upgrade: 0.73 → 0.76, verify clean build, then 0.76 → 0.78.

### Anti-Pattern 2: Skipping the Pre-Upgrade Library Audit

**What people do:** Bump RN version first, then discover `react-native-splash-screen` is incompatible and blocks the build.

**Why it's wrong:** `react-native-splash-screen` 3.3.0 was last published 4 years ago. It does not support 0.75+ and actively breaks builds due to removed `android.support` APIs. Finding this after upgrading wastes time.

**Do this instead:** Replace `react-native-splash-screen` with `react-native-bootsplash` or a native-only implementation before starting the RN version upgrade. This library is the single highest-risk dependency in this project.

### Anti-Pattern 3: Keeping `SoLoader.init(this, false)`

**What people do:** Apply all other 0.76 changes but miss the SoLoader initialization change in `MainApplication.java`.

**Why it's wrong:** React Native 0.76 merges all native libraries into `libreactnative.so`. The `false` parameter tells SoLoader to use the old library loading strategy, which fails to find merged symbols and produces cryptic `UnsatisfiedLinkError` crashes on Android.

**Do this instead:** Import `OpenSourceMergedSoMapping` and use it as the second argument to `SoLoader.init()`.

### Anti-Pattern 4: Staying on Old Architecture Past 0.82

**What people do:** Set `newArchEnabled=false` and defer New Architecture adoption indefinitely.

**Why it's wrong:** The old Paper architecture was removed in RN 0.82. If you stay on `newArchEnabled=false` in 0.76-0.81 and later upgrade, you face the New Architecture migration AND the version upgrade simultaneously.

**Do this instead:** Enable New Architecture in 0.76/0.78 using the interop layer. The interop layer handles old-arch libraries automatically. Verify the app works on New Architecture now, while you have the fallback option.

### Anti-Pattern 5: Migrating AppDelegate to Swift When C++ Interop Is Unstable

**What people do:** Follow the 0.77 template default and convert `AppDelegate` to Swift.

**Why it's wrong:** The RN team explicitly warns that Swift-C++ interoperability is "not mature nor stable." While this project has no custom C++ modules, the `macromaker-Bridging-Header.h` indicates a mixed-language history. Swift migration adds risk with no benefit.

**Do this instead:** Stay on Objective-C++. Update `AppDelegate.mm` to inherit from `RCTAppDelegate`. This is fully supported and recommended for apps with any C++ or mixed-language history.

## Integration Points

### Library Compatibility Summary for This Project

| Library | Action Required | Notes |
|---------|----------------|-------|
| `react-native-splash-screen` | Replace before upgrade | Incompatible with 0.75+; use `react-native-bootsplash` |
| `react-native-reanimated` | Upgrade to 3.18.x | 3.6 is too old for New Architecture on 0.76+ |
| `react-native-svg` | No change (15.15.3 is current) | Already on correct version |
| `@react-native-async-storage/async-storage` | No change | Already New Arch compatible |
| `react-navigation` v6 packages | No change required | Works with RN 0.76-0.78; v7 is optional |
| `react-native-gesture-handler` | Upgrade to latest 2.x | Minor update, low risk |
| `react-native-screens` | Upgrade if needed | v3.x works; v4 only needed if adopting React Nav 7 |
| `react-native-vector-icons` | Check for v10.3.0 | v10 is entering legacy mode; functional but not New Arch native |
| `react-native-chart-kit` | Likely no change | JS-only library, no native code |
| `react-native-safe-area-context` | Upgrade if needed | Check peer deps after RN bump |
| `@rneui/themed` | Verify compatibility | Check 0.76+ support after upgrade |

### React Navigation: v6 Stay vs v7 Upgrade

This is a separate decision from the RN version upgrade. React Navigation v7 introduces breaking navigation API changes (nested screen navigation syntax changes) and requires `react-native-screens` v4. For the RN upgrade milestone, stay on v6 — it is compatible with RN 0.78. Upgrading to v7 is a separate milestone item.

## Sources

- [React Native 0.78 Release Blog](https://reactnative.dev/blog/2025/02/19/react-native-0.78) — HIGH confidence
- [React Native 0.77 Release Blog](https://reactnative.dev/blog/2025/01/21/version-0.77) — HIGH confidence
- [React Native 0.76 New Architecture Default](https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture) — HIGH confidence
- [New Architecture Landing Page](https://reactnative.dev/architecture/landing-page) — HIGH confidence
- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) — HIGH confidence (authoritative tool)
- [Reanimated Compatibility Table](https://docs.swmansion.com/react-native-reanimated/docs/3.x/guides/compatibility/) — HIGH confidence
- [React Navigation 7.0 Release](https://reactnavigation.org/blog/2024/11/06/react-navigation-7.0/) — HIGH confidence
- [react-native-splash-screen GitHub issues](https://github.com/crazycodeboy/react-native-splash-screen/issues/652) — MEDIUM confidence (community-reported)
- [react-native-svg Releases](https://github.com/software-mansion/react-native-svg/releases) — HIGH confidence

---
*Architecture research for: React Native 0.73.6 → 0.78.x upgrade, bare workflow*
*Researched: 2026-03-10*
