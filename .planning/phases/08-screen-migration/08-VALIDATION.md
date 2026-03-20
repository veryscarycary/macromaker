---
phase: 8
slug: screen-migration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest (react-native preset) |
| **Config file** | `package.json` (`"jest": { "preset": "react-native" }`) |
| **Quick run command** | `npx jest --watchAll=false --passWithNoTests` |
| **Full suite command** | `npx jest --watchAll=false` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx jest --watchAll=false --passWithNoTests`
- **After every plan wave:** Run `npx jest --watchAll=false`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 8-01-01 | 01 | 0 | MIGR-02 | smoke render | `npx jest __tests__/screens/AddFoodScreen.test.tsx --watchAll=false` | ❌ W0 | ⬜ pending |
| 8-01-02 | 01 | 0 | MIGR-03 | unit | `npx jest __tests__/screens/DietTodayScreen.test.tsx --watchAll=false` | ❌ W0 | ⬜ pending |
| 8-01-03 | 01 | 0 | MIGR-05 | smoke render | `npx jest __tests__/screens/FitnessScreen.test.tsx --watchAll=false` | ❌ W0 | ⬜ pending |
| 8-01-04 | 01 | 1 | MIGR-01 | smoke render | `npx jest __tests__/screens/BasicInfoScreen.test.tsx --watchAll=false` | ✅ | ⬜ pending |
| 8-01-05 | 01 | 1 | MIGR-01 | smoke render | `npx jest --testPathPattern="WelcomeScreen|MoreInfoScreen" --watchAll=false` | ❌ W0 | ⬜ pending |
| 8-02-01 | 02 | 1 | MIGR-02 | smoke render | `npx jest --testPathPattern="AddFood" --watchAll=false` | ❌ W0 | ⬜ pending |
| 8-02-02 | 02 | 1 | MIGR-03 | unit | `npx jest __tests__/screens/DietTodayScreen.test.tsx --watchAll=false` | ❌ W0 | ⬜ pending |
| 8-02-03 | 02 | 1 | MIGR-04 | smoke render | `npx jest --testPathPattern="DietHistory|DailyDiet" --watchAll=false` | ❌ W0 | ⬜ pending |
| 8-02-04 | 02 | 1 | MIGR-05 | smoke render | `npx jest __tests__/screens/FitnessScreen.test.tsx --watchAll=false` | ❌ W0 | ⬜ pending |
| 8-03-01 | 03 | 2 | MIGR-06 | unit | `npx jest --testPathPattern="MacroGraph|MealTime|BarGraph|TotalCalories" --watchAll=false` | ✅ (partial) | ⬜ pending |
| 8-03-02 | 03 | 2 | MIGR-07 | grep CI | `grep -rE '#[0-9a-fA-F]{3,6}' screens/ components/` returns 0 | manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `__tests__/screens/AddFoodScreen.test.tsx` — smoke render stub for MIGR-02
- [ ] `__tests__/screens/DietTodayScreen.test.tsx` — verifies macro colors in data array (MIGR-03)
- [ ] `__tests__/screens/FitnessScreen.test.tsx` — smoke render stub for MIGR-05

*(BasicInfoScreen.test.tsx already exists and covers MIGR-01 partial. MacroGraph.test.tsx already exists and covers MIGR-06 partial.)*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No hardcoded hex in screens/ and components/ | MIGR-07 | Grep check, not unit testable | `grep -rE '#[0-9a-fA-F]{3,6}' screens/ components/` — must return 0 matches |
| Visual consistency across all 8 screens | MIGR-01–05 | Pixel-level visual check requires device/simulator | Launch app, navigate each screen, verify spacing/typography/color uniformity |
| Graph macro fill colors match MacroProgressBar | MIGR-06 | Color rendering requires simulator | Side-by-side: BarGraph and TotalCaloriesGraph fills must match MacroProgressBar segment colors |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
