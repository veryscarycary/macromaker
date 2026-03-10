# External Integrations

**Analysis Date:** 2026-03-10

## APIs & External Services

**Not detected.** The application makes no calls to external APIs or cloud services. All operations are local-only.

## Data Storage

**Local Storage:**
- **AsyncStorage** (`@react-native-async-storage/async-storage` v1.24.0)
  - Connection: Built-in React Native persistent storage (no configuration needed)
  - Client: AsyncStorage API accessed via `utils.ts` wrapper functions
  - Key format: `meals@MM/DD/YYYY` for meal data, `basicInfo` for user profile
  - Data structure: JSON-serialized objects

**Databases:**
- Not applicable — No database server. All data persisted locally on device.

**File Storage:**
- Local filesystem only — Image assets stored in `assets/images/` and fonts in `assets/fonts/`

**Caching:**
- Not explicitly implemented — AsyncStorage serves as single data store

## Authentication & Identity

**Auth Provider:**
- None — App has no user authentication. All data is per-device, unsynced.

## Monitoring & Observability

**Error Tracking:**
- Not detected — No error tracking service integrated

**Logs:**
- Console logging only (console.error/console.log) via `utils.ts` and runtime errors

**Analytics:**
- Not detected — No analytics service

## CI/CD & Deployment

**Hosting:**
- App Store (iOS) and Google Play Store (Android) — Mobile app distribution only

**CI Pipeline:**
- Not detected — No CI/CD service configured (no GitHub Actions, Jenkins, etc.)

**Build Commands:**
```bash
npm run start              # Start Metro bundler
npm run ios               # Build and run on iOS simulator
npm run android           # Build and run on Android emulator
npm run test              # Run Jest tests in watch mode
npm run test:single       # Run Jest once (CI mode)
```

## Environment Configuration

**Required env vars:**
- None detected — Application does not read environment variables at runtime

**Secrets location:**
- Not applicable — No external services requiring API keys or secrets

**Configuration:**
- All configuration is hardcoded or computed at runtime
- Constants defined in `constants.ts` (BMR/TDEE calculations, calorie mappings)
- iOS platform config in `ios/macromaker/Info.plist` (URL schemes, app transport security)
- Android platform config in `android/app/build.gradle` (package name, version, SDK versions)

## Webhooks & Callbacks

**Incoming:**
- None — App receives no external webhooks

**Outgoing:**
- None — App sends no data to external services

## Platform-Specific Configuration

**iOS:**
- `CFBundleDisplayName`: "macromaker"
- `CFBundleShortVersionString`: "1.0.0"
- `NSAppTransportSecurity`: Allows arbitrary HTTP loads for localhost (development only)
- URL schemes registered: `myapp`, `com.carymeskell.macrotracker`
- Fonts configured: Ionicons.ttf, Feather.ttf, FontAwesome.ttf (for react-native-vector-icons)

**Android:**
- Package name: `com.carymeskell.macrotracker`
- Version: 1.0.0
- Min SDK: ~21 (standard for modern RN)
- Target SDK: Latest (configured in gradle)
- Debug keystore for development

---

*Integration audit: 2026-03-10*
