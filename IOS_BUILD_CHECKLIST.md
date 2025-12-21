# iOS Build & TestFlight Checklist

Use this checklist for each iOS build and TestFlight distribution.

---

## 📋 Pre-Build Preparation

### Code & Dependencies
- [ ] All code changes committed and pushed
- [ ] Dependencies up to date (`npm install`)
- [ ] No TypeScript/ESLint errors
- [ ] Web app tested in browser (`npm run dev`)

### Version Management
- [ ] Version number updated (if new release)
  - Current: `1.0` (Marketing Version)
  - Current: `1` (Build Number)
- [ ] Build number incremented (required for each upload)
- [ ] Version matches in:
  - [ ] `package.json`
  - [ ] Xcode project settings
  - [ ] App Store Connect (if app exists)

### Configuration
- [ ] `capacitor.config.ts` verified
  - Bundle ID: `com.ibeni.app`
  - App Name: `ibeni`
  - Web Dir: `dist`
- [ ] `Info.plist` verified
  - Privacy descriptions present
  - App icons configured
  - Background modes (if needed)

---

## 🔨 Build Process

### Step 1: Build Web Assets
- [ ] Run `npm run build`
- [ ] Verify `dist/` folder exists and has content
- [ ] Check for build errors/warnings

### Step 2: Sync Capacitor
- [ ] Run `npx cap sync ios`
- [ ] Verify no sync errors
- [ ] Check `ios/App/App/public/` has latest files

### Step 3: Install Pods (if needed)
- [ ] Navigate to `ios/App/`
- [ ] Run `pod install` (if dependencies changed)
- [ ] Verify Pods installed successfully

### Step 4: Open Xcode
- [ ] Run `npx cap open ios`
- [ ] Or manually open `ios/App/App.xcworkspace`
- [ ] ⚠️ Verify opened `.xcworkspace` (NOT `.xcodeproj`)

---

## ⚙️ Xcode Configuration

### Project Settings
- [ ] Project opened successfully
- [ ] No red errors in project navigator
- [ ] All files present (no missing files)

### Signing & Capabilities
- [ ] Select "App" target
- [ ] Go to "Signing & Capabilities" tab
- [ ] "Automatically manage signing" checked
- [ ] Team selected (your Apple Developer team)
- [ ] Bundle Identifier: `com.ibeni.app`
- [ ] No signing errors/warnings

### Capabilities
- [ ] Push Notifications enabled (if using)
- [ ] Background Modes → Remote notifications (if using)
- [ ] Other capabilities as needed

### Version & Build
- [ ] General tab → Version: `[current version]`
- [ ] General tab → Build: `[incremented number]`
- [ ] Build number higher than previous TestFlight upload

### Build Settings
- [ ] Device: "Any iOS Device" selected
- [ ] Scheme: "App" selected
- [ ] Configuration: "Release" (for archive)

---

## 📦 Archive Creation

### Pre-Archive
- [ ] Clean Build Folder (Shift + Cmd + K)
- [ ] No build errors
- [ ] All warnings reviewed (if any)

### Create Archive
- [ ] Product → Archive
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Organizer window opens automatically

### Verify Archive
- [ ] Archive appears in Organizer
- [ ] No errors in archive
- [ ] Correct version number shown
- [ ] Correct build number shown
- [ ] Archive size reasonable (not suspiciously large/small)

---

## 🚀 TestFlight Upload

### Distribution Setup
- [ ] Click "Distribute App" in Organizer
- [ ] Select "App Store Connect"
- [ ] Select "Upload"
- [ ] App Thinning: Include bitcode (if supported)
- [ ] Upload symbols: Enabled
- [ ] Signing: Automatically manage signing

### Upload Process
- [ ] Review summary (app name, bundle ID, version)
- [ ] Click "Upload"
- [ ] Upload progress shows (5-15 minutes)
- [ ] Upload completes successfully
- [ ] Note upload ID/timestamp

### Post-Upload
- [ ] Check email for upload confirmation
- [ ] Go to App Store Connect → TestFlight
- [ ] Build appears in "Processing" status
- [ ] Wait for processing (15-60 minutes)
- [ ] Check email when processing completes

---

## 📱 App Store Connect Configuration

### App Setup (First Time Only)
- [ ] App created in App Store Connect
- [ ] Bundle ID matches: `com.ibeni.app`
- [ ] App information completed:
  - [ ] App name
  - [ ] Category
  - [ ] Privacy policy URL
  - [ ] Support URL

### TestFlight Setup
- [ ] Build status: "Ready to Submit"
- [ ] Test Information completed:
  - [ ] What to Test
  - [ ] Feedback Email
  - [ ] Marketing URL (optional)
  - [ ] Privacy Policy URL

### Internal Testing
- [ ] Internal test group created
- [ ] Testers added (up to 100)
- [ ] Build assigned to group
- [ ] Testing started
- [ ] Testers notified via email

### External Testing (Beta)
- [ ] External test group created
- [ ] Testers added (up to 10,000)
- [ ] Build assigned to group
- [ ] Beta review submitted
- [ ] Beta review information completed:
  - [ ] What's New
  - [ ] Notes
  - [ ] Contact Information
  - [ ] Demo Account (if needed)
- [ ] Wait for Apple review (24-48 hours)

---

## ✅ Post-Upload Verification

### Build Status
- [ ] Build processed successfully
- [ ] No processing errors
- [ ] Build shows "Ready to Submit"

### TestFlight Testing
- [ ] Internal testers can install
- [ ] App launches successfully
- [ ] Core features work
- [ ] Push notifications work (if applicable)
- [ ] No critical bugs found

### Monitoring
- [ ] TestFlight dashboard checked
- [ ] Crash reports reviewed (if any)
- [ ] Tester feedback reviewed
- [ ] Analytics checked

---

## 🔄 For Next Build

### Before Next Build
- [ ] Increment build number
- [ ] Update version (if new release)
- [ ] Document changes in "What's New"
- [ ] Test locally first

### Repeat Process
- [ ] Follow all steps above
- [ ] New build number must be higher
- [ ] Replace old build in test groups

---

## 🐛 Common Issues & Solutions

### Build Fails
- [ ] Check: All dependencies installed
- [ ] Check: Pods installed (`pod install`)
- [ ] Check: No syntax errors
- [ ] Check: Signing configured correctly
- [ ] Solution: Clean build folder, rebuild

### Upload Fails
- [ ] Check: Internet connection stable
- [ ] Check: Bundle ID matches App Store Connect
- [ ] Check: Version/build numbers valid
- [ ] Solution: Try upload again

### Processing Fails
- [ ] Check: Email for specific error
- [ ] Check: Info.plist has all required keys
- [ ] Check: App icons present
- [ ] Solution: Fix issues, rebuild, re-upload

### Testers Can't Install
- [ ] Check: Build is "Ready to Submit"
- [ ] Check: Testers accepted invitation
- [ ] Check: iOS version compatibility
- [ ] Solution: Verify test group configuration

---

## 📝 Notes Section

**Build Date**: _______________
**Version**: _______________
**Build Number**: _______________
**Upload Time**: _______________
**Processing Complete**: _______________
**Issues Encountered**: _______________
**Resolution**: _______________

---

## 🎯 Quick Command Reference

```bash
# Full build process
npm run build && npx cap sync ios && npx cap open ios

# Check versions
npx cap --version
npm list @capacitor/core

# Clean and rebuild
cd ios/App && pod install && cd ../..
npm run build && npx cap sync ios
```

---

**Last Updated**: [Date]
**Project**: ibeni
**Bundle ID**: com.ibeni.app

