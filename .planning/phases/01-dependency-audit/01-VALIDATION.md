---
phase: 1
slug: dependency-audit
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-10
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29.x (react-native preset) |
| **Config file** | `package.json` — `"jest": { "preset": "react-native" }` |
| **Quick run command** | `npx jest __tests__/utils.test.ts` |
| **Full suite command** | `npm run test -- --watchAll=false` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx jest __tests__/utils.test.ts`
- **After every plan wave:** Run `npm run test -- --watchAll=false`
- **Before `/gsd:verify-work`:** Full suite must be green + manual platform smoke test
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | DEPS-01 | manual | `ls .planning/DEPS-MATRIX.md` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | DEPS-02 | manual+smoke | `npm run ios` → observe splash | N/A | ⬜ pending |
| 1-01-03 | 01 | 1 | DEPS-03 | manual | `cat .planning/DEPS-MATRIX.md` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 2 | DEPS-02 | regression | `npx jest __tests__/utils.test.ts` | ✅ exists | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `.planning/DEPS-MATRIX.md` — created as primary deliverable (not a test stub, but a required artifact before Phase 2 begins)

*No test infrastructure gaps — existing Jest setup covers all automated regressions for this phase.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| App launches and splash screen displays on cold start | DEPS-02 | Native splash screen behavior cannot be verified by Jest | Run `npm run ios` on simulator; observe BootSplash logo appears and dismisses cleanly |
| App launches on Android without crash | DEPS-02 | Native Android integration | Run `npm run android` on emulator; observe BootSplash displays and app loads |
| DEPS-MATRIX.md is complete and accurate | DEPS-03 | Document review | Open `.planning/DEPS-MATRIX.md`; verify every dependency from `package.json` has a row with target version and New Arch status |
| Dependency audit covers all libraries | DEPS-01 | Compatibility data requires human review | Cross-check DEPS-MATRIX.md against React Native Directory for each flagged library |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
