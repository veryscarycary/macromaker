---
phase: 2
slug: infrastructure-upgrade
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest (react-native preset) |
| **Config file** | `package.json` (jest key), no separate jest.config file |
| **Quick run command** | `npx jest __tests__/utils.test.ts` |
| **Full suite command** | `npm run test` (no watch; pass `--watchAll=false`) |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx jest __tests__/utils.test.ts`
- **After every plan wave:** Run `npm run test -- --watchAll=false`
- **Before `/gsd:verify-work`:** Full suite must be green + manual iOS launch smoke test
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-xx-01 | TBD | 0 | JSDP-05 | unit | `npx jest __tests__/utils.test.ts -t "removeStoredData"` | ❌ W0 | ⬜ pending |
| 2-xx-02 | TBD | 1+ | JSDP-05 | unit | `npx jest __tests__/utils.test.ts` | ✅ | ⬜ pending |
| 2-xx-03 | TBD | 1+ | JSDP-06 | manual | Launch iOS sim, exercise graph interactions and navigation gestures | Manual only | ⬜ pending |
| 2-xx-04 | TBD | 1+ | NATV-06 | manual/smoke | `npm run ios` | Manual only | ⬜ pending |
| 2-xx-05 | TBD | 1+ | NATV-06 | manual/smoke | `npm run android` | Manual only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `__tests__/utils.test.ts` — add `removeStoredData` tests: (a) successful remove returns without error, (b) mock confirms `AsyncStorage.removeItem` called with correct key. Uses existing `@react-native-async-storage/async-storage/jest/async-storage-mock` already configured.

*Note: Most phase validation is manual (build verification, native behavior) — Wave 0 covers the one automated gap.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| iOS app builds and launches with RN 0.76.x | NATV-01, NATV-06 | Native build — no automated RN build CI | Run `npm run ios`, confirm simulator launches to home screen |
| Android app builds and launches with RN 0.76.x | NATV-02, NATV-06 | Native build — no automated RN build CI | Run `npm run android`, confirm emulator launches |
| New Architecture enabled (no bridge-mode warnings) | NATV-03 | Runtime Metro output inspection required | Check Metro logs at startup for no "bridge mode" warnings; confirm `newArchEnabled=true` in gradle.properties |
| Animated/gesture interactions work after Reanimated 4 | NATV-04, JSDP-06 | Visual/interactive — no automated Reanimated test | Exercise BarGraph, MealTimeGraph, TotalCaloriesGraph; trigger navigation transitions; swipe gestures |
| No peer dependency errors | JSDP-01-06 | npm install output inspection | Run `npm install`, confirm zero peer dep errors or unmet deps in output |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
