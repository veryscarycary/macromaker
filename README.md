# macromaker

React Native app for organizing fitness goals and managing macros.

<img src="https://user-images.githubusercontent.com/16945851/126695801-553d1477-e4b4-403b-a77a-0399b5a7059c.png" width="350" />

Other possible names:
MacroTracker

### LucidChart

Serves as a way to diagram ideas before we spend time on wireframes

https://lucid.app/lucidchart/dc5f10e5-3a72-486f-9086-483d465563b4/edit?page=0_0#

Library that contains iPhone assets to copy over: https://www.figma.com/file/WbIBSgvsEFeqqktKwtO6YN/Mobile-Wireframe-UI-Kit-(Community)?node-id=55%3A104

### Figma

Serves as a way to mock wireframes before we spend time on dev

https://www.figma.com/file/kDphCXUSYfVt3Qb1mwZxAW/Untitled?node-id=0%3A1


### Mission

To create a diet mobile app that focuses on the philosophy that properly handling macro ratios in tandem with calorie management will help to achieve fitness goals. This project is intended to follow an MVP approach. Higher level ideation is not out of the question, but the goal should be to focus on simple, core features to get to market in as little time as possible.

Here is a tentative feature list:

- Live record of today's calorie/macro intake
- History of previous days and their calorie/macro intakes
- Running average of total OR 7-day(or other amount) calorie/macro intake
- Notifications that alert you when, both daily and weekly(depending on goal):
    - Calorie deficit
    - Calorie surplus
    - Macro imbalance
- Add food form, to add nutrition information to today's running total
    - Includes both a manual entry as well as a search with food API/barcode integration
- Remove food from today's record (in the case of addition mistakes)


### Technical Notes

With the intention of keeping this a simple, usable, shippable app, billable third party services should be kept to a minumum as there is not a revenue model in place at this moment. Most of the functionality that we desire for the current MVP can be achieved by utilizing storage and utilities provided on the device, rather than depending on a remote service. That being said, we can expand to use those of the use case permits it.

---

## Setup (macOS Tahoe — fresh machine)

**Stack:** RN 0.84.1 · React 19 · Node 23 · Java 17 · iOS 15.1+ · Android API 36

### Prerequisites

```bash
# 1. Xcode — install from Mac App Store, then:
xcode-select --install && sudo xcodebuild -license accept

# 2. Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# Apple Silicon only — add to ~/.zprofile:
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile && source ~/.zprofile

# 3. Node via nvm
brew install nvm
mkdir ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"\n[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zprofile
source ~/.zprofile
nvm install 23 && nvm use 23

# 4. Watchman
brew install watchman

# 5. Ruby + CocoaPods (iOS)
brew install rbenv ruby-build
rbenv install 3.3.0 && rbenv global 3.3.0
echo 'eval "$(rbenv init - zsh)"' >> ~/.zprofile && source ~/.zprofile
gem install cocoapods

# 6. Java 17 (Android)
brew install --cask zulu@17
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zprofile && source ~/.zprofile

# 7. Android SDK — install Android Studio from https://developer.android.com/studio
#    In SDK Manager install: Android 16 (API 36), Build-Tools 36, NDK 27.1.12297006, Emulator
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zprofile
echo 'export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.zprofile
source ~/.zprofile
```

### Project

```bash
git clone <repo-url> macromaker && cd macromaker
npm install
cd ios && pod install && cd ..   # iOS only
```

### Run

```bash
npm start                        # Metro bundler (always first)
npm run ios                      # iOS simulator
npm run android                  # Android (start emulator first — see below)
```

### Android Emulator

Create a **Pixel 6 / API 36** AVD in Android Studio → Device Manager, then:

```bash
# Start emulator
~/Library/Android/sdk/emulator/emulator @Pixel_6_API_36 &

# If it errors "AVD already running", clear the stale ADB entry:
adb kill-server && adb start-server && adb disconnect emulator-5556
```

### Fastest Dev Flow

| Task | Command |
|------|---------|
| Reload JS | `RR` in emulator / `Cmd+R` in simulator |
| Reset Metro cache | `npm start -- --reset-cache` |
| Clean iOS build | `cd ios && pod install && cd .. && npm run ios` |
| Clean Android build | `cd android && ./gradlew clean && cd .. && npm run android` |
| Run tests | `npm test` · single file: `npx jest __tests__/utils.test.ts` |

### Common Fixes

- **Icons missing on Android** — `android/app/build.gradle` must have `apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"`, then full rebuild.
- **`pod install` fails** — `cd ios && pod repo update && pod install`
- **Metro stale cache** — `npm start -- --reset-cache`
