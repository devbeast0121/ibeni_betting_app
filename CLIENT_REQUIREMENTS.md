# Required Information from Client

## Android App Bundle (AAB) - Required Items

### Option A: Existing App (Client has published this app before)
Please provide:
```
1. Keystore file (.jks or .keystore)
   Location: _______________________________

2. Keystore Password: _______________________

3. Key Alias: _______________________________

4. Key Password: ____________________________
```

### Option B: New App (First time publishing)
We have 2 options:

**Option 1**: I can create a new keystore for you
- You MUST keep the keystore file and passwords safe forever
- Without it, you cannot publish app updates
- Store in secure password manager

**Option 2**: You create the keystore
- Use Android Studio or command line
- Send me the file and credentials
- Keep backups in multiple secure locations

---

## iOS App - Choose ONE Option

### ✅ Option 1: Add Me to Your Apple Developer Team (RECOMMENDED)
**My Apple ID**: ________________________________

**Steps for you:**
1. Log in to https://developer.apple.com/account
2. Go to "Membership" → "People"
3. Click "+" to add person
4. Enter my Apple ID above
5. Select role: "Developer" or "Admin"
6. Send invitation

**Advantage**: I can build and submit the app directly

---

### ✅ Option 2: You Build It Yourself (EASIEST)
**Steps:**
1. I will send you the complete iOS project folder
2. You open `ios/App/App.xcworkspace` in Xcode on your Mac
3. You sign in with your Apple Developer account in Xcode
4. You build and submit to App Store Connect

**Advantage**: Most secure, you have full control

**Requirements from you:**
- Mac computer with Xcode installed
- Your Apple Developer account active
- 30-60 minutes of your time to build/submit

---

### ✅ Option 3: Provide Certificates (ADVANCED)
**Steps for you:**
1. Export distribution certificate from Xcode
2. Export App Store provisioning profile
3. Send both files to me
4. Provide certificate password

**Advantage**: I can build without full team access

**Note**: This is more complex - only choose if you're familiar with iOS certificates

---

## App Store Information

### Apple App Store Connect
- Do you have App Store Connect access? YES / NO
- App Store Connect Team ID: _______________________
- App already created in App Store Connect? YES / NO
  - If YES, provide App ID: ________________________

### Google Play Console
- Do you have Google Play Console access? YES / NO
- App already created in Google Play? YES / NO
  - If YES, provide Package Name: __________________
- Current version code (if existing): _______________

---

## App Information (Confirm or Update)

Current settings (from capacitor.config.ts):
- **Bundle ID**: com.ibeni.app
- **App Name**: ibeni

Do you want to change any of these? YES / NO

If YES:
- New Bundle ID: _________________________________
- New App Name: __________________________________

**⚠️ IMPORTANT**: Bundle ID must match what's registered in:
- Apple App Store Connect
- Google Play Console

---

## Timeline

When do you need the builds?
- Preferred date: ___________________________________
- Hard deadline: ____________________________________

---

## Contact Information

Best way to reach you for questions:
- Email: ___________________________________________
- Phone: ___________________________________________
- Preferred: ________________________________________

---

## Checklist - Please Complete

- [ ] Read through both Android and iOS options
- [ ] Chosen Android option (A or B)
- [ ] Chosen iOS option (1, 2, or 3)
- [ ] Provided all required information for chosen options
- [ ] Confirmed or updated Bundle ID and App Name
- [ ] Provided store account information
- [ ] Provided timeline expectations

---

## Return This Document

Please fill out this form and send back with any required files:
- Keystore file (if Android Option A)
- Certificates (if iOS Option 3)

**Secure transfer methods:**
- Password-protected zip file (email)
- Secure file sharing (Google Drive, Dropbox with password)
- In-person USB transfer

**DO NOT** send passwords in the same email as files!
- Send files in one email
- Send passwords in separate communication (text message, phone call, etc.)
