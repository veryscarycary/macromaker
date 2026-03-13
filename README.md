# macromaker

React Native macro/calorie tracking app. Bare RN 0.84.1, New Architecture (Fabric + Hermes), no Expo, no backend — all data stored locally via AsyncStorage.

---

## Quick Dev Reference

```bash
npm start                  # Metro bundler
npm run ios                # iOS simulator (requires setup below)
npm run android            # Android emulator (requires setup below)
npm test                   # Jest (watch mode)
```

**Hot reload:** `R` twice in simulator/emulator, or shake → Reload.

---

## Full Setup — Fresh macOS Tahoe Machine

### 1. Xcode

Install from the **Mac App Store** → open it once to accept the license.

```bash
xcode-select --install                        # CLI tools
sudo xcodebuild -license accept
```

Confirm: `Xcode → Settings → Platforms` has **iOS 18+** downloaded.

---

### 2. Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Add to `~/.zprofile` if prompted (Apple Silicon path):
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile && source ~/.zprofile
```

---

### 3. Node (via nvm)

```bash
brew install nvm
mkdir ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"'$'\n''[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zprofile
source ~/.zprofile

nvm install 23
nvm use 23
node --version   # → v23.x
```

---

### 4. Watchman

```bash
brew install watchman
```

---

### 5. Ruby + CocoaPods (iOS)

macOS ships Ruby but use rbenv for a clean install:

```bash
brew install rbenv ruby-build
rbenv install 3.3.0
rbenv global 3.3.0
echo 'eval "$(rbenv init - zsh)"' >> ~/.zprofile && source ~/.zprofile

gem install cocoapods
pod --version   # → 1.16.x
```

---

### 6. Java (Android)

RN 0.84.1 requires **Java 17**:

```bash
brew install --cask zulu@17
# Add to ~/.zprofile:
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zprofile
source ~/.zprofile
java -version   # → 17.x
```

---

### 7. Android Studio + SDK

1. Download **Android Studio** → [developer.android.com/studio](https://developer.android.com/studio)
2. Open it, run the setup wizard (installs SDK, emulator, etc.)
3. In **SDK Manager** (`Settings → Languages & Frameworks → Android SDK`):
   - **SDK Platforms:** Android 16 (API 36) ✓
   - **SDK Tools:** Android SDK Build-Tools 36, NDK 27.1.12297006, Android Emulator ✓

Add to `~/.zprofile`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```
```bash
source ~/.zprofile
adb --version   # confirms PATH
```

---

### 8. Android Emulator (Pixel 6)

In Android Studio → **Device Manager** → Create Virtual Device:
- Phone → **Pixel 6**
- System Image → **API 36** (x86_64, Google APIs)
- Name it `Pixel_6_API_36`

Or create via CLI:
```bash
avdmanager create avd -n Pixel_6_API_36 -k "system-images;android-36;google_apis;x86_64" -d "pixel_6"
```

---

### 9. Project Setup

```bash
git clone <repo-url> macromaker && cd macromaker
npm install

# iOS — install pods
cd ios && pod install && cd ..

# Android — no extra step; gradle downloads deps on first build
```

---

## Running the App

### iOS

```bash
# Terminal 1
npm start

# Terminal 2
npm run ios
# or target a specific simulator:
npx react-native run-ios --simulator="iPhone 17 Pro"
```

### Android

```bash
# Start emulator first (from a terminal, not Android Studio):
~/Library/Android/sdk/emulator/emulator @Pixel_6_API_36 &

# Wait for boot (~30s), then:
npm start          # Terminal 1
npm run android    # Terminal 2
```

> **Stale emulator?** If `npm run android` errors on a device already connected:
> ```bash
> adb kill-server && adb start-server
> adb disconnect emulator-5556   # if still listed
> ```

---

## Fastest Dev Flow

| Task | Command |
|------|---------|
| Start Metro only | `npm start` |
| Reload JS bundle | `RR` in emulator, or `npx react-native reload` |
| Open React DevTools | `npm start` → press `j` |
| Open element inspector | Shake / `Cmd+M` → Toggle Inspector |
| Run single test | `npx jest __tests__/utils.test.ts` |
| Run all tests | `npm test` |
| iOS clean build | `cd ios && pod install && cd .. && npm run ios` |
| Android clean build | `cd android && ./gradlew clean && cd .. && npm run android` |
| Kill metro + cache | `npm start -- --reset-cache` |

---

## Troubleshooting

**`pod install` fails**
```bash
cd ios && pod repo update && pod install
```

**Android build fails with NDK error**
Confirm NDK `27.1.12297006` is installed in Android Studio SDK Manager → SDK Tools → NDK (Side by side).

**Icons missing on Android (boxes instead of icons)**
`android/app/build.gradle` must include:
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```
Then do a full rebuild: `npm run android`.

**Metro cache issues**
```bash
npm start -- --reset-cache
```

**iOS build fails after `npm install`**
```bash
cd ios && pod install && cd ..
```

---

## Mission

Diet app focused on macro ratio management + calorie tracking to support fitness goals. MVP-first, fully offline — no backend, no billable third-party services.
