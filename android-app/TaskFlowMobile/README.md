# TaskFlow Mobile (Android)

Native Android client for the TaskFlow backend using:
- Kotlin
- Jetpack Compose
- Retrofit + OkHttp

## Features included

- Login
- Register
- Token persistence (SharedPreferences)
- Auto refresh access token using refresh token
- Load current user
- Load task lists
- Load tasks for selected list
- Create task
- Toggle task done / todo

## Configure API URL

Edit `app/build.gradle.kts` (or pass a Gradle property for release):

- `debug` uses `http://10.0.2.2:4000/api/` (Android emulator -> local machine)
- `release` reads `TASKFLOW_RELEASE_API_BASE_URL` (fallback placeholder is `https://your-api-domain.example/api/`)

For EC2 testing on device, set debug URL to your server:

```kotlin
buildConfigField("String", "API_BASE_URL", "\"http://YOUR_EC2_IP:4000/api/\"")
```

## Run

1. Open `android-app/TaskFlowMobile` in Android Studio.
2. Let Gradle sync.
3. Run on emulator or device.

## Notes

- Cleartext HTTP is enabled for `debug` only.
- For production mobile builds, use HTTPS and set the release URL.

## Linux VM Backend Template

See `deployment/linux-vm/README.md` for a simple `Nginx + systemd` deployment template.
