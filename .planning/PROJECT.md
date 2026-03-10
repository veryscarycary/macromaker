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

### Active

- [ ] Upgrade React Native from 0.73.6 to latest stable (0.78.x) with all compatible dependencies
- [ ] Upgrade all other dependencies to latest compatible versions
- [ ] Rework onboarding flow (Welcome → BasicInfo → MoreInfo) to feel less clunky and more polished
- [ ] Running average view — 7-day macro/calorie average display

### Out of Scope

- Backend / cloud sync — local-only by design; no revenue model to support infrastructure
- Food search API / barcode scanning — deferred until core UX is solid
- Push notifications — deferred to future milestone
- Social / sharing features — out of scope for MVP

## Context

Previously an Expo project, now fully ejected (bare React Native). Last major dependency update brought it to RN 0.73.6. The upgrade to latest RN is a prerequisite for everything else — newer APIs, better performance, and access to current ecosystem tooling.

Onboarding (the modal flow on first launch) is identified as the roughest UX area. It uses a `basicInfo` AsyncStorage check to decide whether to show the onboarding modal at startup.

Key files:
- `navigation/` — RootNavigator, BottomTabNavigator, DietNavigator
- `context/` — HistoryContext, MealContext, InfoContext
- `utils.ts` — all storage helpers and macro/BMR calculations
- `types.tsx` — Meal, DietDay, Info types

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
| Upgrade RN before new features | Avoid building on outdated tooling | — Pending |

---
*Last updated: 2026-03-10 after initialization*
