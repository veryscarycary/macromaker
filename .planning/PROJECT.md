# macromaker

## What This Is

macromaker is a bare React Native mobile app (iOS/Android) for tracking daily macronutrient intake and managing personal fitness goals. It stores all data locally on-device using AsyncStorage — no backend, no accounts, no subscriptions. Built for people who care about hitting their macro ratios alongside calorie targets.

## Core Value

A fast, offline-first macro tracker where adding a meal and seeing your day's intake takes under 10 seconds.

## Requirements

### Validated

- ✓ User can log today's meals with manual macro entry (carbs/protein/fat, grams or oz) — existing
- ✓ User can view a live summary of today's calorie and macro intake — existing
- ✓ User can view history of previous days' meals and intake — existing
- ✓ User can edit and delete logged meals — existing
- ✓ User can complete onboarding to set up their profile (weight, height, age, sex, activity level) — existing
- ✓ App calculates BMR and TDEE from profile data — existing
- ✓ App calculates macro targets as percentages — existing
- ✓ User can view macro graphs (bar chart, meal-time scatter plot, stacked calorie chart) — existing
- ✓ App navigates via bottom tabs (Diet / Fitness) with modal-first root stack — existing
- ✓ App uses TypeScript throughout with strict mode — existing
- ✓ React Native upgraded to 0.84.1 with all compatible dependencies — v1.0
- ✓ Onboarding flow polished: progress dots, keyboard avoidance, unit labels, sensible defaults — v1.0

## Current Milestone: v1.1 Design System & Branding

**Goal:** Establish a cohesive design system — tokens, typography, and a component library — that gives macromaker a clean, minimal, Notion/Linear-aesthetic with a distinctive color identity and consistent light-mode UI.

**Target features:**
- Brand color palette and design token system
- Typography scale with a curated brand font
- Core reusable UI component library (buttons, inputs, cards, navigation elements)
- Apply design system across all existing screens

### Active

- [ ] Design token system (color, spacing, typography, radius, shadow)
- [ ] Brand font selection and integration
- [ ] Core UI component library
- [ ] Design system applied to all existing screens

### Out of Scope

- Backend / cloud sync — local-only by design; no revenue model to support infrastructure
- Food search API / barcode scanning — deferred until core UX is solid
- Push notifications — deferred to future milestone
- Social / sharing features — out of scope for MVP

## Context

**Current state (v1.0 shipped 2026-03-13):** ~4,437 TypeScript LOC. Running React Native 0.84.1 in bridge-compat mode (`newArchEnabled=false`) — New Architecture deferred to v2 pending react-native-screens 4.x NativeModule bridge fix. All 5 core E2E flows verified on iOS + Android (simulator + physical device).

Previously an Expo project, now fully ejected (bare React Native). Upgraded from RN 0.73.6 → 0.76.x → 0.84.1 across v1.0 milestone.

Key files:
- `navigation/` — RootNavigator, BottomTabNavigator, DietNavigator
- `context/` — HistoryContext, MealContext, InfoContext
- `utils.ts` — all storage helpers and macro/BMR calculations
- `types.tsx` — Meal, DietDay, Info types
- `components/StepIndicator.tsx` — shared onboarding progress dots (added v1.0)

**Tech debt from v1.0:**
- `newArchEnabled=false`: bridge-compat posture; enable when react-native-screens bridge issue resolved
- Reanimated worklets Babel plugin not wired (no worklet code yet)
- d3-shape now explicitly declared in package.json (was transitive)

## Constraints

- **Tech stack**: React Native bare (no Expo) — iOS requires Xcode + CocoaPods, Android requires Android SDK
- **Data**: AsyncStorage only — no remote services
- **Billable services**: Minimize — no revenue model in place
- **Platform**: iOS primary, Android secondary

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|------------|
| Eject from Expo → bare RN | More control over native code and dependencies | ✓ Good |
| AsyncStorage for all persistence | Offline-first, no backend needed for MVP | ✓ Good |
| Custom createDataContext factory | Reduces useReducer boilerplate across contexts | ✓ Good |
| Upgrade RN before new features | Avoid building on outdated tooling | ✓ Good — shipped 0.84.1 |
| Two-hop upgrade strategy (0.73.6 → 0.76 → 0.84.1) | Reduces native surface area per hop | ✓ Good |
| bridge-compat mode (`newArchEnabled=false`) | react-native-screens 4.x crashes with New Arch on; enableScreens(false) workaround insufficient | ⚠ Revisit in v2 |
| react-native-paper replacing @rneui/themed | @rneui unknown New Arch status, peer dep conflicts with Nav v7 | ✓ Good |
| Custom D3/SVG chart replacing react-native-chart-kit | Reuses react-native-svg already installed; avoids new dep | ✓ Good |
| Import d3-shape directly (not full d3 bundle) | Metro cannot resolve full d3 ES module bundle | ✓ Good |

---
*Last updated: 2026-03-14 after v1.1 milestone start*
