# Build Instructions for Client

## Project Information
- **App Name**: ibeni
- **Bundle ID**: com.ibeni.app
- **Platforms**: Android (AAB) & iOS

---

## INFORMATION NEEDED FROM CLIENT

### For Android AAB Build:

#### If client has an existing keystore (from previous app versions):
Please provide:
1. **Keystore file** (.jks or .keystore file)
2. **Keystore password**
3. **Key alias name**
4. **Key password**

#### If this is a NEW app (no existing keystore):
We can create a new keystore, or client can create one. **IMPORTANT**: Client must keep the keystore file and passwords secure forever - they cannot publish app updates without it.

### For iOS Build:

Client needs to provide ONE of these options:

#### Option 1: Add developer to Apple Developer Team (RECOMMENDED)
- Client adds your Apple ID to their Apple Developer account
- Go to: https://developer.apple.com/account → People
- Add your Apple ID with "Developer" or "Admin" role
- You can then sign and build the app in Xcode

#### Option 2: Client builds it themselves (EASIEST)
- You send them the complete iOS project folder
- They open it on their Mac in Xcode
- They configure signing with their account
- They build and submit to App Store

#### Option 3: Client provides certificates
- Client exports their distribution certificate and provisioning profile
- Sends them to you
- You import into Xcode
- (This is more complex - not recommended)

---

## BUILD PROCESS

### Android AAB Build

#### Step 1: Configure Signing
Create/edit file: `android/app/build.gradle`

Add before the `android {` block:
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Inside the `android {` block, add:
```gradle
signingConfigs {
    release {
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

#### Step 2: Create keystore.properties
Create file: `android/keystore.properties` (DO NOT commit this file!)

```properties
storeFile=/path/to/your/keystore.jks
storePassword=YourKeystorePassword
keyAlias=YourKeyAlias
keyPassword=YourKeyPassword
```

#### Step 3: Build AAB
```bash
cd android
./gradlew bundleRelease
```

Output file location: `android/app/build/outputs/bundle/release/app-release.aab`

---

### iOS Build

#### Step 1: Requirements
- Mac computer with macOS
- Xcode installed (from Mac App Store)
- Apple Developer account (client's account)

#### Step 2: Open Project
```bash
npx cap open ios
```
Or manually open: `ios/App/App.xcworkspace` in Xcode

#### Step 3: Configure Signing in Xcode
1. Select "App" target in left sidebar
2. Go to "Signing & Capabilities" tab
3. Select client's Team from dropdown
4. Xcode will automatically manage provisioning profiles

#### Step 4: Build Archive
1. Select "Any iOS Device" from device dropdown (top of Xcode)
2. Product → Archive
3. Wait for build to complete
4. Organizer window will open

#### Step 5: Distribute
1. Click "Distribute App"
2. Choose distribution method:
   - **App Store Connect**: For submitting to App Store
   - **Ad Hoc**: For testing on specific devices
   - **Enterprise**: For internal distribution (requires Enterprise account)
   - **Development**: For development testing

---

## UPDATING THE APP (After code changes)

Every time you make changes to the code:

```bash
# 1. Build web app
npm run build

# 2. Sync to native platforms
npx cap sync

# 3. For Android - rebuild AAB
cd android
./gradlew bundleRelease

# 4. For iOS - open Xcode and archive again
npx cap open ios
```

---

## CHECKLIST FOR CLIENT

### Android Delivery:
- [ ] Keystore file received from client OR new keystore created and given to client
- [ ] AAB file built: `app-release.aab`
- [ ] AAB file tested/validated
- [ ] AAB file sent to client

### iOS Delivery:
- [ ] Developer added to client's Apple Developer team, OR
- [ ] iOS project folder sent to client for them to build, OR
- [ ] IPA file built and sent to client
- [ ] App successfully uploaded to App Store Connect (if you're doing it)

---

## NOTES

- **Keystore**: Client MUST keep this safe. Loss = cannot update app
- **Bundle ID**: `com.ibeni.app` - must match in App Store Connect & Google Play Console
- **App Name**: "ibeni" - can be changed in stores independently
- **Version**: Update in `android/app/build.gradle` (versionCode, versionName) and iOS target settings
