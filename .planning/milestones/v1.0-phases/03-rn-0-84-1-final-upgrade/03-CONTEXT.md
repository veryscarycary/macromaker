# Phase 3: RN 0.84.1 Final Upgrade - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Upgrade macromaker from React Native `0.76.7` to `0.84.1` and verify that the existing app still launches and its core user flows still work on iOS and Android. This phase is about landing the final React Native hop and proving stability; it does not add new product features or redesign existing flows.

</domain>

<decisions>
## Implementation Decisions

### Verification bar
- Phase 3 must verify the core existing flows only: onboarding trigger, meal add/edit/delete, today's summary, history, macro graphs, and tab navigation
- Verification evidence should be a written checklist with explicit pass/fail coverage for each core flow
- Any regression in a core flow blocks phase completion until fixed
- Verification depth should be higher on iOS, with a lighter but still meaningful Android pass

### Device proof
- iOS requires both simulator verification and one physical-device verification before the phase is complete
- Android requires both emulator verification and one physical-device verification before the phase is complete
- If a required physical-device check cannot be performed, the phase remains open
- Real devices need startup/launch proof; most core-flow regression testing can happen on simulator/emulator

### Upgrade posture
- Keep the phase boundary locked to React Native `0.84.1` as defined in the roadmap and requirements
- Temporary compatibility patches are acceptable during execution if they are small, well understood, and documented
- Temporary patches do not count as an acceptable final state for this phase; they must be removed before completion
- If the app launches on `0.84.1` but remains brittle or still depends on a temporary compatibility patch, the phase stays open

### Claude's Discretion
- Exact plan breakdown for the upgrade, native build fixes, and verification sequencing
- Which automated checks to run before manual verification
- How to document the final checklist format
- How to isolate and unwind temporary compatibility fixes during execution

</decisions>

<specifics>
## Specific Ideas

- User wants this phase to feel like a hard stability gate, not a soft “it launches so ship it” checkpoint
- Manual verification should stay focused on real user-critical flows rather than broad exploratory QA
- Within the current roadmap scope, iOS remains the primary platform, but Android still needs meaningful proof and a physical-device check

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `App.tsx`: current app root already wires `GestureHandlerRootView`, `PaperProvider`, `SafeAreaProvider`, `HistoryProvider`, `Navigation`, and `BootSplash`; Phase 3 verification should treat this as the main startup integration path
- `utils.ts`: central AsyncStorage helpers and calorie/BMR utility functions are a key regression surface because meal/history/profile flows depend on them
- `screens/InfoModal/ModalScreen.tsx`: onboarding flow entry point for `Welcome`, `BasicInfo`, and `MoreInfo`; this is the main path for verifying the onboarding modal trigger still behaves correctly

### Established Patterns
- The app is an offline-first bare React Native app with all persistence going through AsyncStorage helpers; storage behavior must remain unchanged after the RN hop
- PaperProvider and device color-scheme handling are already established from Phase 2 and should remain functional rather than being redesigned here
- Graphs are custom `react-native-svg` + D3 components, so SVG/native rendering remains a high-risk area for RN `0.84.1` regressions

### Integration Points
- `package.json`: current baseline is React `18.3.1`, React Native `0.76.7`, React Navigation v7, AsyncStorage 3.x, and `react-native-svg@15.15.3`; Phase 3 will coordinate the final version hop from this state
- iOS and Android native projects under `ios/` and `android/` were rewritten in Phase 2 for the New Architecture baseline; Phase 3 builds on those templates rather than rethinking native architecture
- Existing tests are Jest-based and lightweight; manual verification will carry most of the confidence burden for this phase

</code_context>

<deferred>
## Deferred Ideas

- User preference: if `0.84.1` proves unusually problematic, they would prefer flexibility toward the latest compatible `0.84.x`; this is a roadmap/requirements change, not a Phase 3 context decision, so it is deferred unless the roadmap is updated separately

</deferred>

---

*Phase: 03-rn-0-84-1-final-upgrade*
*Context gathered: 2026-03-12*
