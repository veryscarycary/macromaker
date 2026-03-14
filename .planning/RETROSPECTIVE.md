# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — RN 0.84.1 Upgrade + Onboarding Polish

**Shipped:** 2026-03-13
**Phases:** 4 | **Plans:** 17 | **Timeline:** 3 days (2026-03-10 → 2026-03-13)

### What Was Built

- Full React Native upgrade 0.73.6 → 0.76.x → 0.84.1, sequenced as a two-hop strategy
- iOS AppDelegate.mm rewrite (Obj-C++ for New Architecture headers) + Podfile iOS 15.1 + CocoaPods deduplication workaround
- Android native infra: SoLoader OpenSourceMergedSoMapping, minSdk 24, Kotlin 2.1.20, AGP 8.12, Gradle 8.13
- Replaced 3 dead/incompatible libraries: react-native-splash-screen → bootsplash, react-native-chart-kit → custom D3/SVG, @rneui/themed → react-native-paper
- Polished onboarding UX: StepIndicator progress dots, KeyboardAvoidingView, unit labels, sensible defaults, name validation
- 31/31 tests passing; 12/12 human-verified checks on iOS + Android

### What Worked

- **DEPS-MATRIX.md as single source of truth** — locking all versions before any bump prevented mid-phase version churn
- **Two-hop upgrade strategy** — separating 0.73.6 → 0.76 (native infra) from 0.76 → 0.84.1 (final hop) made native surface area per phase manageable
- **Human verification checkpoints** (phases 2, 3, 4) caught native issues that automated tests couldn't surface
- **Wave-based parallelization** in Phase 4 — test scaffolds in Wave 0 paid off in later waves

### What Was Inefficient

- **CocoaPods deduplication workaround** — a codegen path changed between RN 0.76 and 0.84.1 requiring workaround update; this was a surprise
- **react-native-svg StyleSizeLength patch** — needed a node_modules manual patch for Yoga 3.x rename; should have used patch-package immediately
- **newArchEnabled toggling** — enabled New Arch in Phase 2, disabled in Phase 3 (react-native-screens 4.x bridge crash); the back-and-forth added steps and doc drift

### Patterns Established

- `DEPS-MATRIX.md` for pre-upgrade dependency locking — use this pattern for any major ecosystem jump
- Import from sub-packages (`d3-shape`, `d3-scale`) not full bundle — Metro can't resolve full d3 ES module
- `accessibilityLabel='filled'/'empty'` on dot Views for both a11y and test targeting (StepIndicator pattern)
- Jest mock factory must use `require('react')` not imported React ref — jest hoists mock calls above imports

### Key Lessons

1. **Bridge-compat mode is a valid posture**: `newArchEnabled=false` with a stable, verified build beats an unstable New Arch build. Document the decision and revisit in v2.
2. **Human checkpoints are not optional for native upgrades**: Simulator/emulator diverge from physical device in non-obvious ways — plan for it explicitly.
3. **CocoaPods workarounds need version-aware paths**: Any Podfile workaround that references internal RN paths must be updated when RN version changes.
4. **Tech debt from transitive deps is real**: `d3-shape` was a transitive dep that worked until it wouldn't — always declare explicit deps for anything you import directly.

### Cost Observations

- Model mix: ~100% Sonnet (balanced profile)
- Sessions: ~8 sessions over 3 days
- Notable: yolo mode + coarse granularity kept context cost low; wave parallelization in Phase 4 was effective

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 4 | 17 | First milestone — established DEPS-MATRIX, two-hop upgrade, human checkpoint patterns |

### Cumulative Quality

| Milestone | Tests | Notable |
|-----------|-------|---------|
| v1.0 | 31 passing | Full onboarding test suite; utils unit tests from Phase 2 |

### Top Lessons (Verified Across Milestones)

1. Lock all dependency versions in a matrix before any version bump begins
2. Human verification checkpoints are essential for native mobile work
