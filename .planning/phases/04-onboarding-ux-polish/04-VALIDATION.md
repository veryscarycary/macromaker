---
phase: 4
slug: onboarding-ux-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-13
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29.7.0 with `react-native` preset |
| **Config file** | `package.json` ("jest": { "preset": "react-native" }) |
| **Quick run command** | `npx jest --testPathPattern="InfoContext|StepIndicator" --no-coverage` |
| **Full suite command** | `npx jest --no-coverage` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx jest --testPathPattern="InfoContext|StepIndicator" --no-coverage`
- **After every plan wave:** Run `npx jest --no-coverage`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 0 | ONBR-05 | unit | `npx jest --testPathPattern="InfoContext" --no-coverage` | ❌ W0 | ⬜ pending |
| 4-01-02 | 01 | 0 | ONBR-01 | unit | `npx jest --testPathPattern="StepIndicator" --no-coverage` | ❌ W0 | ⬜ pending |
| 4-01-03 | 01 | 0 | ONBR-03, ONBR-04 | unit | `npx jest --testPathPattern="BasicInfoScreen" --no-coverage` | ❌ W0 | ⬜ pending |
| 4-02-01 | 02 | 1 | ONBR-05 | unit | `npx jest --testPathPattern="InfoContext" --no-coverage` | ❌ W0 | ⬜ pending |
| 4-02-02 | 02 | 1 | ONBR-01 | unit | `npx jest --testPathPattern="StepIndicator" --no-coverage` | ❌ W0 | ⬜ pending |
| 4-02-03 | 02 | 1 | ONBR-03, ONBR-04 | unit | `npx jest --testPathPattern="BasicInfoScreen" --no-coverage` | ❌ W0 | ⬜ pending |
| 4-02-04 | 02 | 1 | ONBR-02 | manual | Run on simulator, verify button label | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `__tests__/components/StepIndicator.test.tsx` — stubs for ONBR-01: renders N dots, correct filled/empty counts
- [ ] `__tests__/InfoContext.test.ts` — stubs for ONBR-05: defaultValues has age=30, weight=150, heightFeet=5, heightInches=10
- [ ] `__tests__/screens/BasicInfoScreen.test.tsx` — stubs for ONBR-03/04: KAV present in render tree, suffix label present

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| BasicInfo CTA reads "Continue" | ONBR-02 | String change in JSX; visual verification only | Launch app on iOS simulator, open onboarding, verify button label on BasicInfo screen |
| MoreInfo CTA reads "Get Started" | ONBR-02 | String change in JSX; visual verification only | Continue through onboarding to MoreInfo, verify button label |
| Keyboard does not hide inputs | ONBR-03 | Requires real keyboard interaction | On iOS simulator, focus each input on BasicInfoScreen, verify no fields obscured by keyboard |
| Button style: purple + white text on all 3 screens | ONBR-02 | Visual regression | Navigate all 3 screens, verify purple bg + white text on CTA buttons |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
