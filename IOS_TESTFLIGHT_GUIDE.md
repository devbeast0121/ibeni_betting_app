# iOS Build & TestFlight Distribution Guide

## 📱 Project Information
- **App Name**: ibeni
- **Bundle ID**: `com.ibeni.app`
- **Platform**: iOS 14.0+
- **Framework**: Capacitor 7.x

---

## ✅ Pre-Build Checklist

Before building for TestFlight, ensure:

- [ ] **Apple Developer Account**: Active paid membership ($99/year)
- [ ] **App Store Connect**: App created with Bundle ID `com.ibeni.app`
- [ ] **Xcode**: Latest version installed (14.0+)
- [ ] **macOS**: Running on Mac (required for iOS builds)
- [ ] **Code Signing**: Developer team configured in Xcode
- [ ] **Web Build**: Latest web assets built (`npm run build`)
- [ ] **Capacitor Sync**: Native project synced (`npx cap sync ios`)

---

## 🔧 Step 1: Prepare the Project

### 1.1 Build Web Assets
```bash
# Navigate to project root
cd /path/to/project

# Install dependencies (if needed)
npm install

# Build the web app
npm run build
```

### 1.2 Sync Capacitor
```bash
# Sync web assets to iOS native project
npx cap sync ios
```

This command:
- Copies `dist/` folder to `ios/App/App/public/`
- Updates native dependencies
- Ensures all plugins are properly linked

---

## 🏗️ Step 2: Configure Xcode Project

### 2.1 Open Project in Xcode
```bash
npx cap open ios
```

Or manually:
- Open `ios/App/App.xcworkspace` (⚠️ **NOT** `.xcodeproj`)

### 2.2 Configure Signing & Capabilities

1. **Select the Project**:
   - Click "App" project in left sidebar
   - Select "App" target
   - Go to "Signing & Capabilities" tab

2. **Configure Team**:
   - Check "Automatically manage signing"
   - Select your **Apple Developer Team** from dropdown
   - Xcode will automatically:
     - Create/update provisioning profiles
     - Configure code signing certificates

3. **Verify Bundle Identifier**:
   - Should be: `com.ibeni.app`
   - Must match App Store Connect exactly

4. **Add Push Notifications Capability** (if not auto-added):
   - Click "+ Capability"
   - Add "Push Notifications"
   - Add "Background Modes" → Enable "Remote notifications"

### 2.3 Update Version Numbers

1. **Select "App" target** → "General" tab
2. **Version**: Marketing version (e.g., `1.0.0`)
   - This is what users see
   - Update for each release
3. **Build**: Build number (e.g., `1`)
   - Must increment for each TestFlight upload
   - Can be same as version or separate counter

**Current Settings** (from project.pbxproj):
- `MARKETING_VERSION = 1.0`
- `CURRENT_PROJECT_VERSION = 1`

**To Update**:
- In Xcode: General tab → Version & Build fields
- Or edit `project.pbxproj` directly (not recommended)

---

## 📦 Step 3: Build Archive

### 3.1 Select Build Target
1. In Xcode top toolbar, select:
   - **Device**: "Any iOS Device" (not a simulator)
   - **Scheme**: "App"
   - **Configuration**: "Release"

### 3.2 Clean Build Folder
```
Product → Clean Build Folder (Shift + Cmd + K)
```

### 3.3 Create Archive
```
Product → Archive
```

**What happens**:
- Xcode builds the app in Release mode
- Creates an archive (.xcarchive file)
- Validates code signing
- Takes 2-5 minutes depending on project size

**If errors occur**:
- Check signing configuration
- Verify all dependencies are installed (`pod install` in `ios/App/`)
- Check for missing certificates/profiles

### 3.4 Verify Archive
After archive completes:
- Organizer window opens automatically
- Verify:
  - ✅ Archive appears in list
  - ✅ No warnings/errors
  - ✅ Correct version number shown

---

## 🚀 Step 4: Distribute to TestFlight

### 4.1 Open Organizer
If not already open:
```
Window → Organizer (Shift + Cmd + O)
```

### 4.2 Distribute App
1. **Select your archive** (latest one)
2. Click **"Distribute App"** button
3. **Choose distribution method**:
   - ✅ **App Store Connect** (for TestFlight/App Store)
   - ❌ Ad Hoc (for specific devices only)
   - ❌ Enterprise (requires Enterprise account)
   - ❌ Development (for development testing)

### 4.3 Distribution Options
1. **Distribution Method**: App Store Connect
2. **Distribution Options**:
   - ✅ **Upload** (recommended - uploads to App Store Connect)
   - ❌ Export (downloads IPA file - use if uploading manually)

3. **App Thinning**:
   - ✅ Include bitcode (if supported)
   - ✅ Upload symbols (for crash reports)

4. **Distribution Certificate**:
   - ✅ Automatically manage signing (recommended)
   - Or manually select certificate

### 4.4 Review & Upload
1. **Review Summary**:
   - App name: ibeni
   - Bundle ID: com.ibeni.app
   - Version: [your version]
   - Build: [your build number]

2. Click **"Upload"**
3. **Wait for upload**:
   - Progress bar shows upload status
   - Takes 5-15 minutes depending on file size
   - Requires stable internet connection

4. **Upload Complete**:
   - ✅ Success message appears
   - Processing begins on Apple's servers (15-60 minutes)

---

## 📲 Step 5: Configure TestFlight in App Store Connect

### 5.1 Access App Store Connect
1. Go to: https://appstoreconnect.apple.com
2. Sign in with Apple Developer account
3. Navigate to **"My Apps"**
4. Select **"ibeni"** app

### 5.2 Wait for Processing
- After upload, build appears in **TestFlight** tab
- Status: **"Processing"** → **"Ready to Submit"**
- Usually takes **15-60 minutes**
- You'll receive email when ready

### 5.3 Add Test Information (First Time)
1. **Test Information**:
   - What to Test: Brief description of what testers should focus on
   - Feedback Email: Email for test feedback
   - Marketing URL (optional): Website URL
   - Privacy Policy URL (required for App Store submission)

2. **App Information**:
   - Description
   - Keywords
   - Support URL
   - Marketing URL

### 5.4 Add Internal Testers
1. Go to **TestFlight** tab
2. Select **"Internal Testing"**
3. Click **"+"** to add testers
4. **Add Testers**:
   - Must be part of your App Store Connect team
   - Add by email/Apple ID
   - Up to 100 internal testers

5. **Select Build**:
   - Choose the build you just uploaded
   - Click **"Start Testing"**

### 5.5 Add External Testers (Beta Testing)
1. Go to **TestFlight** tab
2. Select **"External Testing"**
3. **Create Group** (if first time):
   - Name: "Beta Testers" or similar
   - Add testers by email (up to 10,000)
   - Testers don't need to be in your team

4. **Select Build**:
   - Choose your build
   - **Submit for Beta Review** (required for external testing)
   - Apple reviews external TestFlight builds (24-48 hours)

5. **Beta Review Information**:
   - What's New: Changes in this build
   - Notes: Additional testing notes
   - Contact Information
   - Demo Account (if needed)

---

## ✅ Step 6: TestFlight Testing

### 6.1 Tester Experience
1. **Testers receive email** invitation
2. **Install TestFlight app** from App Store (if not installed)
3. **Accept invitation** in TestFlight app
4. **Download and test** the app

### 6.2 Monitor Feedback
- **TestFlight Dashboard**: View tester feedback
- **Crash Reports**: Automatic crash reporting
- **Analytics**: Usage statistics

---

## 🔄 Updating the App

For each new version:

1. **Update Version/Build**:
   ```bash
   # In Xcode: General tab → Version & Build
   # Or update project.pbxproj
   ```

2. **Build Web Assets**:
   ```bash
   npm run build
   npx cap sync ios
   ```

3. **Create New Archive**:
   - Product → Archive
   - Build number must be higher than previous

4. **Upload to TestFlight**:
   - Follow Step 4 above
   - New build appears in TestFlight

5. **Update Test Groups**:
   - Select new build in TestFlight
   - Replace old build with new one

---

## 🐛 Troubleshooting

### Build Errors

**"No signing certificate found"**
- Solution: Add your Apple ID to Xcode → Preferences → Accounts
- Select team and click "Download Manual Profiles"

**"Provisioning profile doesn't match"**
- Solution: Clean build folder, ensure Bundle ID matches App Store Connect

**"Missing required icon"**
- Solution: Add app icons in Assets.xcassets → AppIcon

**"Archive failed"**
- Solution: 
  - Clean build folder (Shift + Cmd + K)
  - Check for Swift/Objective-C errors
  - Verify all pods installed: `cd ios/App && pod install`

### Upload Errors

**"Invalid Bundle"**
- Solution: Check Info.plist for required keys
- Verify version numbers are valid

**"Upload timeout"**
- Solution: Check internet connection, try again
- Upload can take 15+ minutes for large apps

**"Processing failed"**
- Solution: Check email for specific error
- Common: Missing privacy descriptions, invalid icons

### TestFlight Issues

**Build stuck in "Processing"**
- Normal: Can take up to 60 minutes
- Check email for errors
- Contact Apple Support if > 2 hours

**Testers can't install**
- Check: Build is "Ready to Submit"
- Verify: Testers accepted invitation
- Check: iOS version compatibility (iOS 14.0+)

---

## 📋 Quick Reference Commands

```bash
# Full build process
npm run build
npx cap sync ios
npx cap open ios

# Install/update CocoaPods
cd ios/App
pod install
cd ../..

# Check Capacitor version
npx cap --version

# List iOS plugins
npx cap ls ios
```

---

## 📝 Important Notes

1. **Bundle ID**: `com.ibeni.app` must match exactly in:
   - Xcode project
   - App Store Connect
   - capacitor.config.ts

2. **Version Numbers**:
   - Marketing Version: User-facing (1.0, 1.1, 2.0)
   - Build Number: Must increment each upload (1, 2, 3...)

3. **Code Signing**:
   - Use "Automatically manage signing" for simplicity
   - Xcode handles certificates/profiles automatically

4. **TestFlight Limits**:
   - Internal: 100 testers, instant access
   - External: 10,000 testers, requires Apple review

5. **Processing Time**:
   - Upload: 5-15 minutes
   - Processing: 15-60 minutes
   - Beta Review (external): 24-48 hours

---

## 🎯 Next Steps After TestFlight

Once testing is complete:

1. **Submit for App Store Review**:
   - App Store Connect → App Store tab
   - Complete app information
   - Submit for review

2. **App Store Listing**:
   - Screenshots (required)
   - Description
   - Keywords
   - Privacy policy URL
   - Support URL

3. **Review Process**:
   - Usually 24-48 hours
   - May require additional information

---

## 📞 Support Resources

- **Apple Developer Support**: https://developer.apple.com/support
- **App Store Connect Help**: https://help.apple.com/app-store-connect
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Xcode Help**: Help menu in Xcode

---

**Last Updated**: Based on Xcode 14+ and Capacitor 7.x
**Project**: ibeni iOS App
**Bundle ID**: com.ibeni.app

