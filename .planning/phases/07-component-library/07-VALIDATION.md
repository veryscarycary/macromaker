---
phase: 7
slug: component-library
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29.7.0 + @testing-library/react-native 13.3.3 |
| **Config file** | `package.json` `jest` key — preset: `react-native` |
| **Quick run command** | `npx jest __tests__/components/ --no-watchAll` |
| **Full suite command** | `npm run test:single` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx jest __tests__/components/<ComponentName>.test.tsx --no-watchAll`
- **After every plan wave:** Run `npx jest __tests__/components/ --no-watchAll`
- **Before `/gsd:verify-work`:** Full suite must be green (`npm run test:single`)
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 0 | COMP-01 | unit | `npx jest __tests__/components/Text.test.tsx --no-watchAll` | ❌ W0 | ⬜ pending |
| 07-01-02 | 01 | 0 | COMP-02 | unit | `npx jest __tests__/components/NumericText.test.tsx --no-watchAll` | ❌ W0 | ⬜ pending |
| 07-01-03 | 01 | 0 | COMP-03 | unit | `npx jest __tests__/components/Button.test.tsx --no-watchAll` | ❌ W0 | ⬜ pending |
| 07-01-04 | 01 | 0 | COMP-04 | unit | `npx jest __tests__/components/Card.test.tsx --no-watchAll` | ❌ W0 | ⬜ pending |
| 07-01-05 | 01 | 0 | COMP-05 | unit | `npx jest __tests__/components/MacroProgressBar.test.tsx --no-watchAll` | ❌ W0 | ⬜ pending |
| 07-02-01 | 02 | 1 | COMP-01 | unit | `npx jest __tests__/components/Text.test.tsx --no-watchAll` | ✅ W0 | ⬜ pending |
| 07-02-02 | 02 | 1 | COMP-02 | unit | `npx jest __tests__/components/NumericText.test.tsx --no-watchAll` | ✅ W0 | ⬜ pending |
| 07-03-01 | 03 | 1 | COMP-03 | unit | `npx jest __tests__/components/Button.test.tsx --no-watchAll` | ✅ W0 | ⬜ pending |
| 07-03-02 | 03 | 1 | COMP-04 | unit | `npx jest __tests__/components/Card.test.tsx --no-watchAll` | ✅ W0 | ⬜ pending |
| 07-04-01 | 04 | 1 | COMP-05 | unit | `npx jest __tests__/components/MacroProgressBar.test.tsx --no-watchAll` | ✅ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `__tests__/components/Text.test.tsx` — stubs for COMP-01
- [ ] `__tests__/components/NumericText.test.tsx` — stubs for COMP-02
- [ ] `__tests__/components/Button.test.tsx` — stubs for COMP-03
- [ ] `__tests__/components/Card.test.tsx` — stubs for COMP-04
- [ ] `__tests__/components/MacroProgressBar.test.tsx` — stubs for COMP-05

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Inter font renders visually distinct weights on device | COMP-01 | Font rendering is OS/device-specific; RNTL renders without real fonts | Run app on simulator, verify heading vs body weight looks distinct |
| tabular-nums prevents layout shift on number change | COMP-02 | RNTL doesn't measure actual glyph widths | Run app, rapidly change a NumericText value, confirm digits don't shift |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
