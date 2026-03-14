---
phase: 5
slug: token-foundation-font-integration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-14
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29 + react-native preset |
| **Config file** | `package.json` `"jest"` key (no separate jest.config.js) |
| **Quick run command** | `npx jest __tests__/tokens/ --no-watchAll` |
| **Full suite command** | `npm run test -- --watchAll=false` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx jest __tests__/tokens/ --no-watchAll`
- **After every plan wave:** Run `npm run test -- --watchAll=false`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 5-01-01 | 01 | 0 | TOKS-01, TOKS-02, TOKS-03, TOKS-04, FONT-01, FONT-02, FONT-04 | unit (Wave 0 stubs) | `npx jest __tests__/tokens/ --no-watchAll` | ❌ W0 | ⬜ pending |
| 5-01-02 | 01 | 1 | TOKS-01 | unit | `npx jest __tests__/tokens/colors.test.ts --no-watchAll` | ❌ W0 | ⬜ pending |
| 5-01-03 | 01 | 1 | TOKS-02 | unit | `npx jest __tests__/tokens/typography.test.ts --no-watchAll` | ❌ W0 | ⬜ pending |
| 5-01-04 | 01 | 1 | TOKS-03 | unit | `npx jest __tests__/tokens/spacing.test.ts --no-watchAll` | ❌ W0 | ⬜ pending |
| 5-01-05 | 01 | 1 | TOKS-04 | unit | `npx jest __tests__/tokens/radius.test.ts --no-watchAll` | ❌ W0 | ⬜ pending |
| 5-02-01 | 02 | 2 | FONT-01, FONT-02 | unit (fs check) | `npx jest __tests__/tokens/fonts.test.ts --no-watchAll` | ❌ W0 | ⬜ pending |
| 5-02-02 | 02 | 2 | FONT-04 | unit (fs check) | `npx jest __tests__/tokens/fonts.test.ts --no-watchAll` | ❌ W0 | ⬜ pending |
| 5-02-03 | 02 | 3 | FONT-03 | manual | N/A — visual check on simulator/device | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `__tests__/tokens/colors.test.ts` — stubs for TOKS-01
- [ ] `__tests__/tokens/typography.test.ts` — stubs for TOKS-02
- [ ] `__tests__/tokens/spacing.test.ts` — stubs for TOKS-03
- [ ] `__tests__/tokens/radius.test.ts` — stubs for TOKS-04
- [ ] `__tests__/tokens/fonts.test.ts` — stubs for FONT-01, FONT-02, FONT-04

*Existing infrastructure covers the test runner — only new test files needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Inter renders in 4 weights on iOS simulator | FONT-03 | Font rendering requires native runtime; Jest cannot load TTF files | Run `npx react-native run-ios`, open smoke test screen, verify Regular/Medium/SemiBold/Bold are visually distinct |
| Inter renders correctly on Android simulator | FONT-03 | Same as iOS — native runtime required | Run `npx react-native run-android`, verify 4 weights render distinctly |
| Inter renders on physical iOS device | FONT-03 | Device font resolution can differ from simulator | Install via Xcode on physical device, visually verify all 4 weights |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
