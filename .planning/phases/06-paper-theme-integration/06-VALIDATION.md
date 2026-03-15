---
phase: 6
slug: paper-theme-integration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-14
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29.7.0 with react-native preset |
| **Config file** | `package.json` — `"jest": { "preset": "react-native", ... }` |
| **Quick run command** | `npx jest __tests__/theme/ --no-coverage` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx jest __tests__/theme/ --no-coverage`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 6-01-01 | 01 | 0 | PAPR-01, PAPR-02, PAPR-03 | unit | `npx jest __tests__/theme/paperTheme.test.ts -x` | ❌ W0 | ⬜ pending |
| 6-01-02 | 01 | 1 | PAPR-01 | unit | `npx jest __tests__/theme/paperTheme.test.ts -x` | ❌ W0 | ⬜ pending |
| 6-01-03 | 01 | 1 | PAPR-02 | unit | `npx jest __tests__/theme/paperTheme.test.ts -x` | ❌ W0 | ⬜ pending |
| 6-01-04 | 01 | 2 | PAPR-03 | unit | `npx jest __tests__/theme/paperTheme.test.ts -x` | ❌ W0 | ⬜ pending |
| 6-01-05 | 01 | 2 | PAPR-03 | manual | Run on simulator/device | manual only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `__tests__/theme/paperTheme.test.ts` — stubs for PAPR-01, PAPR-02, PAPR-03 (structural unit tests)

*No new framework config needed — Jest is already configured.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Searchbar uses brand orange active indicator on AddFoodScreen | PAPR-03 | Visual rendering cannot be asserted by Jest unit tests | Run on iOS simulator and Android emulator; focus the Searchbar and verify the active indicator color is orange (#f97316), not Paper's default purple |
| Paper components render Inter (not Roboto) on Android | PAPR-02 | Font rendering is visual; no automated assertion for PostScript name resolution | Run on Android emulator; compare Searchbar placeholder text to a known Inter rendering — Roboto has distinct 'a' and 'g' letterforms |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
