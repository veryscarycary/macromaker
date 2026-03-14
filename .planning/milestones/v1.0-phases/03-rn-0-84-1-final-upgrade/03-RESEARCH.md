# Phase 3: RN 0.84.1 Final Upgrade - Research

**Researched:** 2026-03-12
**Domain:** React Native `0.76.7` to `0.84.1` final-hop upgrade with full platform verification
**Confidence:** MEDIUM-HIGH (grounded in current repo state, prior phase outputs, and official React Native upgrade/release guidance patterns)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Phase boundary stays locked to React Native `0.84.1`
- Verification is a hard gate, not a soft launch smoke test
- Core flows to verify: onboarding trigger, meal add/edit/delete, today's summary, history, macro graphs, and tab navigation
- Verification evidence must be a written pass/fail checklist per core flow
- Any regression in a core flow blocks completion
- iOS gets deeper verification than Android, but Android still needs meaningful proof
- iOS requires simulator plus one physical-device launch check
- Android requires emulator plus one physical-device launch check
- If either required physical-device check cannot be performed, the phase remains open
- Temporary compatibility patches are acceptable only during execution and must be removed before the phase can be considered complete

### Claude's Discretion
- Exact plan breakdown and wave structure
- Which automated checks to run before manual verification
- Exact checklist format for final verification notes
- Which compatibility issues deserve isolated prep work vs. being handled inside the main upgrade plan

### Deferred Ideas (OUT OF SCOPE)
- Broader version flexibility toward the latest compatible `0.84.x` instead of exactly `0.84.1` would require roadmap/requirements changes

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| RNUP-01 | React Native upgraded to `0.84.1` with matching React and Hermes versions | Version alignment and package hot spots identified |
| RNUP-02 | Node.js `22.11+` and Xcode `16.1+` confirmed as build environment | Environment verification and tooling checks defined |
| RNUP-03 | App runs on iOS simulator and physical device without crashes | iOS native/template review and launch verification path defined |
| RNUP-04 | App runs on Android emulator and physical device without crashes | Android template/config review and launch verification path defined |
| RNUP-05 | All existing features work correctly on `0.84.1` | Core-flow regression checklist and high-risk surfaces identified |

</phase_requirements>

---

## Summary

Phase 3 is not another broad dependency cleanup phase. Phase 2 already established the New Architecture baseline, rewrote the native entry points, upgraded navigation to v7, moved persistence to AsyncStorage 3.x, and replaced `@rneui/themed` with `react-native-paper`. The final hop to `0.84.1` should therefore be planned as a controlled compatibility pass built on that new baseline rather than as another full-stack rewrite.

The riskiest areas are the ones already flagged in project state: `react-native-svg` compatibility with later React Native internals, native build-template drift on both platforms, and environment/tooling drift (`Node 22.11+`, `Xcode 16.1+`, modern Android toolchain). The app’s product surface is relatively stable and compact, so the planning focus should be:

1. lock the exact package/version matrix for `0.84.1`,
2. apply only the native/config diffs actually required by the official upgrade path,
3. isolate any dependency breakage early,
4. finish with a strict cross-platform manual verification checklist.

Because the user does not accept a temporary patch as a final state, the plans should treat compatibility patches as diagnostic or bridging tools only. If the upgrade works only with a lingering patch in `node_modules` or `patch-package`, Phase 3 is not done.

**Primary recommendation:** Plan this phase in three waves:
- Wave 1: environment + dependency/version alignment + known compatibility prep
- Wave 2: iOS/Android native/config template reconciliation and build stabilization
- Wave 3: manual verification and evidence capture across simulator/emulator plus physical devices

---

## Current Baseline

### Repo State Entering Phase 3

| Area | Current State |
|------|---------------|
| React Native | `0.76.7` |
| React | `18.3.1` |
| AsyncStorage | `3.0.1` |
| Navigation | React Navigation `7.x` |
| Reanimated | `~3.18.0` in `package.json` |
| Screens | `3.37.0` |
| Safe Area | `4.10.9` |
| SVG | `15.15.3` |
| iOS min target | `15.1` |
| Android minSdk | `24` |
| New Architecture | already enabled (`newArchEnabled=true`) |

### Important Phase 2 Carry-Forward Facts

- `App.tsx` already uses `GestureHandlerRootView`, `PaperProvider`, `SafeAreaProvider`, `HistoryProvider`, and `BootSplash.hide()`
- All persistence routes through `utils.ts` + AsyncStorage helpers
- The onboarding entry path is `screens/InfoModal/ModalScreen.tsx`
- Custom graphs rely on `react-native-svg` + D3, making SVG/native rendering the highest regression surface
- The current iOS Podfile includes a custom post-install workaround for CocoaPods 1.16.x duplicate codegen files
- Project state explicitly warns that `react-native-svg` may need attention again at the RN `0.84.1` hop

---

## Standard Upgrade Approach

### Version Alignment

For planning purposes, the target should be treated as an **exact-version alignment exercise**, not “bump RN only and hope peer dependencies resolve.” The planner should expect to verify and possibly adjust at least:

- `react-native`
- `react`
- any explicit Hermes-related alignment implied by the RN template/tooling
- `@react-native/metro-config`
- `@react-native-community/cli*`
- `react-native-screens`
- `react-native-safe-area-context`
- `react-native-reanimated`
- `react-native-gesture-handler`
- `react-native-svg`

The plan should use the official React Native upgrade diff/template as the source of truth for native/config file drift, then reconcile local project customizations on top of that.

### Environment Gate

Before touching code, the execution should confirm:

- `node -v` is at least `22.11`
- Xcode is at least `16.1`
- CocoaPods is modern enough for the current Podfile/plugins
- Android SDK / Gradle tooling is compatible with the RN `0.84.1` template expectations

This should be a first-class task, not a side note, because RNUP-02 is itself a requirement and environment mismatch can waste hours with misleading native errors.

---

## Compatibility Hot Spots

### 1. `react-native-svg` and Custom Graphs

This is the most likely upgrade blocker.

Why it is high risk:
- three visible graph surfaces depend on SVG rendering
- Phase 2 already needed a direct compatibility patch against Yoga 3.x naming
- project state already flags possible observer API churn at the `0.84.1` hop

Planning implication:
- add a dedicated compatibility-check task early in the phase
- verify whether the currently installed `react-native-svg` version has an upstream-compatible release for RN `0.84.1`
- if a temporary patch is needed to unblock diagnosis, document it as temporary and plan explicit removal before phase close
- manual verification must include all graph surfaces, not just app launch

### 2. `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler`

These were intentionally pinned down in Phase 2 to stay compatible with RN `0.76.x`.

Planning implication:
- Phase 3 should expect these to move again toward versions aligned with RN `0.84.1` and Navigation v7
- treat them as a coordinated upgrade cluster with navigation, not independent package bumps
- re-verify navigation gestures, stack transitions, tab switching, and modal/onboarding presentation after the cluster upgrade

### 3. Reanimated / Worklets

Phase 2’s final installed package set no longer matches the original Phase 2 target notes exactly. `package.json` currently shows `react-native-reanimated` on the `3.18.x` line, which means Phase 3 planning should not assume Reanimated 4 is already in place.

Planning implication:
- explicitly inspect current Reanimated/worklets compatibility against RN `0.84.1`
- treat any required Reanimated major bump as part of the dependency alignment work
- verification must include gestures and any animated screen transitions

### 4. iOS Podfile / CocoaPods Workarounds

The Podfile already contains nontrivial custom post-install logic to repair duplicate codegen file references in CocoaPods 1.16.x.

Planning implication:
- do not overwrite the Podfile blindly from template diff
- compare the RN `0.84.1` Podfile expectations against the existing custom workaround
- if the workaround is still needed, preserve or adapt it carefully
- if RN `0.84.1` or updated pods eliminate the need, remove it explicitly and verify cleanly

### 5. Android Build Template Drift

Android is already on minSdk 24 and a modern AGP line, which is a good baseline. The remaining Phase 3 risk is template drift in:

- Gradle plugin / wrapper expectations
- `MainApplication` and package initialization patterns
- release/debug build plumbing under the newer RN template

Planning implication:
- compare local Android files against the RN `0.84.1` template diff instead of making isolated line edits
- keep Android proof lighter than iOS for flow coverage, but do not delay emulator/device launch verification until the very end

---

## Native / Config Areas To Check

### iOS

Files likely involved:
- `ios/Podfile`
- `ios/Podfile.lock`
- `ios/macromaker/AppDelegate.mm`
- `ios/macromaker/AppDelegate.h`
- `ios/macromaker.xcodeproj/project.pbxproj`

Checks to plan for:
- updated RN template diff against existing `RCTAppDelegate` setup
- BootSplash integration still valid
- Hermes/default build settings still match template expectations
- Xcode project references stay correct for `AppDelegate.mm`
- pod install succeeds cleanly with the upgraded dependency graph

### Android

Files likely involved:
- `android/build.gradle`
- `android/app/build.gradle`
- `android/gradle.properties`
- `android/app/src/main/java/.../MainApplication.*`
- Gradle wrapper files if template drift requires it

Checks to plan for:
- `OpenSourceMergedSoMapping` / native init still matches current RN template
- Gradle/AGP/Kotlin compatibility with RN `0.84.1`
- no stale template glue from the `0.76.x` hop remains

### JS / Tooling

Files likely involved:
- `package.json`
- `package-lock.json`
- `babel.config.js`
- `metro.config.js`
- `__tests__/utils.test.ts` if dependency-driven behavior needs updates

Checks to plan for:
- exact dependency alignment after install
- metro/babel config still valid under the new RN toolchain
- no leftover Phase 2 workaround becomes stale or contradictory

---

## Verification Strategy

### Automated Checks

The repo’s automated test surface is light. For this phase, automated checks should be used as a fast regression signal, not as proof of completion.

Recommended automated cadence:
- after dependency/config edits: `npx jest __tests__/utils.test.ts`
- after each major wave: `npm run test -- --watchAll=false`
- after package alignment: scriptable package/version assertions from `package.json`

### Manual Verification

This phase is completed or blocked by manual verification, not by Jest.

Required manual proof:
- iOS simulator launch
- iOS physical-device launch
- Android emulator launch
- Android physical-device launch
- checklist pass/fail notes for:
  - onboarding modal trigger
  - add meal
  - edit meal
  - delete meal
  - today summary
  - diet history
  - macro graphs
  - tab navigation

Practical note:
- flow verification can stay deeper on iOS
- Android can be launch-focused with a smaller core-flow pass, but still needs meaningful interaction coverage

### Completion Bar

The planner should treat the phase as incomplete if any of the following remain true:
- RN version is not exactly `0.84.1`
- required physical-device proof is missing on either platform
- any core flow is broken
- the app depends on an unreconciled temporary compatibility patch

---

## Validation Architecture

This phase is **Nyquist-sensitive** because most of the real risk is manual/native and the existing automated suite is narrow.

Recommended validation contract:

- keep one fast automated feedback loop (`__tests__/utils.test.ts`) after dependency/config changes
- require at least one automated command in every plan, even if the main proof is manual
- reserve the final wave for explicit manual verification evidence capture
- map each core manual flow to RNUP-03/04/05 so the execution phase cannot “pass” with only build success

Suggested plan coverage shape:
- one prep/version-alignment plan with package assertions + quick Jest
- one native stabilization plan for iOS/Android builds
- one explicit verification/evidence plan marked non-autonomous because it depends on human device checks

This keeps automated feedback continuous while acknowledging that build and UI confidence here are inherently manual.

---

## Planner Guidance

The plan should optimize for early de-risking, not for maximal batching.

### Recommended Breakdown

1. **Plan 03-01: Environment + dependency alignment**
   - confirm Node/Xcode/tooling requirements
   - lock package targets for RN `0.84.1`
   - resolve known dependency hot spots first (`svg`, navigation cluster, reanimated/worklets)
   - run Jest/package assertions

2. **Plan 03-02: Native/config reconciliation + build stabilization**
   - apply RN `0.84.1` template diffs carefully on iOS/Android
   - preserve required local customizations
   - achieve simulator/emulator launch

3. **Plan 03-03: Manual verification + evidence capture**
   - human checklist across core flows
   - physical-device launch proof on both platforms
   - produce pass/fail evidence and blockers

### What Not To Do

- do not silently broaden the target to `0.84.x`
- do not count temporary patch-package fixes as acceptable final output
- do not treat iOS simulator success alone as phase completion
- do not rewrite native files from scratch without reconciling existing local customizations from Phase 2

---

## Open Questions To Resolve During Execution

1. What exact companion versions are required by RN `0.84.1` for `react`, CLI tooling, and key native packages in this repo?
2. Does `react-native-svg` have a clean upstream-compatible release for RN `0.84.1`, or will temporary patching be needed during diagnosis?
3. Does the existing Podfile codegen-file workaround remain necessary after the final hop?
4. Does the current Android template already satisfy `0.84.1` expectations, or is a further Gradle/wrapper/MainApplication reconciliation needed?

---

## Recommendation

Proceed with planning, but treat this as a **controlled compatibility and verification phase**, not a simple package bump. The planner should front-load version/environment truth, isolate `react-native-svg` and navigation/runtime package compatibility early, and reserve a final non-autonomous verification plan for the mandatory physical-device proof.
