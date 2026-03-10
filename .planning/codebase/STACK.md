# Technology Stack

**Analysis Date:** 2026-03-10

## Languages

**Primary:**
- TypeScript 5.7.3 - Application code, components, utilities, and context
- JavaScript (ES2025) - Configuration files (babel.config.js, metro.config.js, index.js)
- Swift - iOS native code (CocoaPods dependencies)
- Kotlin - Android native code

**Secondary:**
- JSX/TSX - React component syntax throughout the codebase

## Runtime

**Environment:**
- React Native 0.73.6 - Cross-platform mobile app framework (bare, non-Expo)
- Node.js - Build and development tooling (version specified in package-lock.json)

**Package Manager:**
- npm 10+ (inferred from package-lock.json v3)
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- React 18.2.0 - UI library
- React Native 0.73.6 - Native mobile framework (iOS/Android)

**Navigation:**
- @react-navigation/native 6.1.18 - Navigation core
- @react-navigation/stack 6.4.1 - Stack navigator
- @react-navigation/bottom-tabs 6.6.1 - Tab-based navigation

**UI Components:**
- @rneui/themed 4.0.0-rc.8 - React Native Elements UI components (Input, SearchBar, ListItem)
- react-native-gesture-handler 2.14.0 - Gesture handling (required at app root)
- react-native-reanimated 3.6.0 - Animations and gesture responses

**Graphics & Visualization:**
- react-native-svg 15.15.3 - SVG rendering for custom D3 graphs
- d3 5.15.1 - Data visualization calculations
- d3-scale 3.2.1 - Scale functions for charts

**Icons:**
- react-native-vector-icons 10.2.0 - Icon library (Ionicons, Feather, FontAwesome)

**Testing:**
- Jest 29+ (preset: react-native)

**Build/Dev:**
- @react-native/metro-config 0.84.1 - Metro bundler configuration
- @babel/core 7.25.0 - JavaScript transpiler
- Babel preset: @react-native/babel-preset - React Native specific Babel configuration

## Key Dependencies

**Critical:**
- @react-native-async-storage/async-storage 1.24.0 - **Primary data persistence layer** — all meal records and user info stored here

**Utilities:**
- lodash 4.17.21 - Utility functions (sortBy, etc.)
- dayjs 1.11.13 - Date parsing and manipulation
- uuid 9.0.1 - Unique ID generation (meal IDs)
- react-native-get-random-values 1.11.0 - Cryptographic random values (dep of uuid)

**Native Modules:**
- react-native-safe-area-context 4.14.0 - Safe area handling (notches, etc.)
- react-native-screens 3.23.0 - Native screen management
- react-native-splash-screen 3.3.0 - Splash screen display
- @react-native-picker/picker 2.9.0 - Native picker component
- @react-native-community/slider 4.5.5 - Native slider component

**Build Tools:**
- execa 5.1.1 - Process execution (likely for build scripts)

## Configuration

**Environment:**
- Configuration is compile-time only; no runtime .env file reading
- Development and production builds use same code path (no environment-specific code detected)
- Native platform config in `ios/macromaker/Info.plist` and `android/app/build.gradle`

**Build Configuration:**
- `babel.config.js` - Babel transpilation setup with react-native-reanimated plugin
- `metro.config.js` - Metro bundler configuration (minimal, uses defaults)
- `tsconfig.json` - TypeScript compiler options (ESNext target, JSX react-native, strict mode)

**Platform-Specific:**
- iOS: `ios/macromaker.xcodeproj` and `ios/macromaker.xcworkspace` (CocoaPods)
- Android: `android/build.gradle` and `android/app/build.gradle` (Gradle)

## Platform Requirements

**Development:**
- macOS (for iOS development) - Xcode, CocoaPods
- macOS/Linux/Windows (for Android development) - Android SDK, emulator
- Node.js 18+
- npm or yarn package manager

**Production:**
- **iOS:** Apple App Store (deployment target iOS 12+, based on standard RN requirements)
- **Android:** Google Play Store (minSdkVersion ~21, targeting latest SDK)
- Both platforms use bare React Native (fully ejected from Expo)

---

*Stack analysis: 2026-03-10*
