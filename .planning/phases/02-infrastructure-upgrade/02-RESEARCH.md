# Phase 2: Infrastructure Upgrade - Research

**Researched:** 2026-03-11
**Domain:** React Native 0.73→0.76 native layer migration, JS dependency upgrades, @rneui/themed → react-native-paper replacement
**Confidence:** HIGH (stack verified against official templates, migration guides, and official docs)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **@rneui/themed replacement:** Do it in Phase 2 — full replacement, not a minimal patch. Replace with `react-native-paper@5`. Functional parity only — swap Input → TextInput, SearchBar → Searchbar, ListItem → List.Item with matching behavior; no redesign, keep all existing styles/logic. Affected screens: BasicInfoScreen, MoreInfoScreen, AddFoodScreen, DietHistoryList (MacroInput component is a wrapper also affected).
- **PaperProvider placement:** Goes in App.tsx root alongside GestureHandlerRootView and SafeAreaProvider.
- **Theme:** Respects device color scheme — thread existing `useColorScheme()` result into PaperProvider so paper components follow the app's dark/light mode.
- **Native infrastructure — iOS:** Rewrite AppDelegate.mm inheriting from RCTAppDelegate. Update Podfile to platform iOS 15.1 using RN 0.76 template. Bootsplash `customizeRootView` hook currently uses Obj-C; replace with the RCTAppDelegate pattern.
- **Native infrastructure — Android:** Update MainApplication SoLoader init to OpenSourceMergedSoMapping. Update build.gradle — minSdk 24, Kotlin 2.0, updated Gradle. Enable `newArchEnabled=true` in gradle.properties.
- **JS dependency upgrades (exact targets from DEPS-MATRIX.md):**
  - React Navigation: @react-navigation/native 7.1.33, @react-navigation/stack 7.8.4, @react-navigation/bottom-tabs 7.15.5
  - react-native-screens: 4.24.0
  - react-native-safe-area-context: 5.7.0
  - react-native-reanimated: 4.2.2 + react-native-worklets peer dep
  - Babel plugin: `react-native-reanimated/plugin` → `react-native-worklets/plugin`
  - react-native-gesture-handler: 2.30.0
  - @react-native-async-storage/async-storage: 3.0.1
  - react-native-vector-icons: 10.3.0 (trim Info.plist to Ionicons.ttf, Feather.ttf, FontAwesome.ttf only)
- **RN version target for this phase:** 0.76.x (NOT 0.84.1 — that is Phase 3)
- **Verification:** iOS is the primary verification platform; Android is secondary

### Claude's Discretion
- Plan breakdown strategy (one coordinated plan vs. staged plans)
- React Navigation v7 API migration depth (minimum compat vs. adopt new patterns)
- Rollback/verification approach
- Exact react-native-paper theme configuration using existing Colors.ts

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NATV-01 | iOS AppDelegate.m fully rewritten to AppDelegate.mm inheriting from RCTAppDelegate | RN 0.76 template pattern documented; AppDelegate.m current state analyzed |
| NATV-02 | iOS Podfile updated to platform iOS 15.1 using new RN 0.76 template | RN 0.76 template Podfile structure researched; current Podfile analyzed |
| NATV-03 | Android MainApplication SoLoader init updated to OpenSourceMergedSoMapping | SoLoader change documented; current MainApplication.java analyzed |
| NATV-04 | Android build.gradle updated (minSdk 24, Kotlin 2.0, updated Gradle) | Current build.gradle analyzed; target values confirmed |
| NATV-05 | New Architecture enabled (newArchEnabled=true in gradle.properties) | Current gradle.properties shows newArchEnabled=false; change documented |
| NATV-06 | App builds and launches on iOS and Android at RN 0.76.x | Depends on NATV-01 through NATV-05 + JS upgrades completing correctly |
| JSDP-01 | React Navigation upgraded to v7 bundle | Breaking changes enumerated; navigation code analyzed |
| JSDP-02 | react-native-screens 4.24.0 and react-native-safe-area-context 5.7.0 installed | Required by Nav v7; no API-level changes needed |
| JSDP-03 | react-native-reanimated upgraded from 3.6.0 to 4.2.2 with react-native-worklets | Breaking changes enumerated; current usage analyzed (none of the removed APIs are used) |
| JSDP-04 | Reanimated Babel plugin updated to react-native-worklets/plugin | Confirmed — babel.config.js currently uses old path |
| JSDP-05 | @react-native-async-storage/async-storage upgraded 1.24.0 → 3.0.1 with API compat verified | utils.ts blast radius analyzed; callback on removeItem is a known risk |
| JSDP-06 | All existing animated/gesture code verified working after Reanimated 4 migration | App uses no removed Reanimated APIs; verification protocol documented |
</phase_requirements>

---

## Summary

Phase 2 is a coordinated multi-layer upgrade: native iOS/Android infrastructure must be rewired to support RN 0.76's New Architecture, and all JS dependencies must advance to their Phase 2 targets in lockstep. The native changes are mechanical file rewrites driven by the official RN 0.76 template — the AppDelegate must inherit from RCTAppDelegate, the Podfile moves to iOS 15.1, Android's SoLoader init gains OpenSourceMergedSoMapping, minSdk rises to 24, and `newArchEnabled=true` is set. All of these are one-way changes with no backward path.

The JS dependency layer has two areas of genuine migration complexity. First, react-native-reanimated 4.x requires New Architecture (which NATV-05 provides), moves worklets to a separate `react-native-worklets` package, and changes the Babel plugin path. Critically, none of the APIs removed in Reanimated 4 (`useAnimatedGestureHandler`, `combineTransition`, `useWorkletCallback`) appear anywhere in the macromaker codebase — the app uses only `useAnimatedStyle`/`withTiming`-level APIs which are fully backward-compatible. Second, @react-native-async-storage/async-storage 3.x drops callback-based APIs. `utils.ts:removeStoredData` currently passes a callback to `AsyncStorage.removeItem()` — this must be converted to a promise-based error handler before upgrading.

The @rneui/themed removal is a parallel workstream: five files need mechanical component swaps (Input → TextInput, SearchBar → Searchbar, ListItem → List.Item). React Native Paper's component APIs are close enough to the existing usage that the swaps are low-risk. The main styling adjustment is that Paper's TextInput doesn't have `containerStyle`/`inputContainerStyle` — those wrapper styles must move to a surrounding View.

**Primary recommendation:** Execute as three coordinated waves — (1) native infra + RN 0.76 bump, (2) JS dependency upgrades including AsyncStorage callback fix, (3) @rneui/themed replacement. Build-verify after each wave on iOS first.

---

## Standard Stack

### Core for This Phase

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native | 0.76.x | Runtime | Phase 2 target; enables New Architecture by default |
| react-native-reanimated | 4.2.2 | Animations | New Architecture mandatory; required for Gesture Handler 2.x |
| react-native-worklets | peer | Worklet runtime | Extracted from Reanimated 4; provides `react-native-worklets/plugin` |
| react-native-gesture-handler | 2.30.0 | Gesture system | New Arch compatible; GestureHandlerRootView already in App.tsx |
| @react-navigation/native | 7.1.33 | Navigation core | v7 locks in react-native-screens 4.x and safe-area-context 5.x |
| @react-navigation/stack | 7.8.4 | Stack navigator | JS-based stack; `cardStyle`, `presentation`, `gestureDirection` still valid in v7 |
| @react-navigation/bottom-tabs | 7.15.5 | Tab navigator | Required for bottom nav |
| react-native-screens | 4.24.0 | Native screen containers | Required by Nav v7; auto-linked |
| react-native-safe-area-context | 5.7.0 | Safe area insets | Required by Nav v7; SafeAreaProvider already in App.tsx |
| @react-native-async-storage/async-storage | 3.0.1 | Local storage | New Arch compatible; default export is backward-compatible singleton |
| react-native-paper | 5.x | UI components | Replaces @rneui/themed; stable, New Arch native, Material Design 3 |
| react-native-vector-icons | 10.3.0 | Icon fonts | Minor patch from 10.2.0; no API changes |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-native-bootsplash | 7.1.0 | Splash screen | Already installed (Phase 1); integrates via `customizeRootView` in RCTAppDelegate pattern |

---

## Architecture Patterns

### Recommended Project Structure

No structural changes — all changes are in-place file edits:

```
ios/
├── macromaker/AppDelegate.mm   ← REWRITE: RCTAppDelegate inheritance
├── macromaker/AppDelegate.h    ← REWRITE: import RCTAppDelegate
└── Podfile                      ← EDIT: platform 15.1, remove hermes_enabled flag

android/
├── build.gradle                 ← EDIT: kotlinVersion 2.0.x, minSdkVersion 24
├── gradle.properties            ← EDIT: newArchEnabled=true
└── app/src/.../MainApplication.java  ← EDIT: SoLoader.init OpenSourceMergedSoMapping

babel.config.js                  ← EDIT: plugin path to react-native-worklets/plugin

App.tsx                          ← EDIT: add PaperProvider

screens/InfoModal/screens/BasicInfoScreen.tsx   ← EDIT: @rneui Input → Paper TextInput
screens/InfoModal/screens/MoreInfoScreen.tsx    ← EDIT: @rneui Input → Paper TextInput
screens/AddFood/AddFoodScreen.tsx               ← EDIT: @rneui Input+SearchBar → Paper equivalents
screens/AddFood/components/MacroInput.tsx       ← EDIT: @rneui Input → Paper TextInput
screens/Diet/components/DietHistoryList.tsx     ← EDIT: @rneui ListItem → Paper List.Item

utils.ts                         ← EDIT: removeStoredData callback → promise pattern
```

### Pattern 1: RCTAppDelegate AppDelegate.mm (RN 0.76 template)

**What:** AppDelegate no longer manually creates RCTBridge/RCTRootView. It inherits from RCTAppDelegate and delegates all React Native lifecycle to the parent. The app only needs to provide `bundleURL` and `sourceURLForBridge`.

**When to use:** Required for RN 0.76+ with New Architecture.

```objc
// Source: https://github.com/react-native-community/template/blob/0.76-stable/template/ios/HelloWorld/AppDelegate.mm
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"main";
  self.initialProps = @{};
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// BootSplash: override customizeRootView on RCTAppDelegate
- (void)customizeRootView:(RCTRootView *)rootView
{
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView];
}

@end
```

**AppDelegate.h rewrite:**

```objc
// Source: https://github.com/react-native-community/template/blob/0.76-stable/template/ios/HelloWorld/AppDelegate.h
#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : RCTAppDelegate
@end
```

Key differences from the current file:
- `AppDelegate` inherits from `RCTAppDelegate` (not `UIResponder`)
- No `UIWindow *window` property (RCTAppDelegate owns the window)
- No `RCTBridgeDelegate` protocol in header
- `application:didFinishLaunchingWithOptions:` now calls `[super ...]`; no manual bridge/rootView construction
- `customizeRootView:` is still a valid override hook on `RCTAppDelegate` — the existing `RNBootSplash.initWithStoryboard:rootView:` call stays

### Pattern 2: Android SoLoader Migration

**What:** `SoLoader.init(this, false)` must become `SoLoader.init(this, new OpenSourceMergedSoMapping())` (Java syntax). Required to load `libreactnative.so`, the merged native library introduced in RN 0.76.

```java
// Source: https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture
import com.facebook.react.soloader.OpenSourceMergedSoMapping;
import com.facebook.soloader.SoLoader;

// In onCreate():
SoLoader.init(this, new OpenSourceMergedSoMapping());
// was: SoLoader.init(this, false);
```

Note: The template uses Kotlin syntax without `new`; the existing project uses Java, so `new OpenSourceMergedSoMapping()` is correct.

### Pattern 3: Podfile (RN 0.76 template)

**What:** Update platform target, remove the `hermes_enabled: false` flag (Hermes is default in RN 0.73+; this flag is a no-op and confusing).

```ruby
# Source: react-native-community/template 0.76-stable
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '15.1'

target 'macromaker' do
  use_native_modules!
  use_react_native!(
    :path => "../node_modules/react-native"
    # hermes_enabled removed — Hermes is the default since RN 0.73
  )
end
```

### Pattern 4: react-native-paper PaperProvider in App.tsx

**What:** PaperProvider wraps the app root alongside existing providers, receives a theme driven by `useColorScheme()`.

```tsx
// Source: http://oss.callstack.com/react-native-paper/docs/guides/theming/
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';

export default function App() {
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <HistoryProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </HistoryProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
```

### Pattern 5: @rneui/themed → react-native-paper Component Swaps

**Input → TextInput:**

```tsx
// BEFORE (rneui):
import { Input } from '@rneui/themed';
<Input
  containerStyle={styles.input}
  inputContainerStyle={styles.inputContainer}
  onChangeText={setMealName}
  value={mealName}
  placeholder="Meal Name"
/>

// AFTER (react-native-paper):
import { TextInput } from 'react-native-paper';
// containerStyle/inputContainerStyle do not exist on Paper TextInput.
// Wrap in a View for container-level styling.
<View style={styles.input}>
  <TextInput
    mode="flat"
    onChangeText={setMealName}
    value={mealName}
    placeholder="Meal Name"
  />
</View>
```

**SearchBar → Searchbar:**

```tsx
// BEFORE (rneui):
import { SearchBar } from '@rneui/themed';
<SearchBar
  lightTheme={true}
  placeholder="Broccoli, pizza, etc"
  onChangeText={(value: string) => setSearch(value)}
  value={search}
/>

// AFTER (react-native-paper):
import { Searchbar } from 'react-native-paper';
<Searchbar
  placeholder="Broccoli, pizza, etc"
  onChangeText={(value: string) => setSearch(value)}
  value={search}
/>
// lightTheme prop removed; Paper uses theme system automatically.
```

**ListItem → List.Item:**

```tsx
// BEFORE (rneui):
import { ListItem } from '@rneui/themed';
<ListItem bottomDivider onPress={onPress}>
  <ListItem.Content>
    <ListItem.Title>{dietHistoryDay.day}</ListItem.Title>
    <ListItem.Subtitle>{dietHistoryDay.date}</ListItem.Subtitle>
  </ListItem.Content>
  <ListItem.Chevron />
</ListItem>

// AFTER (react-native-paper):
import { List } from 'react-native-paper';
<List.Item
  title={dietHistoryDay.day}
  description={dietHistoryDay.date}
  right={props => <List.Icon {...props} icon="chevron-right" />}
  onPress={onPress}
  style={styles.listItemBorder}
/>
// bottomDivider → implement via borderBottomWidth style on the item or a Divider component
```

### Pattern 6: AsyncStorage 3.x — removeItem callback removal

**What:** The callback-based `removeItem` in `utils.ts` must be converted to promise style before upgrading to async-storage 3.x. The callback API was dropped.

```typescript
// BEFORE (utils.ts — broken in 3.x):
export const removeStoredData = async (key: string) => {
  const removedItem = await AsyncStorage.removeItem(key, (error) => {
    if (error) { console.error(`...`); }
  });
  return removedItem;
};

// AFTER (promise-based, 3.x compatible):
export const removeStoredData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error: Encountered an error while removing an item from AsyncStorage: ${error}`);
  }
};
```

**`setItem`, `getItem`, `getAllKeys`, `multiGet` on the default export remain unchanged.** The default export continues to function as a singleton v1/v2-compatible storage. The `storeData` and `getStoredData` helpers in utils.ts use promise/async-await patterns already — they require no changes. `getAllStoredData` uses `getAllKeys()` and `multiGet()` which are also unchanged.

Note: Async Storage 3.x also requires an additional Android setup step (documented at install time).

### Pattern 7: Reanimated 4 — Babel Plugin Update

```javascript
// babel.config.js — only change needed:
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: ['react-native-worklets/plugin'], // was: 'react-native-reanimated/plugin'
};
```

**No other Reanimated code changes required.** The macromaker codebase uses no removed Reanimated APIs:
- `useAnimatedGestureHandler` — NOT used (app uses React Navigation's built-in gesture handling)
- `combineTransition` — NOT used
- `useWorkletCallback` — NOT used
- `useScrollViewOffset` — NOT used
- `runOnJS` / `runOnUI` — NOT used directly
- `withSpring` — NOT used (no `restDisplacementThreshold`/`restSpeedThreshold` to change)

### Pattern 8: React Navigation v7 — Minimal Migration

The existing `navigation/index.tsx` uses these options in `Stack.Navigator.screenOptions`:
- `cardStyle` — still valid in v7
- `cardOverlayEnabled` — still valid in v7
- `gestureDirection` — still valid in v7
- `headerShown` — still valid in v7
- `presentation` — still valid in v7

**Only one breaking change applies to this codebase:** `animationEnabled` was removed. Scan for `animationEnabled: false` usage — replace with `animation: 'none'`. The current `navigation/index.tsx` does not use `animationEnabled`, so no changes may be needed.

Check: `navigation.dangerouslyGetParent()` — if used anywhere, replace with `navigation.getParent()`. Grep confirms this is not present.

### Anti-Patterns to Avoid

- **Upgrading RN to 0.84.1 in this phase.** Phase 2 targets 0.76.x only. RN 0.84.1 is Phase 3.
- **Enabling New Architecture without the SoLoader change.** Android build will fail with "cannot find symbol: OpenSourceMergedSoMapping".
- **Leaving `hermes_enabled: false` in Podfile.** This flag is a no-op in RN 0.73+; it signals outdated config and should be removed.
- **Using old AppDelegate.h interface style.** The `RCTBridgeDelegate` protocol and `UIWindow *window` property in AppDelegate.h are replaced by RCTAppDelegate's internals.
- **Using `new DefaultReactNativeHost` pattern from current MainApplication.java.** The Java file already has this pattern correct — only the SoLoader line needs to change.
- **Setting `newArchEnabled=true` before the native layer is migrated.** Enable it only after NATV-01 through NATV-04 are complete.
- **Installing react-native-paper without PaperProvider at root.** Components will crash with "No Provider" errors without the provider.
- **Applying `containerStyle`/`inputContainerStyle` directly to Paper TextInput.** These props don't exist; use a wrapping View.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dark/light theme for Paper | Custom theme object from scratch | `MD3DarkTheme` / `MD3LightTheme` from react-native-paper | Material Design 3 tokens already correct; just pass to PaperProvider |
| ListItem dividers | Custom divider View | `<Divider />` from react-native-paper, or `borderBottomWidth` on `List.Item` style | Paper has a Divider component already |
| Chevron icon in List.Item | Custom chevron component | `List.Icon` with `icon="chevron-right"` | Built-in; uses RNVI under the hood |
| Navigation theme adaptation | Custom color mapping | `adaptNavigationTheme` from react-native-paper | Converts Paper MD3 theme to React Navigation-compatible theme if nav theming is needed |
| iOS bundle URL logic | Manual `#ifdef DEBUG` guards | The RCTAppDelegate `bundleURL` method pattern | Standard template; tested by thousands of apps |

---

## Common Pitfalls

### Pitfall 1: SoLoader import missing in Java
**What goes wrong:** Build error "cannot find symbol: OpenSourceMergedSoMapping" on Android.
**Why it happens:** The import for `com.facebook.react.soloader.OpenSourceMergedSoMapping` is forgotten while only changing the `init()` call.
**How to avoid:** Add import AND update init call in MainApplication.java simultaneously.
**Warning signs:** Android build fails with symbol error after setting newArchEnabled=true.

### Pitfall 2: newArchEnabled=true set before native infra is ready
**What goes wrong:** App crashes at launch with native bridge errors.
**Why it happens:** New Architecture requires the matching AppDelegate/Podfile/SoLoader changes to be in place first.
**How to avoid:** Enable `newArchEnabled=true` only after NATV-01, NATV-02, NATV-03, NATV-04 are all complete and the app builds.

### Pitfall 3: AsyncStorage 3.x — removeItem callback
**What goes wrong:** `utils.ts:removeStoredData` passes a callback to `AsyncStorage.removeItem()`. In async-storage 3.x, callback-based APIs were dropped entirely. The build or runtime will fail.
**Why it happens:** The v1 API accepted optional callbacks; v3 drops them as a clean break.
**How to avoid:** Convert `removeStoredData` to promise/try-catch pattern BEFORE running `npm install` with the new version. Verify in `__tests__/utils.test.ts`.
**Warning signs:** TypeScript type error on `removeItem` after upgrade; or silent failure/crash at runtime on delete operations.

### Pitfall 4: react-native-worklets not installed alongside Reanimated 4
**What goes wrong:** Metro bundler throws "cannot resolve react-native-worklets/plugin" at startup.
**Why it happens:** Reanimated 4 extracted worklets into a separate peer dependency package.
**How to avoid:** Install `react-native-worklets` as a dependency alongside `react-native-reanimated@4.2.2`.
**Warning signs:** Metro error on startup after Reanimated upgrade.

### Pitfall 5: Reanimated 4 requires New Architecture — order matters
**What goes wrong:** Reanimated 4 will not function in Legacy Architecture (bridge) mode. If installed before `newArchEnabled=true` is set and native infra is wired up, the app will fail.
**Why it happens:** Reanimated 4 removed Legacy Architecture support entirely.
**How to avoid:** Install Reanimated 4 only after New Architecture is verified working (NATV-06 passed).

### Pitfall 6: react-native-svg@15.15.3 Android build broken at RN 0.73
**What goes wrong:** Android build fails at the current RN 0.73.6 due to `BaseReactPackage` not in the 0.73 Android API.
**Why it happens:** react-native-svg 15.x uses an API available from RN 0.76+ only.
**How to avoid:** This resolves automatically when RN is upgraded to 0.76 in this phase. Do NOT attempt to downgrade react-native-svg to work around it.
**Warning signs:** If trying to build Android before the RN version bump — expected; proceed with iOS-first verification.

### Pitfall 7: Paper TextInput containerStyle / inputContainerStyle
**What goes wrong:** TypeScript errors or unexpected layout when porting RNEUI Input styles.
**Why it happens:** RNEUI Input had `containerStyle` (outer view), `inputContainerStyle` (input wrapper), `inputStyle`. Paper TextInput has `style` (on the input itself), `contentStyle`, `outlineStyle`.
**How to avoid:** Move outer container styles to a wrapping `<View>`. Use Paper's `style` for input-level overrides. Check all five affected files for these prop usages.

### Pitfall 8: @react-native-community/cli now a separate dev dependency in RN 0.76
**What goes wrong:** `npx react-native run-ios` may fail after bumping RN.
**Why it happens:** Starting in 0.76, `@react-native-community/cli` is no longer a direct dependency of react-native and must be added explicitly.
**How to avoid:** Add `@react-native-community/cli`, `@react-native-community/cli-platform-android`, `@react-native-community/cli-platform-ios` as devDependencies at target version 15.x.

### Pitfall 9: Info.plist UIAppFonts — extra fonts trigger bundle bloat
**What goes wrong:** App bundles all 15 RNVI font families (current state) but only uses 3.
**Why it happens:** Info.plist was never trimmed after initial RNVI install.
**How to avoid:** During the `pod install` for this phase, trim Info.plist `UIAppFonts` array to: `Ionicons.ttf`, `Feather.ttf`, `FontAwesome.ttf` only.

### Pitfall 10: React Navigation v7 nested navigation behavior change
**What goes wrong:** `navigation.navigate('ScreenInNestedNavigator')` no longer automatically traverses nested navigators.
**Why it happens:** V7 changed default nested navigation behavior.
**How to avoid:** The macromaker navigation structure is shallow — root stack + bottom tab + diet stack. Verify that all `navigation.navigate()` calls target screens within the current navigator's scope. If cross-navigator navigation is needed, use `navigation.navigate(ParentName, { screen: ChildName })` syntax or enable `navigationInChildEnabled` on NavigationContainer during migration.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual RCTBridge creation in AppDelegate | RCTAppDelegate inheritance; just provide `bundleURL` | RN 0.71 (stable in 0.76) | Removes ~30 lines of boilerplate from AppDelegate |
| AppDelegate.m (Obj-C) | AppDelegate.mm (Obj-C++) or AppDelegate.swift | RN 0.71+ | .mm required for C++ interop in New Architecture |
| `SoLoader.init(this, false)` | `SoLoader.init(this, new OpenSourceMergedSoMapping())` | RN 0.76 | Enables merged libreactnative.so; 3.8MB smaller, 15ms faster startup |
| `react-native-reanimated/plugin` Babel plugin | `react-native-worklets/plugin` | Reanimated 4.0 | Worklet runtime is now a separate package |
| @rneui/themed (RC release, inactive) | react-native-paper 5 (stable, Material Design 3) | Phase 2 decision | Removes React 18.3 peer dep conflict; gains New Arch support |
| AsyncStorage callback API | Promise/async-await only | async-storage 3.0 | `removeItem(key, callback)` signature removed |
| `platform :ios, '13.4'` | `platform :ios, '15.1'` | RN 0.76 requirement | Required minimum SDK for RN 0.76 |

**Deprecated/outdated in this phase:**
- `hermes_enabled: false` in Podfile: flag is a no-op since RN 0.73; remove it
- `AppDelegate.h` interface with `UIWindow *window` and `RCTBridgeDelegate`: replaced by RCTAppDelegate's interface
- `newArchEnabled=false` in gradle.properties: flip to `true` after native infra is ready

---

## Open Questions

1. **AsyncStorage 3.x Android extra setup step**
   - What we know: The 3.0.0 release notes mention "an extra installation step required for Android"
   - What's unclear: The exact step (likely a module init call or ProGuard rule) was not surfaced in research
   - Recommendation: After `npm install`, check the official async-storage docs at https://react-native-async-storage.github.io/ for the Android-specific setup step before running Android build

2. **react-native-paper ListItem — bottomDivider equivalent**
   - What we know: `List.Item` does not have a `bottomDivider` prop; Paper has a separate `<Divider />` component
   - What's unclear: Whether `borderBottomWidth` on the item style or a separate `<Divider />` component between list items is the cleaner approach
   - Recommendation: Use `<Divider />` after each `List.Item` in the `FlatList` renderItem for exact visual parity with the RNEUI ListItem behavior

3. **Kotlin version for Android build.gradle**
   - What we know: RN 0.76 template uses `kotlinVersion = "1.9.24"` (from research); the user decision says "Kotlin 2.0"
   - What's unclear: Whether RN 0.76's Gradle plugin is Kotlin 2.0-compatible (Kotlin 2.0 requires careful Gradle plugin compat)
   - Recommendation: Use `kotlinVersion = "1.9.24"` for the RN 0.76 step (matching the official template); Kotlin 2.0 can be adopted in Phase 3 when moving to RN 0.84.1 which ships with Kotlin 2.0 support. Flag this for user confirmation before executing.

4. **react-native-worklets exact version**
   - What we know: `react-native-reanimated@4.2.2` requires `react-native-worklets` as a peer dep
   - What's unclear: The exact peer dep version spec — whether it's automatically installed via npm or must be explicitly specified
   - Recommendation: Check `node_modules/react-native-reanimated/package.json` peerDependencies after install to confirm the exact worklets version required; install it explicitly

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest (react-native preset) |
| Config file | `package.json` (jest key), no separate jest.config file |
| Quick run command | `npx jest --testPathPattern=utils` |
| Full suite command | `npm run test:single` (runs all, no watch) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| JSDP-05 | AsyncStorage removeStoredData works after 3.x upgrade | unit | `npx jest __tests__/utils.test.ts -t "removeStoredData"` | ❌ Wave 0 — test for removeStoredData missing |
| JSDP-05 | storeData / getStoredData / getAllStoredData API compatibility | unit | `npx jest __tests__/utils.test.ts` | Partial — utils.test.ts exists but only tests pure functions; no storage helper tests |
| JSDP-06 | Animated/gesture interactions work after Reanimated 4 | manual | launch on iOS simulator, exercise graph interactions and navigation gestures | Manual only — no automated Reanimated test |
| NATV-06 | App builds and launches on iOS | manual/smoke | `npm run ios` | Manual only |
| NATV-06 | App builds and launches on Android | manual/smoke | `npm run android` | Manual only |

### Sampling Rate

- **Per task commit:** `npx jest __tests__/utils.test.ts` (covers utils blast radius for JSDP-05)
- **Per wave merge:** `npm run test:single` (full suite)
- **Phase gate:** Full suite green + manual iOS launch smoke test before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `__tests__/utils.test.ts` — add `removeStoredData` test covering: (a) successful remove returns without error, (b) mock confirms `AsyncStorage.removeItem` called with correct key. Uses existing `@react-native-async-storage/async-storage/jest/async-storage-mock` mock already configured.

---

## Sources

### Primary (HIGH confidence)

- `react-native-community/template` 0.76-stable — AppDelegate.mm and Podfile template patterns
- https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture — SoLoader change, minSdk 24, iOS 15.1 requirement, cli as separate devDep
- https://reactnavigation.org/docs/upgrading-from-6.x/ — React Navigation v7 breaking changes (cardStyle/presentation/gestureDirection unchanged; animationEnabled removed)
- https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/ — Reanimated 4 removed APIs enumerated
- http://oss.callstack.com/react-native-paper/docs/guides/theming/ — PaperProvider dark/light theme setup
- http://oss.callstack.com/react-native-paper/docs/components/TextInput/ — TextInput props (mode, onChangeText, value, contentStyle)
- http://oss.callstack.com/react-native-paper/docs/components/Searchbar/ — Searchbar props (onChangeText, value, placeholder)

### Secondary (MEDIUM confidence)

- https://github.com/react-native-async-storage/async-storage/releases/tag/@react-native-async-storage/async-storage@3.0.0 — v3 drops callback APIs; default export is singleton; 3.0.1 is the usable release
- https://github.com/react-native-async-storage/async-storage/issues/1221 — v3 design intent: "API compatible with Web Storage API"; confirms incremental migration path
- https://github.com/zoontek/react-native-bootsplash — bootsplash 7.x integration with RCTAppDelegate (Swift pattern shown; Obj-C equivalent is same customizeRootView override)

### Tertiary (LOW confidence)

- Multiple WebSearch results confirming SoLoader OpenSourceMergedSoMapping syntax for Java (Kotlin template found; Java equivalent inferred)
- Kotlin version recommendation (2.0 per user decision vs 1.9.24 per template) — flagged as Open Question #3

---

## Metadata

**Confidence breakdown:**
- Native infrastructure patterns: HIGH — official template files located and contents verified
- React Navigation v7 breaking changes: HIGH — official upgrade guide fetched and analyzed against current nav code
- Reanimated 4 migration: HIGH — official migration guide fetched; confirmed no removed APIs in use
- react-native-paper component API: HIGH — official docs fetched for all three component types
- AsyncStorage 3.x callback removal: MEDIUM — confirmed from release notes; exact v3 default export method signatures not fully enumerated (only "callbacks dropped" and "default export is backward-compat singleton" confirmed)
- Kotlin version (2.0 vs 1.9.24): LOW — user specified 2.0 but RN 0.76 template uses 1.9.24; flagged as Open Question

**Research date:** 2026-03-11
**Valid until:** 2026-06-11 (stable libraries; 90 days)
