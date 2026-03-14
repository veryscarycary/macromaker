# Milestones

## v1.0 RN 0.84.1 Upgrade + Onboarding Polish (Shipped: 2026-03-14)

**Phases completed:** 4 phases, 17 plans, 0 tasks

**Key accomplishments:**
1. Audited all 25 npm dependencies for New Architecture compatibility; locked target versions in DEPS-MATRIX.md
2. Replaced `react-native-splash-screen` (dead) with `react-native-bootsplash` and custom D3/SVG chart for `react-native-chart-kit`
3. Rewrote iOS AppDelegate.mm + Android native infra, migrated to `react-native-paper`, shipped at RN 0.76.x stable
4. Completed final hop to RN 0.84.1 (Kotlin 2.1.20, AGP 8.12, Gradle 8.13) — 12/12 human-verified checks on iOS + Android
5. Polished onboarding: StepIndicator progress dots, KeyboardAvoidingView, unit labels (lbs/ft/in), sensible defaults, name validation

**Tech debt carried forward:**
- `d3-shape` added to package.json (was transitive-only)
- `cardStyle` → `contentStyle` in navigation/index.tsx (deprecated)
- `newArchEnabled=false` (bridge-compat mode) — New Architecture deferred to v2 pending react-native-screens fix
- Reanimated worklets Babel plugin absent (no worklet code yet — add when first worklet is written)

---

