---
phase: 3
slug: rn-0-84-1-final-upgrade
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-12
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29.x (react-native preset) |
| **Config file** | `package.json` (`jest` key) |
| **Quick run command** | `npx jest __tests__/utils.test.ts` |
| **Full suite command** | `npm run test -- --watchAll=false` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx jest __tests__/utils.test.ts`
- **After every plan wave:** Run `npm run test -- --watchAll=false`
- **Before `$gsd-verify-work`:** Full suite must be green and manual mobile verification evidence must be recorded
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | RNUP-01 | config | `node -e "const p=require('./package.json'); console.log(p.dependencies['react-native'], p.dependencies['react'])"` | ✅ exists | ⬜ pending |
| 3-01-02 | 01 | 1 | RNUP-02 | env | `node -v && xcodebuild -version` | N/A | ⬜ pending |
| 3-01-03 | 01 | 1 | RNUP-01 | runtime/config | `test -f ios/Podfile.lock && grep -i hermes ios/Podfile.lock | head -5 || true` | ✅ exists after install | ⬜ pending |
| 3-01-04 | 01 | 1 | RNUP-01 | unit/regression | `npx jest __tests__/utils.test.ts` | ✅ exists | ⬜ pending |
| 3-02-01 | 02 | 2 | RNUP-03 | manual+smoke | `npm run ios` | Manual only | ⬜ pending |
| 3-02-02 | 02 | 2 | RNUP-04 | manual+smoke | `npm run android` | Manual only | ⬜ pending |
| 3-02-03 | 02 | 2 | RNUP-03, RNUP-04 | manual+launch | `npm run ios` + `npm run android` launch proof on simulator/emulator | Manual only | ⬜ pending |
| 3-02-04 | 02 | 2 | RNUP-01 | regression | `npm run test -- --watchAll=false` | ✅ exists | ⬜ pending |
| 3-03-01 | 03 | 3 | RNUP-03 | manual/device | `npm run ios` on simulator + physical device launch proof | Manual only | ⬜ pending |
| 3-03-02 | 03 | 3 | RNUP-04 | manual/device | `npm run android` on emulator + physical device launch proof | Manual only | ⬜ pending |
| 3-03-03 | 03 | 3 | RNUP-05 | manual/checklist | checklist of onboarding, meal CRUD, today summary, history, graphs, tabs | Manual only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers the automated portion of this phase. No new test framework setup is required before execution.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| iOS simulator launch at RN `0.84.1` | RNUP-03 | Native build/launch cannot be trusted from Jest | Run `npm run ios`, confirm cold launch without crash |
| iOS physical-device launch | RNUP-03 | User explicitly requires real-device proof | Launch on one physical iOS device and confirm startup stability |
| Android emulator launch at RN `0.84.1` | RNUP-04 | Native emulator launch is outside Jest scope | Run `npm run android`, confirm cold launch without crash |
| Android physical-device launch | RNUP-04 | User explicitly requires real-device proof | Launch on one physical Android device and confirm startup stability |
| Onboarding trigger still works | RNUP-05 | Requires navigation/storage interaction | Clear onboarding data if needed, cold launch, verify modal flow appears |
| Meal add/edit/delete flows | RNUP-05 | End-to-end UI + storage behavior | Create a meal, edit it, delete it, verify state updates correctly |
| Today summary and history | RNUP-05 | Screen-level integration | Verify daily totals update and saved data appears in history views |
| Macro graphs render correctly | RNUP-05 | High-risk SVG/native rendering path | Open graph-bearing screens and verify all graphs render without crash or visual corruption |
| Tab navigation and modal routing | RNUP-05 | Gesture/navigation proof is visual | Switch tabs and navigate through modal/stack flows without crashes |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or a justified manual-only verification
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify before the final human-verification wave
- [ ] Wave 0 covers all missing automated setup needs
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s for the automated loop
- [ ] `nyquist_compliant: true` set in frontmatter once plan coverage is accepted

**Approval:** pending
