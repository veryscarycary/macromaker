# Roadmap: macromaker → Hone

## Milestones

- ✅ **v1.0 RN 0.84.1 Upgrade + Onboarding Polish** — Phases 1-4 (shipped 2026-03-13)
- 🚧 **v1.1 Design System & Branding** — Phases 5-9 (in progress)
- 📋 **v2.0** — Phases 10+ (planned)

## Phases

<details>
<summary>✅ v1.0 RN 0.84.1 Upgrade + Onboarding Polish (Phases 1-4) — SHIPPED 2026-03-13</summary>

- [x] Phase 1: Dependency Audit (2/2 plans) — completed 2026-03-11
- [x] Phase 2: Infrastructure Upgrade (6/6 plans) — completed 2026-03-12
- [x] Phase 3: RN 0.84.1 Final Upgrade (4/4 plans) — completed 2026-03-13
- [x] Phase 4: Onboarding UX Polish (5/5 plans) — completed 2026-03-13

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### 🚧 v1.1 Design System & Branding (In Progress)

**Milestone Goal:** Establish a cohesive design system — tokens, typography, and a component library — that gives the app a clean, minimal, Notion/Linear aesthetic with a distinctive slate + orange color identity and consistent light-mode UI. Rename app to Hone.

- [x] **Phase 5: Token Foundation + Font Integration** - Design token files and verified Inter font on both platforms (completed 2026-03-15)
- [ ] **Phase 6: Paper Theme Integration** - Brand tokens wired into react-native-paper's PaperProvider
- [ ] **Phase 7: Component Library** - Core reusable components consuming design tokens
- [ ] **Phase 8: Screen Migration** - All existing screens migrated to design system tokens and components
- [ ] **Phase 9: Brand Identity** - App renamed to Hone with new logo, splash screen, and app icon

## Phase Details

### Phase 5: Token Foundation + Font Integration
**Goal**: The design token system and brand font exist, are verified on both platforms, and are safe to build on
**Depends on**: Phase 4
**Requirements**: TOKS-01, TOKS-02, TOKS-03, TOKS-04, FONT-01, FONT-02, FONT-03, FONT-04
**Success Criteria** (what must be TRUE):
  1. Five token files exist in `design/tokens/` (colors, typography, spacing, radius, shadows) with full TypeScript types and a barrel index
  2. Inter renders in four weights (Regular, Medium, SemiBold, Bold) on both iOS simulator and physical iOS device
  3. Inter renders correctly on Android simulator after font linking
  4. react-native-vector-icons (Ionicons, Feather, FontAwesome) still display correctly on iOS — Info.plist UIAppFonts intact after react-native-asset run
**Plans**: 3 plans

Plans:
- [ ] 05-01-PLAN.md — Design token files (colors, typography, spacing, radius, shadows) with TDD
- [ ] 05-02-PLAN.md — Inter font download, react-native.config.js, asset linking, Info.plist audit
- [ ] 05-03-PLAN.md — Font smoke test screen, visual verification on all platforms, cleanup

### Phase 6: Paper Theme Integration
**Goal**: react-native-paper is wired to design tokens so existing Paper components visually reflect brand colors and Inter typography
**Depends on**: Phase 5
**Requirements**: PAPR-01, PAPR-02, PAPR-03
**Success Criteria** (what must be TRUE):
  1. `design/theme/paperTheme.ts` exists and is built entirely from token imports — no hardcoded color or font values in the file
  2. Paper components in AddFoodScreen (Searchbar, TextInput) visually reflect brand colors (slate primary, orange accent) on both platforms
  3. Paper components render Inter in the correct weight on Android — no silent fallback to system font
**Plans**: 2 plans

Plans:
- [ ] 06-01-PLAN.md — TDD: paperTheme.ts with brand colors (MD3 color roles) and Inter fonts (configureFonts per-variant)
- [ ] 06-02-PLAN.md — App.tsx wiring: replace colorScheme-conditional with imported paperTheme; visual checkpoint

### Phase 7: Component Library
**Goal**: Core reusable UI components exist in `design/components/`, consume tokens directly, and are ready for screen migration
**Depends on**: Phase 6
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, COMP-05
**Success Criteria** (what must be TRUE):
  1. `Text` component renders all 8 variants (display through overline) using Inter with correct weights and sizes from typography tokens
  2. `NumericText` component renders calorie and macro numbers with tabular numerals — digits are fixed-width, no layout shift on value change
  3. `Button` (primary/secondary/ghost), `Card`, and `MacroProgressBar` components all source their colors from design tokens — no hardcoded values
  4. `MacroProgressBar` displays carbs, protein, and fat fills using `colors.macro.*` tokens, matching the colors used in D3 graph fills
**Plans**: TBD

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD

### Phase 8: Screen Migration
**Goal**: Every existing screen and graph component consumes design system tokens and components; all hardcoded style values are gone
**Depends on**: Phase 7
**Requirements**: MIGR-01, MIGR-02, MIGR-03, MIGR-04, MIGR-05, MIGR-06, MIGR-07
**Success Criteria** (what must be TRUE):
  1. All 8 screens (WelcomeScreen, BasicInfoScreen, MoreInfoScreen, AddFoodScreen, EditFoodScreen, DietTodayScreen, DietHistoryScreen, DailyDietScreen, FitnessScreen) visually consistent — same spacing, typography scale, and color palette across the full app
  2. D3 graph macro fills (BarGraph, MealTimeGraph, TotalCaloriesGraph) use `colors.macro.*` token values — fills match the MacroProgressBar component colors
  3. `constants/Colors.ts` file no longer exists in the codebase — grep for the file returns no results
  4. No hardcoded hex color values remain in any screen or component file — grep for `#[0-9a-fA-F]{3,6}` in `screens/` and `components/` returns no matches
**Plans**: TBD

Plans:
- [ ] 08-01: TBD
- [ ] 08-02: TBD
- [ ] 08-03: TBD

### Phase 9: Brand Identity
**Goal**: The app is named Hone everywhere it appears — on the home screen, splash screen, and in the OS — with a new geometric logo mark
**Depends on**: Phase 5
**Requirements**: BRAND-01, BRAND-02, BRAND-03, BRAND-04
**Success Criteria** (what must be TRUE):
  1. The app displays as "Hone" on iOS home screen and Android launcher — "macromaker" name is gone from both platforms
  2. A geometric SVG logo mark exists and is used as the source for both the splash screen and app icon
  3. The splash screen shows Hone branding (logo + wordmark or logo alone) — react-native-bootsplash CLI used for generation
  4. App icons are generated and installed for iOS (all required sizes) and Android (all required densities) from the Hone logo mark
**Plans**: TBD

Plans:
- [ ] 09-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 5 → 6 → 7 → 8, with Phase 9 executable after Phase 5 (mostly independent).

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Dependency Audit | v1.0 | 2/2 | Complete | 2026-03-11 |
| 2. Infrastructure Upgrade | v1.0 | 6/6 | Complete | 2026-03-12 |
| 3. RN 0.84.1 Final Upgrade | v1.0 | 4/4 | Complete | 2026-03-13 |
| 4. Onboarding UX Polish | v1.0 | 5/5 | Complete | 2026-03-13 |
| 5. Token Foundation + Font Integration | 3/3 | Complete   | 2026-03-15 | - |
| 6. Paper Theme Integration | v1.1 | 0/2 | Not started | - |
| 7. Component Library | v1.1 | 0/? | Not started | - |
| 8. Screen Migration | v1.1 | 0/? | Not started | - |
| 9. Brand Identity | v1.1 | 0/? | Not started | - |
