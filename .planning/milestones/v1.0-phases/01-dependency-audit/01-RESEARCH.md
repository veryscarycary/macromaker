# Phase 1: Dependency Audit - Research

**Researched:** 2026-03-10
**Domain:** npm dependency compatibility audit for React Native New Architecture (Fabric/TurboModules)
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Replace `react-native-splash-screen` with `react-native-bootsplash@7.1.0`
- Splash screen style: static logo only (no animation, no Lottie)
- Match existing visual output — app logo on background, fast dismiss on app load
- Produce `.planning/DEPS-MATRIX.md` — markdown table with: library name, current version, target version, New Arch compatible (yes/no/pending), notes
- DEPS-MATRIX.md must be complete and committed before Phase 2 begins (satisfies DEPS-03)

### Claude's Discretion
- Specific splash screen image/asset to use (use existing app assets if available)
- Whether to remove `react-native-chart-kit` now vs. in Phase 2 (whichever is cleaner)
- Exact format of DEPS-MATRIX.md
- Which other libraries (if any) should be evaluated for replacement using the same criteria: old/sunsetting, not New Arch compatible, or better alternatives exist

### Deferred Ideas (OUT OF SCOPE)
- Navigation v7 API changes — Phase 2 scope
- Reanimated 4 API migration (runOnJS/runOnUI renames) — Phase 2 scope
- AsyncStorage 3.x changelog verification — Phase 2 pre-work (flagged in STATE.md)
- @rneui/themed → react-native-paper actual component replacement — Phase 2 scope (audit only in Phase 1)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DEPS-01 | All npm dependencies audited for New Architecture (Fabric/TurboModules) compatibility | Full dependency-by-dependency breakdown below; confirmed blockers, safe libs, and target versions |
| DEPS-02 | `react-native-splash-screen` replaced with `react-native-bootsplash@7.1.0` | Native integration points mapped: AppDelegate.m, Info.plist (UILaunchStoryboardName), Android MainActivity; bootsplash CLI generates storyboard + drawable assets |
| DEPS-03 | Target versions locked for all libraries before any RN version bump begins | DEPS-MATRIX.md content specified in Architecture Patterns section; all target versions confirmed from STACK.md research |
</phase_requirements>

---

## Summary

Phase 1 is a **pure audit and one replacement** — no RN version bump, no native template changes. The only native change allowed this phase is removing `react-native-splash-screen` and installing `react-native-bootsplash@7.1.0`, because that replacement must happen before any version bump attempt (the library is completely dead and will not build against New Architecture).

A critical finding uncovered during research: **`react-native-chart-kit` IS actively used** via `components/MacroGraph.tsx`, which renders a `PieChart` component on `DailyDietScreen` and `DietHistoryScreen`. The CONTEXT.md assumed it might be removable, but it covers active functionality not handled by the custom D3 components. The library is confirmed unmaintained (last npm release 4+ years ago) and explicitly flagged as not supporting New Architecture in the React Native Directory. This library must be either replaced or a replacement plan documented before it becomes a Phase 2 blocker.

The `@rneui/themed` audit confirms usage in 4 files: `BasicInfoScreen`, `MacroInput`, `AddFoodScreen` (Input + SearchBar), and `DietHistoryList` (ListItem). The evaluation of `react-native-paper` v5 as a replacement is in scope for Phase 1 audit; actual migration is Phase 2.

**Primary recommendation:** Execute the bootsplash replacement, audit every dependency into DEPS-MATRIX.md, and make a documented decision on `react-native-chart-kit` (replace with SVG-based pie or defer with a risk note). Do not touch the RN version or any other native file.

---

## Standard Stack

### Confirmed Blocking Libraries (must change)

| Library | Current | Status | Action |
|---------|---------|--------|--------|
| `react-native-splash-screen` | 3.3.0 | Dead (4 years no updates), not New Arch compatible | Replace with `react-native-bootsplash@7.1.0` |
| `react-native-chart-kit` | 6.12.0 | Unmaintained, not New Arch compatible (confirmed RN Directory) | Replace PieChart in MacroGraph.tsx with SVG-based alternative, OR document plan in DEPS-MATRIX.md |

### Confirmed Safe Libraries (no action needed)

| Library | Current | Target | New Arch | Notes |
|---------|---------|--------|----------|-------|
| `d3` | 5.15.1 | 5.15.1 | N/A | Pure JS, no native code |
| `d3-scale` | 3.2.1 | 3.2.1 | N/A | Pure JS, no native code |
| `lodash` | 4.17.21 | 4.17.21 | N/A | Pure JS, no native code |
| `dayjs` | 1.11.13 | 1.11.13 | N/A | Pure JS, no native code |
| `uuid` | 9.0.1 | 9.0.1 | N/A | Pure JS, no native code |
| `execa` | 5.1.1 | 5.1.1 | N/A | Pure JS, dev tooling |
| `react-native-svg` | 15.15.3 | 15.15.3 | YES | Already latest; note LOW-confidence report of RCTImage issue in RN 0.84; monitor in Phase 3 |
| `react-native-gesture-handler` | 2.14.0 | 2.30.0 | YES | Minor bump; New Arch supported in 2.x |
| `react-native-get-random-values` | 1.11.0 | 1.11.0 | YES | Small native shim; maintained |

### Libraries Needing Major Version Upgrades (Phase 2, document targets now)

| Library | Current | Target | New Arch | Risk |
|---------|---------|--------|----------|------|
| `@react-navigation/native` | 6.1.18 | 7.1.33 | YES | API changes; Phase 2 |
| `@react-navigation/stack` | 6.4.1 | 7.8.4 | YES | Option renames; Phase 2 |
| `@react-navigation/bottom-tabs` | 6.6.1 | 7.15.5 | YES | Option renames; Phase 2 |
| `react-native-screens` | 3.23.0 | 4.24.0 | YES | Required by Nav v7; Phase 2 |
| `react-native-safe-area-context` | 4.14.0 | 5.7.0 | YES | Required by Nav v7; Phase 2 |
| `react-native-reanimated` | 3.6.0 | 4.2.2 | YES (mandatory) | Breaking API changes; Phase 2 |
| `@react-native-async-storage/async-storage` | 1.24.0 | 3.0.1 | YES | API changes; Phase 2 |
| `react-native-vector-icons` | 10.2.0 | 10.3.0 | YES | Minor bump; font registration must be resolved |

### Libraries Under Evaluation (audit scope)

| Library | Current | Evaluation | Recommendation |
|---------|---------|------------|----------------|
| `@rneui/themed` | 4.0.0-rc.8 | Not stable; peer dep issues with React 18.3.x; v5 beta not stable | Keep rc.8 through Phase 1; document Phase 2 migration plan to `react-native-paper@5` |
| `react-native-chart-kit` | 6.12.0 | Unmaintained; not New Arch compatible; CONFIRMED active use in MacroGraph.tsx | Replace PieChart with custom SVG implementation (reuse existing react-native-svg + D3 pattern already in codebase) or `react-native-gifted-charts` |

### Replacement Library: react-native-bootsplash

| Property | Value |
|----------|-------|
| Package | `react-native-bootsplash` |
| Target version | `7.1.0` |
| New Arch compatible | YES (actively maintained, explicitly supports New Architecture) |
| CLI asset generation | `npx react-native-bootsplash generate <logo.png> --platforms=android,ios` |
| iOS integration | Override `customize` method in AppDelegate (Swift) or `customizeRootView` (Obj-C) |
| Android integration | `RNBootSplash.init(this, R.style.BootTheme)` in `MainActivity.kt`'s `onCreate` |
| JS API | `BootSplash.hide()` — called in app root component after initial data load |

---

## Architecture Patterns

### Recommended Project Structure for Phase 1

No new directories needed. Phase 1 produces two artifacts:
```
.planning/
└── DEPS-MATRIX.md           # All dependencies audited with target versions

ios/macromaker/
├── BootSplash.storyboard    # Generated by bootsplash CLI (replaces SplashScreen.storyboard)
└── Info.plist               # UILaunchStoryboardName changed from SplashScreen → BootSplash

android/app/src/main/res/
└── values/bootsplash.xml    # Generated by bootsplash CLI (theme definition)

components/
└── MacroGraph.tsx           # Updated to remove react-native-chart-kit dependency
```

### Pattern 1: bootsplash iOS Integration (current AppDelegate style)

The current `AppDelegate.m` uses the pre-0.74 Objective-C bridge pattern (`RCTBridge` + `RCTRootView`). This Objective-C file will be fully replaced in Phase 2 when native templates are migrated. For Phase 1, the bootsplash integration in `AppDelegate.m` uses `customizeRootView`:

```objc
// In AppDelegate.m — add after existing imports
#import "RNBootSplash.h"

// Add this method to AppDelegate implementation
- (void)customizeRootView:(RCTRootView *)rootView {
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView];
}
```

Note: The current `AppDelegate.m` does NOT already call `react-native-splash-screen` — the old library was likely integrated via auto-linking and the Podfile only (confirmed by reading the file). This simplifies removal.

### Pattern 2: bootsplash Android Integration

The current `MainActivity.java` must have `RNBootSplash.init` added to `onCreate`:

```java
// In MainActivity.java — add import
import com.zoontek.rnbootsplash.RNBootSplash;

// In onCreate, BEFORE super.onCreate():
@Override
protected void onCreate(Bundle savedInstanceState) {
    RNBootSplash.init(this, R.style.BootTheme);
    super.onCreate(savedInstanceState);
}
```

### Pattern 3: bootsplash JS dismiss

```typescript
// In App.tsx or root navigator, after initial storage check
import BootSplash from 'react-native-bootsplash';

// Hide once JS is ready (replaces old SplashScreen.hide())
useEffect(() => {
  BootSplash.hide({ fade: true });
}, []);
```

### Pattern 4: MacroGraph.tsx PieChart Replacement

The existing `MacroGraph.tsx` uses `PieChart` from `react-native-chart-kit`. The app already uses `react-native-svg` for three custom graph components. The simplest New Architecture-compatible replacement is a custom SVG pie chart using the same library already present:

```typescript
// Custom PieChart using react-native-svg (already a dependency)
import { Svg, Path, G } from 'react-native-svg';
// D3 arc generator for slice path calculation
import { pie, arc } from 'd3';
```

This approach adds zero new dependencies and stays consistent with `BarGraph.tsx`, `MealTimeGraph.tsx`, and `TotalCaloriesGraph.tsx`.

**Alternative:** `react-native-gifted-charts` (v1.4.57, actively maintained, New Architecture compatible, verified working with react-native-svg). Adds a new dependency but provides a richer component API if the custom SVG approach is not preferred.

### Pattern 5: DEPS-MATRIX.md Format

```markdown
# Dependency Matrix

| Library | Current | Target | New Arch | Action | Notes |
|---------|---------|--------|----------|--------|-------|
| react-native | 0.73.6 | 0.84.1 | YES | Phase 3 | Two-hop: 0.73→0.76→0.84 |
| react-native-splash-screen | 3.3.0 | REMOVED | NO | Phase 1: replace | Replace with react-native-bootsplash@7.1.0 |
| react-native-bootsplash | — | 7.1.0 | YES | Phase 1: install | Splash screen replacement |
...
```

### Anti-Patterns to Avoid

- **Touching the RN version this phase:** Phase 1 ends with package.json still at `react-native@0.73.6`. The matrix documents targets; the bump happens in Phase 3.
- **Running `pod install` after only removing splash-screen from package.json:** Must also update Podfile to remove any explicit reference to `react-native-splash-screen` pod, AND update `AppDelegate.m` to add bootsplash hooks before running pod install.
- **Assuming react-native-chart-kit can stay until later:** It is confirmed not New Arch compatible. If it stays, Phase 3 (where New Architecture is enabled) will break. The decision must be made and documented now.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Splash screen native integration | Custom native module | `react-native-bootsplash@7.1.0` | Handles asset scaling, storyboard, Android theme, and dark mode automatically via CLI |
| Pie chart | New native chart library | Custom SVG with `react-native-svg` + D3 `pie`/`arc` | react-native-svg already installed; keeps zero new dependencies; consistent with existing graph pattern |
| Dependency compatibility checking | Manual npm research | [React Native Directory](https://reactnative.directory/) New Architecture filter | Authoritative community-maintained compatibility data |

---

## Common Pitfalls

### Pitfall 1: AppDelegate.m Does Not Currently Call SplashScreen (confirmed)

**What goes wrong:** Assuming the AppDelegate needs a SplashScreen call removed before adding bootsplash. Reading the actual file confirms it does NOT call `RNSplashScreen` — the library was only wired through auto-linking. The integration point is purely the Podfile and Android PackageList.

**How to avoid:** Add bootsplash to `AppDelegate.m` (insert `customizeRootView` method), uninstall old package, pod install. No existing AppDelegate code to remove.

**Warning signs:** If bootsplash storyboard does not appear on first launch — check that `UILaunchStoryboardName` in `Info.plist` was updated from `SplashScreen` to `BootSplash`.

### Pitfall 2: Info.plist UILaunchStoryboardName Must Be Updated

**What goes wrong:** `Info.plist` currently has `UILaunchStoryboardName = SplashScreen`. The bootsplash CLI generates `BootSplash.storyboard`. If `Info.plist` is not updated, the old storyboard is shown (or a blank screen if the old `.storyboard` is deleted).

**How to avoid:** After `npx react-native-bootsplash generate`, update `Info.plist` key `UILaunchStoryboardName` from `SplashScreen` to `BootSplash`.

### Pitfall 3: Info.plist UIAppFonts Has All 15 Vector Icon Fonts

**What goes wrong:** `Info.plist` currently lists ALL 15 `react-native-vector-icons` font files under `UIAppFonts`, including many not used by the app (AntDesign, Entypo, EvilIcons, Foundation, etc.). This is safe for now but will cause a "double registration" pitfall in Phase 2 when pod install starts copying fonts automatically.

**How to avoid:** Note this in DEPS-MATRIX.md. The font registration cleanup (keep only Ionicons, Feather, FontAwesome which CLAUDE.md confirms are actually used) should be done during Phase 2's pod-install work, not Phase 1.

### Pitfall 4: SoLoader.init Still Uses False (Android)

**What goes wrong:** `MainApplication.java` currently has `SoLoader.init(this, false)` — the pre-0.76 pattern. This is NOT a Phase 1 problem (Phase 1 does not bump the RN version), but it must be documented clearly in DEPS-MATRIX.md so Phase 2 addresses it immediately.

**How to avoid:** Document in DEPS-MATRIX.md notes column: "SoLoader.init must change to OpenSourceMergedSoMapping before building against RN 0.76+".

### Pitfall 5: react-native-chart-kit Removal Requires MacroGraph Replacement

**What goes wrong:** Removing `react-native-chart-kit` from `package.json` without updating `components/MacroGraph.tsx` breaks the import. `MacroGraph` is rendered in `DailyDietScreen` and `DietHistoryScreen` — two critical screens.

**How to avoid:** Replace the `PieChart` import and implementation in `MacroGraph.tsx` before removing the package. The custom SVG pie approach requires D3's `pie` and `arc` generators — both already available via `d3@5.15.1`. Verify that `DailyDietScreen` and `DietHistoryScreen` still render correctly after the swap.

---

## Code Examples

### bootsplash asset generation

```bash
# Source: https://github.com/zoontek/react-native-bootsplash
# Run after npm install react-native-bootsplash@7.1.0
npx react-native-bootsplash generate ios/macromaker/Images.xcassets/SplashScreen.imageset/image.png \
  --platforms=android,ios \
  --background=#ffffff \
  --logo-width=150
```

The existing `SplashScreen.imageset/image.png` is the app logo — use it as the source asset for bootsplash generation.

### Custom SVG PieChart (no new dependencies)

```typescript
// Source: D3 pie/arc API (d3@5.15.1 already installed)
import { pie, arc } from 'd3';
import { Svg, Path, G } from 'react-native-svg';

const pieGenerator = pie().value((d: any) => d.percentage);
const arcGenerator = arc().innerRadius(0).outerRadius(100);
// Renders slices as <Path> elements inside an <Svg>
```

### DEPS-MATRIX.md audit command

```bash
# Run from project root to get all installed dependency versions
cat package.json | node -e "
  const pkg = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  Object.entries(all).forEach(([k,v]) => console.log(k, v));
"
```

---

## State of the Art

| Old Approach | Current Approach | Impact on This Phase |
|--------------|------------------|---------------------|
| `react-native-splash-screen` (crazycodeboy) | `react-native-bootsplash` | Direct replacement; new API; Phase 1 executes this |
| Manual `UIAppFonts` in Info.plist | CocoaPods autolinking for fonts | Must choose one method in Phase 2; note in DEPS-MATRIX.md |
| `SoLoader.init(this, false)` | `SoLoader.init(this, OpenSourceMergedSoMapping)` | Document now; execute in Phase 2 |
| `react-native-chart-kit` PieChart | Custom SVG or `react-native-gifted-charts` | Decide and document in Phase 1; implement if removing chart-kit |

**Deprecated/outdated confirmed in this project:**
- `react-native-splash-screen@3.3.0`: confirmed dead, no New Arch support
- `react-native-chart-kit@6.12.0`: confirmed unmaintained (4+ years), not New Arch compatible per RN Directory
- iOS `platform :ios, '13.4'` in Podfile: outdated, must become `15.1` in Phase 2
- `hermes_enabled: false` in Podfile: must be removed in Phase 2

---

## Open Questions

1. **react-native-chart-kit: replace now or document for Phase 2?**
   - What we know: Library IS used (MacroGraph.tsx PieChart), IS unmaintained, IS confirmed New Arch incompatible. The custom SVG replacement is feasible with zero new deps.
   - What's unclear: How much time it adds to Phase 1 scope.
   - Recommendation: Replace now. The replacement is small (one component, two callers), reuses existing react-native-svg pattern, and removes a confirmed blocker. Leaving it creates Phase 2/3 risk.

2. **`execa@5.1.1` — why is this in production dependencies?**
   - What we know: `execa` is a process execution utility, unusual in a mobile app's `dependencies` (not `devDependencies`).
   - What's unclear: Whether any screen or utility actually imports it, or if it's a leftover.
   - Recommendation: Search for `execa` imports in source before finalizing DEPS-MATRIX.md. If unused, remove it.

3. **react-native-bootsplash version 7.x iOS integration for Obj-C AppDelegate**
   - What we know: The GitHub docs show the modern Swift `customize` override. The current `AppDelegate.m` is Obj-C pre-0.74 style.
   - What's unclear: Whether bootsplash 7.x still supports the older `customizeRootView` Obj-C hook.
   - Recommendation: Check bootsplash v7 README for Obj-C compatibility. If `customizeRootView` is not supported, use `applicationDidBecomeActive` as fallback. Phase 2 will migrate AppDelegate to Swift anyway — any temporary Obj-C integration is acceptable.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest (react-native preset) |
| Config file | `package.json` (`"jest": { "preset": "react-native" }`) |
| Quick run command | `npx jest __tests__/utils.test.ts` |
| Full suite command | `npm run test -- --watchAll=false` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DEPS-01 | All dependencies have confirmed New Arch compatible target versions | manual-only | N/A — audit is document verification | N/A |
| DEPS-02 | Bootsplash replaces splash-screen; app launches and dismisses splash on cold start | manual (platform smoke test) | `npm run ios` then observe launch; `npm run android` then observe launch | N/A |
| DEPS-03 | DEPS-MATRIX.md exists and is complete | manual-only | `ls .planning/DEPS-MATRIX.md` | ❌ Wave 0 — file created as deliverable |

**Note:** DEPS-01 and DEPS-03 are documentation requirements verifiable by file inspection. DEPS-02 requires a manual device/simulator smoke test — no automated test can verify native splash screen behavior.

Existing test coverage (utils.test.ts) remains passing throughout Phase 1 — run it as a regression check after any package.json changes.

### Sampling Rate

- **Per task commit:** `npx jest __tests__/utils.test.ts` (confirms no JS regressions from package changes)
- **Per wave merge:** `npm run test -- --watchAll=false` (full Jest suite)
- **Phase gate:** `npm run ios` splash dismisses cleanly; `npm run android` splash dismisses cleanly; DEPS-MATRIX.md committed

### Wave 0 Gaps

- [ ] `.planning/DEPS-MATRIX.md` — deliverable created during Phase 1 execution (not a test gap, just the primary artifact)

No test infrastructure gaps — existing Jest setup covers the only automated tests needed for this phase.

---

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md` — all target versions for every library; upgrade compatibility matrix
- `.planning/research/PITFALLS.md` — SoLoader, Podfile, splash screen, and RNVI pitfall details
- `package.json` (project file) — confirmed current versions of all 22 dependencies
- `ios/macromaker/AppDelegate.m` (project file) — confirmed no existing SplashScreen API calls
- `ios/macromaker/Info.plist` (project file) — confirmed UILaunchStoryboardName=SplashScreen; all 15 UIAppFonts listed
- `android/app/src/main/java/.../MainApplication.java` (project file) — confirmed SoLoader.init(this, false) pattern; IS_NEW_ARCHITECTURE_ENABLED check present
- `components/MacroGraph.tsx` (project file) — confirmed react-native-chart-kit IS used (PieChart)
- [React Native Directory — react-native-chart-kit entry](https://reactnative.directory/?search=pie+chart) — confirmed: unmaintained, not New Arch compatible (HIGH confidence)
- [react-native-bootsplash GitHub](https://github.com/zoontek/react-native-bootsplash) — setup patterns, CLI usage, JS API

### Secondary (MEDIUM confidence)
- WebSearch: react-native-chart-kit last npm release confirmed 4+ years ago
- WebSearch: react-native-gifted-charts v1.4.57 confirmed New Architecture compatible (LogRocket testing)

### Tertiary (LOW confidence)
- WebSearch: react-native-svg potential RCTImage observer issue in RN 0.84 — unverified; flagged for Phase 3 monitoring

---

## Metadata

**Confidence breakdown:**
- Standard stack (confirmed targets): HIGH — sourced from STACK.md which verified npm versions
- react-native-chart-kit status: HIGH — React Native Directory explicitly marks it unmaintained + not New Arch compatible; file read confirms active use
- bootsplash integration: MEDIUM — GitHub docs read; Obj-C AppDelegate hook for v7.x not explicitly confirmed
- Architecture (patterns): HIGH — based on direct source file reads of existing code structure
- Pitfalls: HIGH — sourced from PITFALLS.md (cross-verified against official RN releases) plus direct code inspection

**Research date:** 2026-03-10
**Valid until:** 2026-04-10 (stable ecosystem; bootsplash and chart library status unlikely to change in 30 days)
