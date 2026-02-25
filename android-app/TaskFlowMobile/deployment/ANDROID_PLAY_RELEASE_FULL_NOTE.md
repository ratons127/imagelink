# Android Play Store Release Build Note (TaskFlowMobile)

This note explains how to build a Play Store-ready Android App Bundle (`.aab`) for `TaskFlowMobile`, including:

- Correct project directory
- Linux `gradlew` permission fix (`Permission denied`)
- Required Java version
- When to build on VM vs local machine
- Signing keystore creation
- Android Studio signed bundle steps
- Gradle command with production API URL (`imagelink.qtiqo.com`)
- Play Console upload checklist

## Project directory (where to run Gradle)

Run Android build commands from:

```bash
/opt/taskflow-backend/android-app/TaskFlowMobile
```

This is the folder that contains:
- `gradlew`
- `app/`
- `settings.gradle.kts`

## Linux VM fix for `./gradlew: Permission denied`

If you see:

```text
-bash: ./gradlew: Permission denied
```

Fix it with:

```bash
cd /opt/taskflow-backend/android-app/TaskFlowMobile
chmod +x gradlew
```

Then run:

```bash
./gradlew bundleRelease -PTASKFLOW_RELEASE_API_BASE_URL=https://imagelink.qtiqo.com/api/
```

## Java requirement (JDK 17)

This Android project uses Java/Kotlin 17.

Install JDK 17 on Ubuntu 24:

```bash
sudo apt update
sudo apt install -y openjdk-17-jdk
java -version
```

Expected major version:
- `17`

## Important: Android SDK requirement on Linux VM

Even after `gradlew` is executable, the build may fail on the VM if Android SDK/Build Tools are not installed.

Typical errors:
- `SDK location not found`
- `No installed build tools found`
- `Failed to find target with hash string android-35`

Because of this, the recommended path is:

1. Host backend on the Linux VM
2. Build Android `.aab` on your Windows PC (Android Studio)

You *can* build on the VM, but only if Android SDK is installed/configured there.

## Production API URL for release build

Your app has been hardened to read a release API URL from the Gradle property:

- `TASKFLOW_RELEASE_API_BASE_URL`

Use this value for production:

```text
https://imagelink.qtiqo.com/api/
```

## Build commands

### Linux (if Android SDK is installed)

```bash
cd /opt/taskflow-backend/android-app/TaskFlowMobile
chmod +x gradlew
./gradlew bundleRelease -PTASKFLOW_RELEASE_API_BASE_URL=https://imagelink.qtiqo.com/api/
```

### Windows PowerShell (recommended)

```powershell
cd D:\Proj-8-todo\android-app\TaskFlowMobile
.\gradlew.bat bundleRelease -PTASKFLOW_RELEASE_API_BASE_URL=https://imagelink.qtiqo.com/api/
```

### Android Studio (recommended for signed Play build)

Open:

```text
D:\Proj-8-todo\android-app\TaskFlowMobile
```

## Output file path (`.aab`)

After a successful release bundle build:

```text
app/build/outputs/bundle/release/app-release.aab
```

## Debug test against production backend (before signing)

Before uploading to Google Play, verify login/register/tasks work against production API:

### Option A (temporary debug build using property)

If you want a quick local check via Gradle:

```powershell
cd D:\Proj-8-todo\android-app\TaskFlowMobile
.\gradlew.bat assembleDebug
```

Then install from Android Studio and test manually. (Debug build uses your debug API URL by default, so confirm it points to production only if intentionally changed.)

### Option B (recommended)

Use Android Studio and temporarily set the debug URL to your production domain for testing, then revert if needed.

## Create signing keystore (first time only)

Google Play requires a signed release. Use Play App Signing (recommended).

### Create keystore on Windows (PowerShell/CMD)

`keytool` comes with JDK.

```powershell
keytool -genkeypair `
  -v `
  -keystore D:\keys\taskflow-release.jks `
  -alias taskflow-release `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000
```

You will be prompted for:
- keystore password
- key password
- name/org/location info

Important:
- Back up the `.jks` file safely
- Store passwords in a secure password manager
- Do not commit the keystore to GitHub

## Build signed AAB in Android Studio (recommended)

1. Open project in Android Studio
2. `Build` -> `Generate Signed Bundle / APK`
3. Select `Android App Bundle`
4. Choose/create keystore (`taskflow-release.jks`)
5. Enter alias + passwords
6. Select `release` build variant
7. Finish build

Output is typically:

```text
app\release\app-release.aab
```

or

```text
app\build\outputs\bundle\release\app-release.aab
```

## Optional: Gradle signing config (later)

You can also configure signing in `app/build.gradle.kts` using a `keystore.properties` file, but for first Play upload Android Studio UI is simpler and safer.

If needed later, create:
- `keystore.properties` (ignored from Git)
- signing config in `app/build.gradle.kts`

## Pre-upload checklist (Google Play)

Before uploading `.aab`:

1. Backend live at `https://imagelink.qtiqo.com/api/`
2. App login/register works on real phone
3. `release` build uses production API URL
4. Password field is masked (already fixed)
5. HTTPS only in production (already fixed)
6. App icon/screenshots ready
7. Privacy Policy URL ready
8. Data Safety form prepared (email/phone/account data)

## Upload to Play Console (recommended path)

1. Google Play Console -> create app
2. Complete store listing
3. Set App content / Data safety / Privacy policy
4. Go to `Testing` -> `Internal testing`
5. Create release and upload `app-release.aab`
6. Add testers and verify install/update
7. Move to closed testing / production

## Common errors and fixes

### 1. `./gradlew: Permission denied`

Fix:

```bash
chmod +x gradlew
```

### 2. `JAVA_HOME` / Java missing

Fix:

```bash
sudo apt install -y openjdk-17-jdk
java -version
```

### 3. Android SDK not found (on Linux VM)

Fix options:
- Install Android SDK + accept licenses on VM
- Or build on Windows using Android Studio (recommended)

### 4. Release app can’t connect to backend

Check:
- Release build command includes `-PTASKFLOW_RELEASE_API_BASE_URL=https://imagelink.qtiqo.com/api/`
- Backend/Nginx/HTTPS is live
- API routes are under `/api`

### 5. `https://imagelink.qtiqo.com` returns `{"message":"Not Found"}`

This is normal if `/` route is not defined.
Test `/api/...` routes instead.

## Security reminders

- Never commit:
  - `.jks` keystore files
  - keystore passwords
  - production `.env` files
- Rotate JWT secrets if they were shared anywhere
- Keep a secure backup of signing keystore and passwords

