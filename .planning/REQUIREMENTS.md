# Requirements: Hone (macromaker)

**Defined:** 2026-03-14
**Core Value:** A fast, offline-first macro tracker where adding a meal and seeing your day's intake takes under 10 seconds.

## v1.0 Requirements (Complete)

See archived phases 1–4. All 25 requirements complete.

## v1.1 Requirements

Requirements for this milestone: design system, branding, and app rename to Hone.

### Token Foundation

- [x] **TOKS-01**: Color token file created with primitive tier (palette) and semantic tier (brand, surface, text, macro colors)
- [x] **TOKS-02**: Typography scale defined — 8 levels (display → overline) using Inter, with typed TypeScript constants
- [x] **TOKS-03**: Spacing scale defined — 8pt grid constants (4, 8, 12, 16, 24, 32, 48, 64)
- [x] **TOKS-04**: Border radius scale defined — 4 levels (xs, sm, md, lg) as typed constants

### Font Integration

- [x] **FONT-01**: Inter static TTF files (Regular, Medium, SemiBold, Bold) added to `assets/fonts/`
- [x] **FONT-02**: `react-native.config.js` configured and `react-native-asset` run to link fonts on both platforms
- [x] **FONT-03**: Inter renders correctly on iOS and Android (smoke test on simulator + physical device)
- [x] **FONT-04**: react-native-vector-icons (Ionicons, Feather, FontAwesome) still render correctly after font linking — `Info.plist` UIAppFonts intact

### Paper Theme Integration

- [x] **PAPR-01**: `design/theme/paperTheme.ts` built from token imports — brand colors mapped to MD3 color roles
- [x] **PAPR-02**: `configureFonts` applied with Inter mapped to all MD3 typography variants using separate weight files
- [ ] **PAPR-03**: `App.tsx` updated to pass `paperTheme` to `PaperProvider`; existing Paper components visually reflect brand tokens

### Component Library

- [x] **COMP-01**: `Text` component with typed variant system (display, heading, subheading, body, bodySmall, caption, label, overline)
- [x] **COMP-02**: `NumericText` component with tabular numerals (`fontVariant: ['tabular-nums']`) for all calorie/macro number displays
- [x] **COMP-03**: `Button` component with primary / secondary / ghost variants consuming brand tokens
- [x] **COMP-04**: `Card` component — surface container with radius token and optional border
- [x] **COMP-05**: `MacroProgressBar` component consuming `colors.macro.*` tokens

### Screen Migration

- [x] **MIGR-01**: Onboarding screens (WelcomeScreen, BasicInfoScreen, MoreInfoScreen) migrated to design system tokens and components
- [ ] **MIGR-02**: AddFoodScreen and EditFoodScreen migrated to design system tokens and components
- [x] **MIGR-03**: DietTodayScreen migrated to design system tokens and components
- [x] **MIGR-04**: DietHistoryScreen and DailyDietScreen migrated to design system tokens and components
- [ ] **MIGR-05**: FitnessScreen migrated to design system tokens and components
- [x] **MIGR-06**: D3 graph components (BarGraph, MealTimeGraph, TotalCaloriesGraph) updated to use `colors.macro.*` tokens for fills; SVG `<Text>` stays on system fonts (documented carve-out)
- [ ] **MIGR-07**: `constants/Colors.ts` shim deleted; no hardcoded hex values remain in any screen or component file

### Brand Identity

- [ ] **BRAND-01**: App display name updated from "macromaker" to "Hone" on iOS and Android
- [ ] **BRAND-02**: Hone logo mark designed as SVG — geometric mark suitable for icon and splash use
- [ ] **BRAND-03**: Splash screen updated with Hone branding via `react-native-bootsplash` CLI
- [ ] **BRAND-04**: App icon generated for iOS and Android from Hone logo mark

## v2 Requirements

Deferred from v1.0 and v1.1.

### History Views

- **HIST-01**: 7-day rolling average summary card in DietHistoryScreen (data layer `getAveragesFromDietDays` already exists)
- **HIST-02**: Trend arrow comparing this week's average to last week

### Notifications

- **NOTF-01**: Daily notification when calorie deficit reached
- **NOTF-02**: Daily notification when calorie surplus reached
- **NOTF-03**: Weekly macro imbalance notification

### Food Discovery

- **FOOD-01**: Food search via nutrition API
- **FOOD-02**: Barcode scanning for packaged foods

### Design System Extensions

- **DS-01**: Dark mode — semantic token layer makes it addable; defer until user demand
- **DS-02**: Animated MacroProgressBar fill via Reanimated v3
- **DS-03**: Shadow tokens applied to Card components (verify cross-platform behavior first)
- **DS-04**: Icon wrapper component for consistent sizing over raw vector-icon calls
- **DS-05**: EmptyState component for history and fitness tab empty states

## Out of Scope

| Feature | Reason |
|---------|--------|
| Cloud sync / backend | Local-only architecture; no revenue model for infrastructure |
| Apple Health / HealthKit | Significant native work; not core to v1.1 |
| Social / sharing | Out of scope for MVP |
| ThemeProvider context / CSS-in-JS | Unnecessary for light-mode-only; adds runtime overhead with no benefit |
| react-native-unistyles (v2 or v3) | v3 requires New Architecture (we are bridge-compat); v2 is EOL Dec 2025 |
| styled-components | Runtime overhead; wrong tool for token-driven approach |
| Variable Inter font file | Renders only default weight on Android; static per-weight TTF files required |
| Storybook component catalog | Not valuable for solo app under 30 components |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TOKS-01 | Phase 5 | Complete |
| TOKS-02 | Phase 5 | Complete |
| TOKS-03 | Phase 5 | Complete |
| TOKS-04 | Phase 5 | Complete |
| FONT-01 | Phase 5 | Complete |
| FONT-02 | Phase 5 | Complete |
| FONT-03 | Phase 5 | Complete |
| FONT-04 | Phase 5 | Complete |
| PAPR-01 | Phase 6 | Complete |
| PAPR-02 | Phase 6 | Complete |
| PAPR-03 | Phase 6 | Pending |
| COMP-01 | Phase 7 | Complete |
| COMP-02 | Phase 7 | Complete |
| COMP-03 | Phase 7 | Complete |
| COMP-04 | Phase 7 | Complete |
| COMP-05 | Phase 7 | Complete |
| MIGR-01 | Phase 8 | Complete |
| MIGR-02 | Phase 8 | Pending |
| MIGR-03 | Phase 8 | Complete |
| MIGR-04 | Phase 8 | Complete |
| MIGR-05 | Phase 8 | Pending |
| MIGR-06 | Phase 8 | Complete |
| MIGR-07 | Phase 8 | Pending |
| BRAND-01 | Phase 9 | Pending |
| BRAND-02 | Phase 9 | Pending |
| BRAND-03 | Phase 9 | Pending |
| BRAND-04 | Phase 9 | Pending |

**Coverage:**
- v1.1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-14*
*Last updated: 2026-03-14 — traceability populated after roadmap creation*
