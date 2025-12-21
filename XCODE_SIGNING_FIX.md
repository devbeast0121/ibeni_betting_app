# Xcode Signing Issue - Personal Team Fix

## ❌ Problem
Xcode is using **"Personal Team"** for code signing, which cannot distribute to TestFlight or App Store.

**Current Status:**
- Team: `smykalo illia (Personal Team)` ❌
- Needed: Developer Team (paid Apple Developer Program) ✅

---

## ✅ Solution: Switch to Developer Team

### Step 1: Verify Apple Developer Account Access

1. **Check App Store Connect**:
   - Go to: https://appstoreconnect.apple.com
   - Sign in with the account that has **Account Holder** or **Admin** role
   - Verify the app `ibeni` exists with Bundle ID: `com.ibeni.app`

2. **Verify Developer Program Membership**:
   - The account must have an **active paid Apple Developer Program membership** ($99/year)
   - Personal Teams (free) cannot distribute to TestFlight

---

### Step 2: Add Developer Account to Xcode

1. **Open Xcode Preferences**:
   - `Xcode → Settings` (or `Preferences` on older versions)
   - Or press `Cmd + ,`

2. **Go to Accounts Tab**:
   - Click **"Accounts"** tab at the top

3. **Add Apple ID**:
   - Click the **"+"** button at bottom left
   - Select **"Apple ID"**
   - Sign in with the account that has Developer Program access:
     - `radsky@gmail.com` (Tyler Sheradsky - Account Holder)
     - Or another account with Admin/Developer role

4. **Verify Team**:
   - After adding, you should see:
     - **Personal Team** (free, cannot distribute)
     - **Developer Team** (paid, can distribute) ✅
   - The Developer Team should show the team name or organization name

---

### Step 3: Switch Team in Project Settings

1. **In Xcode Project**:
   - Select **"App"** project in left sidebar
   - Select **"App"** target
   - Go to **"Signing & Capabilities"** tab

2. **Change Team**:
   - Find **"Team"** dropdown
   - Select the **Developer Team** (NOT Personal Team)
   - Should show something like:
     - `Tyler Sheradsky (Developer Team)` ✅
     - Or your organization name

3. **Verify Signing**:
   - "Automatically manage signing" should be checked
   - Bundle Identifier: `com.ibeni.app`
   - Provisioning Profile should auto-generate
   - Should see: **"Provisioning profile created"** or similar

---

### Step 4: Verify Bundle ID in App Store Connect

1. **Check App Store Connect**:
   - Go to: https://appstoreconnect.apple.com
   - Navigate to **"My Apps"** → **"ibeni"**
   - Verify Bundle ID matches: `com.ibeni.app`

2. **If App Doesn't Exist**:
   - Click **"+"** to create new app
   - Bundle ID: `com.ibeni.app`
   - App Name: `ibeni`
   - Primary Language: Your choice
   - SKU: Can be same as Bundle ID

---

## 🔍 Troubleshooting

### Issue: Developer Team Not Showing

**Solution 1: Refresh Teams**
- In Xcode → Settings → Accounts
- Select the Apple ID
- Click **"Download Manual Profiles"**
- Wait for download to complete
- Try selecting team again

**Solution 2: Check Membership Status**
- Go to: https://developer.apple.com/account
- Sign in with the Developer account
- Check **"Membership"** section
- Verify status is **"Active"** and shows **"Apple Developer Program"**

**Solution 3: Re-add Account**
- Remove account from Xcode (Settings → Accounts → select account → "-")
- Add it again
- Sign in fresh

---

### Issue: "No provisioning profile found"

**Solution:**
1. Ensure "Automatically manage signing" is checked
2. Select the correct Developer Team
3. Xcode will auto-create provisioning profile
4. If still fails, click **"Try Again"** or **"Download Manual Profiles"**

---

### Issue: "Bundle identifier is already in use"

**Solution:**
- This means the Bundle ID is registered to a different team
- Options:
  1. Use the team that owns the Bundle ID
  2. Change Bundle ID (requires updating App Store Connect)
  3. Transfer the app to your team (complex process)

---

### Issue: "Account doesn't have permission"

**Solution:**
- The Apple ID must have **Admin** or **Account Holder** role
- Check in App Store Connect → Users and Access
- If you're a Developer (not Admin), you may need:
  - Admin to grant you App Manager or Admin role
  - Or use the Account Holder's Apple ID

---

## ✅ Verification Checklist

After fixing, verify:

- [ ] Team shows **Developer Team** (not Personal Team)
- [ ] "Automatically manage signing" is checked
- [ ] Bundle Identifier: `com.ibeni.app`
- [ ] Provisioning Profile shows as created/valid
- [ ] No red errors in Signing & Capabilities
- [ ] Can build successfully (Cmd + B)
- [ ] Can create archive (Product → Archive)

---

## 📝 Expected Result

**Before (Wrong):**
```
Team: smykalo illia (Personal Team) ❌
```

**After (Correct):**
```
Team: Tyler Sheradsky (Developer Team) ✅
or
Team: [Your Organization] (Developer Team) ✅
```

---

## 🚀 Next Steps After Fixing

Once the correct team is selected:

1. **Clean Build**:
   - `Product → Clean Build Folder` (Shift + Cmd + K)

2. **Create Archive**:
   - Select "Any iOS Device"
   - `Product → Archive`

3. **Distribute**:
   - Click "Distribute App"
   - Choose "App Store Connect"
   - Upload to TestFlight

---

## 📞 Still Having Issues?

If the Developer Team still doesn't appear:

1. **Verify Membership**:
   - https://developer.apple.com/account → Membership
   - Must show "Apple Developer Program" (not just "Apple ID")

2. **Check Team Access**:
   - App Store Connect → Users and Access
   - Your account must have Admin or Account Holder role

3. **Contact Support**:
   - Apple Developer Support: https://developer.apple.com/support
   - Or contact the Account Holder to grant proper access

---

**Last Updated**: Based on your current Xcode configuration
**Issue**: Personal Team selected instead of Developer Team
**Solution**: Switch to Developer Team in Signing & Capabilities

