# Mobile App Setup (Android + Local Docker)

This guide helps you run the native Android app with the local Docker backend.

## 1. Start backend locally (Docker)

From repo root:

```powershell
docker compose up -d --build
```

Check backend health:

```text
http://localhost:4000/api/health
```

Expected response:

```json
{"status":"ok"}
```

## 2. Android Studio project

Open:

```text
android-app/TaskFlowMobile
```

## 3. Run in emulator

- Start an Android Emulator (AVD) from Android Studio Device Manager
- Build and run the `app` module

Default debug API URL (already configured):

```text
http://10.0.2.2:4000/api/
```

## 4. If emulator cannot reach `10.0.2.2`

Use `adb reverse` and point app to localhost inside emulator.

### ADB commands (Windows)

```powershell
C:\Users\raton\AppData\Local\Android\Sdk\platform-tools\adb.exe devices
C:\Users\raton\AppData\Local\Android\Sdk\platform-tools\adb.exe reverse tcp:4000 tcp:4000
```

Then set Android debug API URL in:

`android-app/TaskFlowMobile/app/build.gradle.kts`

to:

```kotlin
buildConfigField("String", "API_BASE_URL", "\"http://127.0.0.1:4000/api/\"")
```

Rebuild and run the app.

Health check in emulator browser (after `adb reverse`):

```text
http://127.0.0.1:4000/api/health
```

## 5. Test login

Test user created during setup:

- Email: `androidtest_20260224_105821@example.com`
- Password: `TestPass123!`

## 6. EC2 deployment

Single-server EC2 deployment files are in:

- `deploy/ec2/docker-compose.ec2.yml`
- `deploy/ec2/.env.example`
- `deploy/ec2/README.md`

